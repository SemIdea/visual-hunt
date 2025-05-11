"use client";

import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import { FileImage, FileVideo, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const UploadSection = () => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("upload");
  const [isUploading, setIsUploading] = useState(false);

  const handleFilesAccepted = useCallback(
    (files: File[]) => {
      if (!files.length) return;

      setIsUploading(true);

      // In a real app, we would handle file upload to a server here
      // For this demo, we'll simulate an upload and redirect to the editor
      setTimeout(() => {
        const fileType = files[0].type.startsWith("image/") ? "image" : "video";

        // Store the file in sessionStorage (in a real app, upload to server and get URL)
        try {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              sessionStorage.setItem("uploadedFile", e.target.result as string);
              sessionStorage.setItem("uploadedFileName", files[0].name);
              sessionStorage.setItem("uploadedFileType", fileType);
              router.push("/editor");
            }
          };
          reader.readAsDataURL(files[0]);
        } catch (error) {
          console.error("Error reading file:", error);
        }

        setIsUploading(false);
      }, 1500);
    },
    [router]
  );

  return (
    <div className="border-1 border-zinc-800 rounded-t-2xl rounded-b-md max-w-3xl w-full">
      <Tabs radius="sm" fullWidth>
        <Tab key="upload" title="Upload File">
          <div className="mx-4 my-3 p-6 border-dashed border-gray-400 border-[2px] rounded-md relative">
            {isUploading ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="loading-animation" role="status">
                  <span className="sr-only">Uploading...</span>
                </div>
                <p className="text-sm text-muted-foreground animate-pulse">
                  Uploading...
                </p>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
                  id="file-upload"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFilesAccepted(Array.from(e.target.files));
                    }
                  }}
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-full bg-secondary p-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="font-semibold">Drag & drop your file</h3>
                    <p className="text-sm text-gray-400">
                      Supports images (JPG, PNG, GIF, WebP) and videos (MP4,
                      WebM, MOV)
                    </p>
                    <p className="text-xs text-gray-400">Max file size: 10MB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="md"
                      radius="sm"
                      onPress={() => {
                        const fileInput =
                          document.getElementById("file-upload");
                        if (fileInput) {
                          fileInput.click();
                        }
                      }}
                      color="primary"
                      className="text-zinc-900"
                    >
                      Select File
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FileImage className="h-4 w-4" />
                    <span>Images</span>
                    <span className="text-gray-400/50">|</span>
                    <FileVideo className="h-4 w-4" />
                    <span>Videos</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </Tab>
        <Tab key="url" title="URL">
          <h2>Hello World</h2>
        </Tab>
      </Tabs>
    </div>
  );
};

export default UploadSection;
