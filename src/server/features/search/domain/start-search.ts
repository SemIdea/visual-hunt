import { v4 } from "uuid";
import type { TRPCContext } from "@/server/root";

export const domain_startSearch = async ({
    ctx,
    input,
}: {
    ctx: TRPCContext;
    input: { imageUrl: string; userId: string };
}) => {
    const searchId = v4();

    const job = await ctx.tasks.startSearch.trigger({
        imageUrl: input.imageUrl,
        searchId,
    });

    const search = await ctx.db.search.create({
        data: {
            id: searchId,
            source: input.imageUrl,
            userId: input.userId,
            status: "PENDING",
            jobId: job.id,
            publicAccessToken: "",
        },
    });

    return {
        jobId: job.id,
        searchId: search.id,
        imageUrl: input.imageUrl,
    };
};
