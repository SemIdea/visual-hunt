// src/components/avatar/skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface UserAvatarSkeletonProps {
    className?: string;
}

export function UserAvatarSkeleton({ className }: UserAvatarSkeletonProps) {
    return <Skeleton className={cn("h-8 w-8 rounded-full", className)} />;
}
