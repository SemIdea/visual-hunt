import { PrismaClient, SearchStatus } from "@prisma/client/edge";
import { task } from "@trigger.dev/sdk/v3";
import { helpers } from "@/server/container/helpers";
import type { IResultEntity } from "@/server/entities/result/DTO";
import type { IResult } from "./types";

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

        const response = await fetch(`${url}?api_key=${api_key}&${params.toString()}`);

        const data = await response.json();

        if (!response.ok) {
            await updateSearchStatus(payload.searchId, SearchStatus.FAILED);

            console.error("ScrapingDog Google Lens API error:", data);

            return {
                success: false,
                searchId: payload.searchId,
            };
        }

        if (data.lens_results.length === 0) {
            await updateSearchStatus(payload.searchId, SearchStatus.EMPTY);

            return {
                success: true,
                searchId: payload.searchId,
            };
        }

        const resultsToCreate: IResultEntity[] = data.lens_results.map(
            (result: IResult, index: number) => ({
                id: helpers.uid.generate(),
                searchId: payload.searchId,
                title: result.title,
                source: result.source,
                link: result.link,
                thumbnail: result.thumbnail,
                position: index + 1,
            }),
        );

        await prisma.result.createMany({
            data: resultsToCreate,
            skipDuplicates: true,
        });

        await updateSearchStatus(payload.searchId, SearchStatus.COMPLETED);

        return {
            success: true,
            searchId: payload.searchId,
        };
    },
});

async function updateSearchStatus(searchId: string, status: SearchStatus) {
    await prisma.search.update({
        where: {
            id: searchId,
        },
        data: {
            status,
        },
    });
}
