import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "next-auth";

const UserInfo = ({ user }: { user: NonNullable<User> }) => {
  const initials = (user.name ?? "")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          {user.image ? (
            <AvatarImage src={user.image} alt="User avatar" />
          ) : (
            <AvatarFallback className="bg-primary/10 text-lg font-semibold">
              {initials || "JD"}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-1">
          <p className="text-lg font-semibold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
