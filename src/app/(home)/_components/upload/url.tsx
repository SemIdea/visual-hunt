"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { uploadFile } from "./uploadFile";

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

export default UrlTab;
