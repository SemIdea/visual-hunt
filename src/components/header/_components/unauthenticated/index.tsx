import Link from "next/link";
import { Button } from "@/components/ui/button";

const UnauthenticatedUser = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (isAuthenticated) return null;

    return (
        <div className="flex items-center gap-2">
            <Link href="/auth/register" prefetch={true}>
                <Button variant="ghost" className="dark:text-white cursor-pointer" size={"sm"}>
                    Create account
                </Button>
            </Link>
            <Link href="/auth/login" prefetch={true}>
                <Button className="dark:text-white cursor-pointer" size={"sm"}>
                    Login
                </Button>
            </Link>
        </div>
    );
};

export default UnauthenticatedUser;
