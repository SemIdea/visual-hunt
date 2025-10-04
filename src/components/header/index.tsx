"use client";

import { Search } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/modetoggle";
import Link from "next/link";

const Header = () => {
  const session = useSession();

  return (
    <nav className="border-b border-border/40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2" href={"/"}>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Search className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">VisualHunt</span>
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <Link
                href="/pricing"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Pricing
              </Link>
              <a
                href="#faq"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex items-center space-x-2">
              <div>
                {session?.data ? (
                  <>
                    <span className="text-sm">
                      Hello, {session.data.user?.name}
                    </span>
                    <Button
                      variant="outline"
                      className="ml-4 cursor-pointer"
                      onClick={() => signOut()}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button className="dark:text-white cursor-pointer">
                    <Link href="/auth/login">Login</Link>
                  </Button>
                )}
              </div>
              <ModeToggle />
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
