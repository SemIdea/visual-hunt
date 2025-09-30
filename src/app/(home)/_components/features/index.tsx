import { CropIcon, Image as ImageIcon, Search, Upload, Video, Wand2 } from "lucide-react";
import FeatureCard from "./card";

const Features = () => {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold">How It Works</h2>
        <p className="mt-2 text-muted-foreground">
          Powerful visual search in just a few steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Upload />}
          title="Upload Media"
          description="Drag and drop or select an image or video to analyze"
        />
        <FeatureCard
          icon={<CropIcon />}
          title="Select Region"
          description="Crop and isolate the specific area you want to search"
        />
        <FeatureCard
          icon={<Search />}
          title="Get Results"
          description="Find visually similar content from across the web"
        />
        <FeatureCard
          icon={<ImageIcon />}
          title="Image Support"
          description="Upload JPG, PNG, GIF, WebP and other popular formats"
        />
        <FeatureCard
          icon={<Video />}
          title="Video Support"
          description="Extract frames from video files for precise searching"
        />
        <FeatureCard
          icon={<Wand2 />}
          title="Smart Results"
          description="Get relevant matches based on visual similarity"
        />
      </div>
    </section>
  );
};

export default Features;
