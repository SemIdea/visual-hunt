"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { ModeToggle } from "../ui/modetoggle";

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

        <nav className="flex items-center space-x-2">
          <ModeToggle />
        </nav>
      </div>
    </header>
  );
};
export default Header;
