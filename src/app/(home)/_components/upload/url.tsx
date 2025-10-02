"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const useUploadImage = () => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");

  const { mutate: search } = trpc.search.searchWithUrl.useMutation({
    onSuccess: (data) => {
      router.push(`/search/${data.id}`);
    },
  });

  const handleSubmit = useCallback(() => {
    search({
      url: imageUrl,
    });
  }, [imageUrl, search]);

  return {
    imageUrl,
    setImageUrl,
    handleSubmit,
  };
};

const UrlTab = () => {
  const { imageUrl, setImageUrl, handleSubmit } = useUploadImage();

  return (
    <div className="p-6">
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
              color="primary"
              className="cursor-pointer"
              onClick={handleSubmit}
            >
              Search
            </Button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Enter the URL of an image to search
        </p>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        {imageUrl && <img src={imageUrl} alt="Preview" />}
      </div>
    </div>
  );
};

export default UrlTab;
