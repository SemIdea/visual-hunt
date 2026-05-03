import { SearchStatus } from "@prisma/client/edge";
import { task } from "@trigger.dev/sdk";
import { v4 } from "uuid";
import { env } from "./lib/env";
import { getPrisma } from "./lib/prisma";
import { fetchScrapingDogResults } from "./lib/scrapingdog";

export async function handleStartSearch(payload: { imageUrl: string; searchId: string }) {
    const db = getPrisma();

    try {
        const results = await fetchScrapingDogResults(payload.imageUrl, env.scrapingDogApiKey);

        if (results.length === 0) {
            await db.search.update({
                where: { id: payload.searchId },
                data: { status: SearchStatus.EMPTY },
            });

            return { success: true, searchId: payload.searchId, count: 0 };
        }

        const resultsToCreate = results.map((r) => ({
            id: v4(),
            searchId: payload.searchId,
            title: r.title,
            link: r.link,
            source: r.source,
            thumbnail: r.thumbnail,
            position: r.position,
        }));

        await db.result.createMany({ data: resultsToCreate, skipDuplicates: true });
        await db.search.update({
            where: { id: payload.searchId },
            data: { status: SearchStatus.COMPLETED },
        });

        return {
            success: true,
            searchId: payload.searchId,
            count: resultsToCreate.length,
        };
    } catch (error) {
        await db.search.update({
            where: { id: payload.searchId },
            data: { status: SearchStatus.FAILED },
        });

        console.error("start-search job failed:", error);

        return {
            success: false,
            searchId: payload.searchId,
        };
    }
}

export const startSearchJob = task({
    id: "start-search",
    maxDuration: 120,
    run: async (payload: { imageUrl: string; searchId: string }) => {
        return handleStartSearch(payload);
    },
});
