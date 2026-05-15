import { task } from "@trigger.dev/sdk";
import { getJson } from "serpapi";
import { v4 } from "uuid";
import { PrismaClient } from "@/generated/prisma/edge";
import { env } from "@/server/lib/env";
import type { IResult } from "./types";

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
            api_key: env.serpApi.apiKey,
        });

        const resultsToCreate = response.exact_matches.map((result: IResult) => ({
            id: v4(),
            searchId: payload.searchId,
            title: result.title,
            source: result.source,
            link: result.link,
            thumbnail: result.thumbnail,
            position: result.position,
        }));

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
