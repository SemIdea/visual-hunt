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
    const data = await response.json();
    if (response.ok) {
        return data.secure_url;
    } else {
        throw new Error(data.error.message);
    }
};

const useUploadImage = () => {
    const router = useRouter();
    const trpc = useTRPC();
    const { isAuthenticated } = useAuth();
    const [imageUrl, setImageUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: search } = useMutation(
        trpc.search.searchWithUrl.mutationOptions({
            onSuccess: (data) => {
                setIsLoading(false);
                router.push(`/search/${data.id}`);
            },
            onError: () => {
                setIsLoading(false);
            },
        }),
    );

    const startSearch = useCallback(
        (url: string) => {
            if (!url) return;
            if (!isAuthenticated) {
                router.push("/auth/login");
                return;
            }

            setIsLoading(true);
            search({ url });
        },
        [isAuthenticated, router, search],
    );

    const handleSubmit = useCallback(async () => {
        if (!imageUrl) return;
        const safeUrl = await uploadFile(imageUrl);
        startSearch(safeUrl);
    }, [imageUrl, startSearch]);

    return {
        imageUrl,
        isLoading,
        setIsLoading,
        setImageUrl,
        handleSubmit,
        startSearch,
    };
};

const UrlTab = () => {
    const { imageUrl, isLoading, setImageUrl, handleSubmit } = useUploadImage();

    return (
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
    );
};

const UploadTab = () => {
    const { isLoading, setImageUrl, startSearch } = useUploadImage();
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

    const uploadAndSearchFile = async (file: File | string) => {
        const safeUrl = await uploadFile(file);
        setImageUrl(safeUrl);
        startSearch(safeUrl);
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
            uploadAndSearchFile(files[0]);
        }
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            uploadAndSearchFile(e.target.files[0]);
        }
    };

    return (
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
                dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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
    );
};

export { UploadTab, UrlTab };
