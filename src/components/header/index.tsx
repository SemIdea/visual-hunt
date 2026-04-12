"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import AuthenticatedUser from "./_components/authenticated";
import LoadingUser from "./_components/loading";
import UnauthenticatedUser from "./_components/unauthenticated";

const Header = () => {
    const { data, status } = useSession();

    return (
        <header className="fixed z-10 w-full border-b border-border/40 bg-background/40 backdrop-blur-sm">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <div className="flex items-center gap-8">
                    <Link href="/" prefetch={false} className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Search className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold">VisualHunt</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="/pricing"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            prefetch={true}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#faq"
                            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                            prefetch={false}
                        >
                            FAQ
                        </Link>
                    </nav>
                </div>

                <nav className="flex items-center gap-3">
                    <LoadingUser status={status} />
                    <UnauthenticatedUser status={status} />
                    <AuthenticatedUser user={data?.user} signOut={signOut} status={status} />
                </nav>
            </div>
        </header>
    );
};

export default Header;
