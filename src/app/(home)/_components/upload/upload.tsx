"use client";

import { Upload } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { uploadFile } from "./uploadFile";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

const UploadTab = () => {
  const router = useRouter();

  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: search } = trpc.search.searchWithUrl.useMutation({
    onSuccess: (data) => {
      setIsLoading(false);
      router.push(`/search/${data.id}`);
    },
  });

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
    setIsLoading(true);
    const safeUrl = await uploadFile(file);
    search({
      url: safeUrl,
    });
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadAndSearchFile(e.dataTransfer.files[0]);
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

export default UploadTab;
