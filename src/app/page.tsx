import Features from "@/components/features";
import Slogan from "@/components/slogan";
import Upload from "@/components/upload/intex";

export default function Home() {
  return (
      <div className="flex flex-col items-center">
        <Slogan />
        <Upload />
        <Features />
      </div>
  );
}
