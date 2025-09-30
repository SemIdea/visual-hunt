"use client";

import { useState } from "react";

const UploadTab = () => {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="mx-4 my-3 p-6 border-dashed border-gray-400 border-[2px] rounded-md relative">
      <UploadingImage isUploading={isUploading} />
      <UploadImage isUploading={isUploading} setIsUploading={setIsUploading} />
    </div>
  );
};

const UploadingImage = ({ isUploading }: { isUploading: boolean }) => {
  if (!isUploading) return;

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="loading-animation" role="status">
        <span className="sr-only">Uploading...</span>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">
        Uploading...
      </p>
    </div>
  );
};

const UploadImage = ({
  isUploading,
  setIsUploading,
}: {
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
}) => {
  const [image, setImage] = useState<{
    blob: string;
    name: string;
    type: string;
  }>();

  if (isUploading) return;

  return (
    <>
      <input
        type="file"
        className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
        id="file-upload"
        accept="image/png, image/gif, image/jpeg"
        onChange={async (e) => {
          if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setIsUploading(true);

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (e) => {
              setImage({
                name: file.name,
                blob: e.target?.result as string,
                type: file.type,
              });
            };
          }
        }}
      />
      {image && (
        <>
          <img src={image.blob} alt={image.name} />
        </>
      )}
    </>
  );
};

export default UploadTab;
