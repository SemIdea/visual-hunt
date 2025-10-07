import { helpers } from "@/server/container/helpers";
import { IResultEntity } from "@/server/entities/result/DTO";
import { PrismaClient } from "@prisma/client/edge";
import { task } from "@trigger.dev/sdk/v3";
import { IResult } from "./types";

const prisma = new PrismaClient();

export const googleLensSearch = task({
  id: "scraping-dog-google-lens",
  maxDuration: 300,
  run: async (payload: {
    imageUrl: string;
    searchId: string;
    type?: "all" | "exact_matches";
  }) => {
    const api_key = process.env.SCRAPING_DOG_API_KEY;
    const url = "https://api.scrapingdog.com/google_lens";

    const params = new URLSearchParams({
      url: payload.imageUrl,
      exact_matches: "true",
    });

    const response = await fetch(
      `${url}?api_key=${api_key}&${params.toString()}`
    );

    const data = await response.json();

    const resultsToCreate: IResultEntity[] = data.lens_results.map(
      (result: IResult, index: number) => ({
        id: helpers.uid.generate(),
        searchId: payload.searchId,
        title: result.title,
        source: result.source,
        link: result.link,
        thumbnail: result.thumbnail,
        position: index + 1,
      })
    );                  

    // await prisma.result.createMany({
    //   data: resultsToCreate,
    //   skipDuplicates: true,
    // });

    // await prisma.search.update({
    //   where: {
    //     id: payload.searchId,
    //   },
    //   data: {
    //     status: "COMPLETED",
    //   },
    // });

    return resultsToCreate;

    // return {
    //   success: true,
    //   searchId: payload.searchId,
    // };
  },
});
