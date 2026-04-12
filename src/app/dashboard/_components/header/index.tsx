"use client";

import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import HeaderSkeleton from "./skeleton";

const UserInfo = () => {
    const { data } = useSession();

    const user = data?.user as User;

    if (!data?.user) return <HeaderSkeleton />;

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
