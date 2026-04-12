import { TRPCContext } from "@/server/root";
import { TRPCError } from "@trpc/server";

export const domain_getSearchHistory = async ({ ctx, input }: {
  ctx: TRPCContext; input: {
  userId: string;
} }) => {
  const searchHistory = await ctx.db.search.findMany({
    where: { userId: input.userId },
  });

  if (!searchHistory) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Search history not found" });
  }

  return searchHistory;
};