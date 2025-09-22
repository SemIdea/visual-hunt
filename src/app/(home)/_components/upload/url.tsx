import { Button } from "@heroui/react";
import { File } from "lucide-react";

const UrlTab = () => {
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
          />
          <Button color="primary" radius="sm" className="text-zinc-900">
            <File className="h-7 w-7" />
            Fetch
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Enter the URL of an image to search
        </p>
      </div>
    </div>
  );
};

export default UrlTab;
