"use client";

import Link from "next/link";
import { Search, Upload, Home } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b border-b-zinc-800 backdrop-blur-md bg-background/90 z-50 flex justify-center">
      <div className="container max-w-5xl h-full flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Search className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl hidden sm:inline-block">
            VisualHunt
          </span>
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link href="/">
            <Button
              size="md"
              radius="sm"
              startContent={<Home className="h-4 w-4" />}
              color="primary"
              className="text-zinc-900"
            >
              Home
            </Button>
          </Link>

          <Link href="/editor">
            <Button
              size="md"
              radius="sm"
              startContent={<Upload className="h-4 w-4" />}
              variant="light"
            >
              Upload
            </Button>
          </Link>

          {/* <ModeToggle /> */}
        </nav>
      </div>
    </header>
  );
};
export default Header;
