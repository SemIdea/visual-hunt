import { TRPCError } from "@trpc/server";
import type { TRPCContext } from "@/server/root";

export const domain_getSearch = async ({
    ctx,
    input,
}: {
    ctx: TRPCContext;
    input: { id: string; userId: string; results?: boolean };
}) => {
    const search = await ctx.db.search.findFirst({
        where: { id: input.id, userId: input.userId },
        include: {
            ...(input.results ? { results: true } : {}),
        },
    });

    if (!search) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Search not found" });
    }

    return search;
};
