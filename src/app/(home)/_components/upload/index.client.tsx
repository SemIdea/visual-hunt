"use client";

import { useMutation } from "@tanstack/react-query";
import { Search, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import {
    type ChangeEvent,
    type DragEvent,
    type KeyboardEvent,
    useCallback,
    useRef,
    useState,
} from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth/context";
import { useTRPC } from "@/lib/trpc/client";

export const uploadFile = async (file: File | string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "default_visual");

    const response = await fetch("https://api.cloudinary.com/v1_1/dmu6nlwyt/upload", {
        method: "POST",
        body: formData,
    });
    const data = (await response.json()) as {
        secure_url?: string;
        error?: { message?: string };
    };
    if (response.ok && data.secure_url) {
        return data.secure_url;
    }

    throw new Error(data.error?.message ?? "Unable to upload image.");
};

const useUploadImage = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const { isAuthenticated } = useAuth();
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { mutate: search } = useMutation(
        trpc.search.startSearch.mutationOptions({
            onSuccess: (data) => {
                setIsLoading(false);
                router.push(`/search/${data.searchId}`);
            },
            onError: (err) => {
                setError(err.message);
                setIsLoading(false);
            },
        }),
    );

    const ensureAuthenticated = useCallback(() => {
        if (isAuthenticated) return true;
        router.push("/auth/login");
        return false;
    }, [isAuthenticated, router]);

    const startSearch = useCallback(
        (url: string) => {
            if (!url) return;
            if (!ensureAuthenticated()) return;

            setError(null);
            setIsLoading(true);
            search({ imageUrl: url });
        },
        [ensureAuthenticated, search],
    );

    const uploadAndSearch = useCallback(
        async (file: File | string) => {
            if (!ensureAuthenticated()) return;

            setError(null);
            setIsLoading(true);

            try {
                const safeUrl = await uploadFile(file);
                setImageUrl(safeUrl);
                search({ imageUrl: safeUrl });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to upload image.");
                setIsLoading(false);
            }
        },
        [ensureAuthenticated, search],
    );

    const handleSubmit = useCallback(async () => {
        if (!imageUrl) return;
        await uploadAndSearch(imageUrl);
    }, [imageUrl, uploadAndSearch]);

    return {
        error,
        imageUrl,
        isLoading,
        setImageUrl,
        handleSubmit,
        startSearch,
        uploadAndSearch,
    };
};

const UrlTab = () => {
    const { error, imageUrl, isLoading, setImageUrl, handleSubmit } = useUploadImage();

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    placeholder="Paste image or video URL..."
                    className="flex-1"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
                <Button className="gap-2" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Spinner /> : <Search />}
                    Search
                </Button>
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>
    );
};

const UploadTab = () => {
    const { error, isLoading, uploadAndSearch } = useUploadImage();
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            fileInputRef.current?.click();
        }
    };

    const handleDrop = async (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const files = e.dataTransfer?.files;
        if (files?.[0]) {
            await uploadAndSearch(files[0]);
        }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            await uploadAndSearch(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-2">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors ${
                    dragActive
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                }`}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*,video/*"
                />
                {isLoading ? (
                    <Spinner className="mb-4 h-12 w-12 text-muted-foreground" />
                ) : (
                    <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                )}

                <p className="mb-2 text-sm font-medium">Drop your image or video here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
            </div>
            {error ? <p className="text-sm text-red-500">{error}</p> : null}
        </div>
    );
};

export { UploadTab, UrlTab };
