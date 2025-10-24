import { UserAvatarSkeleton } from "@/components/avatar/skeleton";

const LoadingUser = ({
  status,
}: {
  status: "loading" | "authenticated" | "unauthenticated";
}) => {
  if (status !== "loading") return null;

  return <UserAvatarSkeleton />;
};

export default LoadingUser;
