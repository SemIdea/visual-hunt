import { helpers } from "@/server/container/helpers";
import { PrismaClient } from "@prisma/client/edge";
import { task } from "@trigger.dev/sdk/v3";
import { getJson } from "serpapi";
import { IResult } from "./types";
import { IResultEntity } from "@/server/entities/result/DTO";

const prisma = new PrismaClient();

export const googleLensSearch = task({
  id: "serp-google-lens",
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

    const resultsToCreate: IResultEntity[] = response.exact_matches.map(
      (result: IResult) => ({
        id: helpers.uid.generate(),
        searchId: payload.searchId,
        title: result.title,
        source: result.source,
        link: result.link,
        thumbnail: result.thumbnail,
        position: result.position,
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
