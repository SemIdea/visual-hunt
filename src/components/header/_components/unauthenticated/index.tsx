import { Button } from "@/components/ui/button";
import Link from "next/link";

const UnauthenticatedUser = ({
  status,
}: {
  status: "loading" | "authenticated" | "unauthenticated";
}) => {
  if (status !== "unauthenticated") return null;

  return (
    <Link href="/auth/login" prefetch={true}>
      <Button className="dark:text-white cursor-pointer" size={"sm"}>
        Login
      </Button>
    </Link>
  );
};

export default UnauthenticatedUser;
