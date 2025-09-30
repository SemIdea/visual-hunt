import { helpers } from "@/server/container/helpers";
import { PrismaClient } from "@prisma/client/edge";
import { task } from "@trigger.dev/sdk/v3";
import { getJson } from "serpapi";

type ISerpApiResult = {
  position: number;
  title: string;
  source: string;
  link: string;
  thumbnail: string;
  actual_image_width: number;
  actual_image_height: number;
};

const prisma = new PrismaClient();

export const googleLensSearch = task({
  id: "search-with-google-lens",
  maxDuration: 300,
  run: async (payload: {
    imageUrl: string;
    searchId: string;
    type?: "all" | "exact_matches";
  }) => {
    const response = await getJson({
      engine: "google_lens",
      url: payload.imageUrl,
      type: payload.type || "all",
      safe: "off",
      api_key: process.env.SERP_API_KEY!,
    });

    const resultsToCreate = response.exact_matches.map(
      (result: ISerpApiResult) => ({
        id: helpers.uid.generate(),
        searchId: payload.searchId,
        position: result.position,
        title: result.title,
        source: result.source,
        link: result.link,
        thumbnail: result.thumbnail,
        width: result.actual_image_width,
        height: result.actual_image_height,
      })
    );

    await prisma.result.createMany({
      data: resultsToCreate,
      skipDuplicates: true,
    });

    await prisma.search.update({
      where: {
        id: payload.searchId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    return {
      success: true,
      searchId: payload.searchId,
    };
  },
});
