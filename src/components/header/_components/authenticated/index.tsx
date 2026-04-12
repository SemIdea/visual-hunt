import { CreditCard, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
import type { User as AuthUser } from "next-auth";
import UserAvatar from "@/components/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/ui/modetoggle";

const AuthenticatedUser = ({
    user,
    signOut,
    status,
}: {
    user: AuthUser | undefined;
    signOut: () => Promise<void>;
    status: "loading" | "authenticated" | "unauthenticated";
}) => {
    if (status !== "authenticated" || !user) return null;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger>
                <UserAvatar
                    alt={user.name || ""}
                    src={user.image || ""}
                    className="cursor-pointer"
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2 cursor-pointer">
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
                    className="cursor-pointer"
                >
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default AuthenticatedUser;
