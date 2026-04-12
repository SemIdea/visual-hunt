import { Skeleton } from "@/components/ui/skeleton";

const PlanUsageSkeleton = () => {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <header className="mb-5">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56 mt-2" />
            </header>

            <main className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-7 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-9 w-40 rounded-md" />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t pt-6">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-36" />
                        <Skeleton className="h-6 w-56" />
                    </div>
                    <Skeleton className="h-9 w-40 rounded-md" />
                </div>
            </main>
        </div>
    );
};

export default PlanUsageSkeleton;
