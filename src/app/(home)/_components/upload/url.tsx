"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@heroui/react";
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
        <label htmlFor="url" className="text-sm font-medium">
          Image URL
        </label>
        <div className="flex gap-2">
          <input
            id="url"
            placeholder="https://example.com/image.jpg"
            className="flex h-10 w-full rounded-md border border-zinc-800 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            onChange={(e) => setImageUrl(e.target.value)}
          />
          <Button
            color="primary"
            radius="sm"
            className="text-zinc-900"
            onPress={handleSubmit}
          >
            <File className="h-7 w-7" />
            Fetch
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the URL of an image to search
        </p>

        {imageUrl && <img src={imageUrl} alt="Preview" />}
      </div>
    </div>
  );
};

export default UrlTab;
