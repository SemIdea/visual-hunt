import Link from "next/link";
import { Button } from "@/components/ui/button";

const UnauthenticatedUser = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    if (isAuthenticated) return null;

    return (
        <Link href="/auth/login" prefetch={true}>
            <Button className="dark:text-white cursor-pointer" size={"sm"}>
                Login
            </Button>
        </Link>
    );
};

export default UnauthenticatedUser;
