import { TRPCContext } from "@/server/root";
import { TRPCError } from "@trpc/server";

export const domain_deleteSearch = async ({ ctx, input }: { ctx: TRPCContext; input: { id: string; userId: string } }) => {
  const user = await ctx.db.user.findUnique({
    where: { id: input.userId },
  });

  if (!user) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  const search = await ctx.db.search.findUnique({
    where: { id: input.id },
  });

  if (!search) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Search not found" });
  }

  if (search.userId !== input.userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to delete this search" });
  }

  return ctx.db.search.delete({
    where: { id: input.id },
  });
};