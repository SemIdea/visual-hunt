"use client";

import { Button, Card, CardBody, Tab, Tabs } from "@heroui/react";
import { FileImage, FileVideo, Upload } from "lucide-react";

const UploadSection = () => {
  return (
    <div className="border-1 border-zinc-800 rounded-t-2xl rounded-b-md max-w-3xl w-full">
      <Tabs radius="sm" fullWidth>
        <Tab key="upload" title="Upload File">
          <div className="mx-4 my-3 border-dashed border-gray-400 border-[2px] rounded-md relative">
            <input
              type="file"
              className="w-full h-full opacity-0 absolute top-0 left-0 cursor-pointer"
              id="file-upload"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  console.log(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col items-center gap-4 p-6">
              <div className="rounded-full bg-secondary p-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2 text-center">
                <h3 className="font-medium">Drag & drop your file</h3>
                <p className="text-sm text-muted-foreground">
                  Supports images (JPG, PNG, GIF, WebP) and videos (MP4, WebM,
                  MOV)
                </p>
                <p className="text-xs text-muted-foreground">
                  Max file size: 10MB
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="md"
                  radius="sm"
                  onPress={() => {
                    const fileInput = document.getElementById("file-upload");
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileImage className="h-4 w-4" />
                <span>Images</span>
                <span className="text-muted-foreground/50">|</span>
                <FileVideo className="h-4 w-4" />
                <span>Videos</span>
              </div>
            </div>
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
