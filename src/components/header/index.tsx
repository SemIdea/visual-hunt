"use client";

import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Search,
  User,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { ModeToggle } from "../ui/modetoggle";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Header = () => {
  const session = useSession();

  console.log("Session data:", session);

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
              <Link
                href="/#faq"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <nav className="flex items-center space-x-2">
              {session?.data ? (
                <>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger>
                      <Avatar>
                        <AvatarImage
                          src={session.data.user?.image || undefined}
                          alt={session.data.user?.name || "User Avatar"}
                        />
                        <AvatarFallback>
                          {session.data.user?.name
                            ? session.data.user.name.charAt(0)
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        {session.data.user?.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0">
                        <ModeToggle />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => signOut()}
                      >
                        <LogOut />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button className="dark:text-white cursor-pointer">
                  <Link href="/auth/login">Login</Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Header;
