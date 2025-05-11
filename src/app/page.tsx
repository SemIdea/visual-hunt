import Features from "@/components/features";
import Header from "@/components/header";
import Slogan from "@/components/slogan";
import Upload from "@/components/upload/intex";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <Slogan />
      <Upload />
      <Features />  
    </div>
  );
}
