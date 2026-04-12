import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const SearchHistorySkeleton = () => {
    return (
        <div className="rounded-2xl border bg-card p-6">
            <header className="mb-5 space-y-3">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-40" />
            </header>
            <Skeleton className="h-6 w-full mb-4" />
            <Separator />
        </div>
    );
};

export default SearchHistorySkeleton;
