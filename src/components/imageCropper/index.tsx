import Cropper from "react-easy-crop";
import ReactCrop, { type Crop } from "react-image-crop";
import { Button } from "@heroui/react";
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useState } from "react";

type ImageCropperProps = {
  imageSrc: string;
  onCropComplete: (croppedArea: any) => void;
};

const ImageCropper = ({ imageSrc, onCropComplete }: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      onCropComplete(croppedAreaPixels);
    },
    [onCropComplete]
  );

  const handleZoomChange = useCallback((value: number[]) => {
    setZoom(value[0]);
  }, []);

  const decreaseZoom = useCallback(() => {
    setZoom((prev) => Math.max(1, prev - 0.1));
  }, []);

  const increaseZoom = useCallback(() => {
    setZoom((prev) => Math.min(3, prev + 0.1));
  }, []);

  const rotateLeft = useCallback(() => {
    setRotation((prev) => prev - 90);
  }, []);

  const rotateRight = useCallback(() => {
    setRotation((prev) => prev + 90);
  }, []);

  return (
    <div>
      <div className="relative h-max overflow-hidden rounded-md ">
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          minHeight={100}
        >
          <img
            alt="Crop me"
            src={imageSrc}
            className="h-full w-full object-cover"
          />
        </ReactCrop>
      </div>

      <div className="controls-container mt-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Button variant="bordered" onPress={decreaseZoom} className="h-8 w-8">
            <ZoomOut className="h-4 w-4" />
          </Button>

          {/* <Slider
        value={[zoom]}
        min={1}
        max={3}
        step={0.1}
        onValueChange={handleZoomChange}
        className="flex-1"
          /> */}

          <Button variant="bordered" onPress={increaseZoom} className="h-8 w-8">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="bordered" onPress={rotateLeft} className="h-8 w-8">
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="bordered" onPress={rotateRight} className="h-8 w-8">
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
