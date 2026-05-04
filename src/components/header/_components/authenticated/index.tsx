import { CreditCard, LayoutDashboard, LogOut, User } from "lucide-react";
import Link from "next/link";
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
import type { AuthUser } from "@/lib/auth/types";

const AuthenticatedUser = ({
    user,
    signOut,
    isAuthenticated,
}: {
    user: AuthUser | null;
    signOut: () => Promise<void>;
    isAuthenticated: boolean;
}) => {
    if (!isAuthenticated || !user) return null;

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
