"use client";

import { useTRPC } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, DragEvent, useCallback, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Search, Upload } from "lucide-react";

export const uploadFile = async (file: File | string): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "default_visual");

  const response = await fetch(
    "https://api.cloudinary.com/v1_1/dmu6nlwyt/upload",
    {
      method: "POST",
      body: formData,
    }
  );
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
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: search } = useMutation(
    trpc.search.searchWithUrl.mutationOptions({
      onSuccess: (data) => {
        setIsLoading(false);
        router.push(`/search/${data.id}`);
      },
    })
  );

  const handleSubmit = useCallback(async () => {
    if (!imageUrl) return;
    setIsLoading(true);
    const safeUrl = await uploadFile(imageUrl);
    search({
      url: safeUrl,
    });
  }, [imageUrl, search]);

  return {
    imageUrl,
    isLoading,
    setIsLoading,
    setImageUrl,
    handleSubmit,
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
  const { isLoading, setImageUrl, handleSubmit } = useUploadImage();
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
    handleSubmit();
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer?.files;
    if (files && files[0]) {
      uploadAndSearchFile(files[0]);
    }
  };

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
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
  );
};

export { UrlTab, UploadTab };
