"use client";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
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
  // const { imageUrl, isLoading, setImageUrl, handleSubmit } = useUploadImage();

  return (
    <div className="flex gap-2">
      <Input placeholder="Paste image or video URL..." className="flex-1" />
      <Button className="gap-2">
        <Search className="h-4 w-4" />
        Search
      </Button>
    </div>
  );
};

export default UrlTab;
