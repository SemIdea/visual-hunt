import type { IResult } from "../types";

export class ScrapingDogError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
        this.name = "ScrapingDogError";
    }
}

export class ScrapingDogTimeoutError extends Error {
    constructor() {
        super("ScrapingDog API request timed out");
        this.name = "ScrapingDogTimeoutError";
    }
}

export async function fetchScrapingDogResults(
    imageUrl: string,
    apiKey: string,
    timeoutMs = 30_000,
): Promise<IResult[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const params = new URLSearchParams({
            url: imageUrl,
            exact_matches: "true",
        });

        const url = `https://api.scrapingdog.com/google_lens?api_key=${apiKey}&${params.toString()}`;

        const response = await fetch(url, { signal: controller.signal });

        if (response.status === 429) {
            throw new ScrapingDogError("Rate limited by ScrapingDog", 429);
        }

        if (!response.ok) {
            throw new ScrapingDogError(
                `ScrapingDog API returned ${response.status}`,
                response.status,
            );
        }

        const data = await response.json() as { lens_results?: Array<{
            title?: string;
            link?: string;
            source?: string;
            thumbnail?: string;
        }> };

        if (!data.lens_results?.length) {
            return [];
        }

        return data.lens_results.map((result, index) => ({
            title: result.title ?? "",
            link: result.link ?? "",
            source: result.source ?? "",
            thumbnail: result.thumbnail ?? "",
            position: index + 1,
        }));
    } catch (error) {
        if (error instanceof ScrapingDogError) throw error;

        if (error instanceof DOMException && error.name === "AbortError") {
            throw new ScrapingDogTimeoutError();
        }

        throw new Error(
            `ScrapingDog request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
    } finally {
        clearTimeout(timeoutId);
    }
}
