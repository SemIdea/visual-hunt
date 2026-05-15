import { v4 } from "uuid";
import type { TRPCContext } from "@/server/root";

export const domain_searchWithUrl = async ({
    ctx,
    input,
}: {
    ctx: TRPCContext;
    input: { url: string; userId: string };
}) => {
    const searchId = v4();

    const job = await ctx.tasks.startSearch.trigger({
        searchId,
        imageUrl: input.url,
    });
    const publicAccessToken = await ctx.tasks.createPublicToken(job.id);

    const search = await ctx.db.search.create({
        data: {
            id: searchId,
            source: input.url,
            publicAccessToken,
            status: "PENDING",
            jobId: job.id,
            userId: input.userId,
        },
    });

    return search;
};
