import { Skeleton } from "@/components/ui/skeleton";

const LoadingUser = ({
  status
}: {
  status: "loading" | "authenticated" | "unauthenticated";
}) => {
  if (status !== "loading") return null;

  return <Skeleton className="h-8 w-8 rounded-full" />;
};

export default LoadingUser;
