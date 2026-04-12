import { TRPCContext } from "@/server/root";
import { TRPCError } from "@trpc/server";

export const domain_getSearch = async ({ ctx, input }: { ctx: TRPCContext; input: { id: string; results?: boolean } }) => {
  const search =  await ctx.db.search.findUnique({
    where: { id: input.id },
    include: {
      ...(input.results ? { results: true } : {}),
    }
  });

  if (!search) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Search not found" });
  }

  return search;
};