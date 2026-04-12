import { TRPCContext } from "@/server/root";
import { auth, tasks } from "@trigger.dev/sdk";
import { v4 } from "uuid";

export const domain_searchWithUrl = async ({ ctx, input }: { ctx: TRPCContext; input: { url: string; userId: string } }) => {
  const searchId = v4();
  
  const job = await tasks.trigger("scraping-dog-google-lens", {
    searchId,
    imageUrl: input.url,
    type: "exact_matches",
  });

  const publicAccessToken = await auth.createPublicToken({
    scopes: {
      read: {
        runs: job.id,
      },
    },
  });

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