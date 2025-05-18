"use client";

import ImageCropper from "@/components/imageCropper";
import { Button, Card, CardBody } from "@heroui/react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Editor = () => {
  const router = useRouter();
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the uploaded file from sessionStorage
    const uploadedFile = sessionStorage.getItem("uploadedFile");
    const uploadedFileName = sessionStorage.getItem("uploadedFileName");
    const uploadedFileType = sessionStorage.getItem("uploadedFileType");

    if (!uploadedFile) {
      router.push("/");
      return;
    }

    setFileData(uploadedFile);
    setFileName(uploadedFileName);
    setFileType(uploadedFileType);
  }, [router]);

  return (
    <div className="container pt-16">
      <div className="flex items-center mb-6">
        <Button
          variant="light"
          size="md"
          onPress={() => router.push("/")}
          className=""
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Edit & Crop</h1>
      </div>
      <div>
        <Card>
          <CardBody>
            {fileData && fileType === "image" && (
              <ImageCropper
                imageSrc={fileData}
                onCropComplete={(croppedAreaPixels) => {
                  // Handle the cropped area here
                  console.log("Cropped area:", croppedAreaPixels);
                }}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Editor;
