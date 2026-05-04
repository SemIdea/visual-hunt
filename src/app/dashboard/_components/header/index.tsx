"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth/context";
import HeaderSkeleton from "./skeleton";

const UserInfo = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) return <HeaderSkeleton />;
    if (!user) return <HeaderSkeleton />;

    return (
        <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src={user.image || undefined} alt="User avatar" />
                <Skeleton className="h-16 w-16 rounded-full" />
            </Avatar>
            <div className="space-y-1">
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
        </div>
    );
};

export default UserInfo;
