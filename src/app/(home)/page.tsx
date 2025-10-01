import Features from "@/app/(home)/_components/features";
import Slogan from "@/app/(home)/_components/slogan";
import Upload from "@/app/(home)/_components/upload";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Slogan />
      <Upload />
      <Features />
    </div>
  );
}
