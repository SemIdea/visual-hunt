"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const useUploadImage = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: search } = trpc.search.searchWithUrl.useMutation({
    onSuccess: (data) => {
      setIsLoading(false);
      router.push(`/search/${data.id}`);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!imageUrl) return;
    setIsLoading(true);
    search({
      url: imageUrl,
    });
  }, [imageUrl, search]);

  return {
    imageUrl,
    isLoading,
    setImageUrl,
    handleSubmit,
  };
};

const UrlTab = () => {
  const { imageUrl, isLoading, setImageUrl, handleSubmit } = useUploadImage();

  return (
    <div className="grid w-full gap-1.5">
      <div className="grid w-full items-center gap-3">
        <Label htmlFor="url">Image URL</Label>
        <div className="flex gap-3">
          <Input
            id="url"
            placeholder="https://example.com/image.jpg"
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button
            className="cursor-pointer dark:text-white"
            onClick={handleSubmit}
            disabled={!imageUrl || isLoading}
          >
            {isLoading ? <Spinner /> : null}
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Enter the URL of an image to search
      </p>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      {imageUrl && <img src={imageUrl} alt="Preview" />}
    </div>
  );
};

export default UrlTab;
