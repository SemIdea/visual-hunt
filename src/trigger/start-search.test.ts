import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUpdate = vi.fn();
const mockCreateMany = vi.fn();

vi.mock("./lib/prisma", () => ({
    getPrisma: () => ({
        search: { update: mockUpdate },
        result: { createMany: mockCreateMany },
    }),
}));

vi.mock("./lib/scrapingdog", () => ({
    fetchScrapingDogResults: vi.fn(),
}));

import { fetchScrapingDogResults } from "./lib/scrapingdog";
import { handleStartSearch, startSearchJob } from "./start-search";

beforeEach(() => {
    vi.clearAllMocks();
});

describe("startSearchJob", () => {
    it("has correct id", () => {
        expect(startSearchJob.id).toBe("start-search");
    });
});

describe("handleStartSearch", () => {
    it("processes results and marks COMPLETED", async () => {
        vi.mocked(fetchScrapingDogResults).mockResolvedValueOnce([
            {
                title: "A",
                link: "https://a.com",
                source: "src_a",
                thumbnail: "https://a.com/t.jpg",
                position: 1,
            },
            {
                title: "B",
                link: "https://b.com",
                source: "src_b",
                thumbnail: "https://b.com/t.jpg",
                position: 2,
            },
        ]);

        const result = await handleStartSearch({
            imageUrl: "https://example.com/img.jpg",
            searchId: "search_1",
        });

        expect(mockCreateMany).toHaveBeenCalledOnce();
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "search_1" },
            data: { status: "COMPLETED" },
        });
        expect(result).toEqual({
            success: true,
            searchId: "search_1",
            count: 2,
        });
    });

    it("marks EMPTY when no results", async () => {
        vi.mocked(fetchScrapingDogResults).mockResolvedValueOnce([]);

        const result = await handleStartSearch({
            imageUrl: "https://example.com/img.jpg",
            searchId: "search_1",
        });

        expect(mockCreateMany).not.toHaveBeenCalled();
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "search_1" },
            data: { status: "EMPTY" },
        });
        expect(result).toEqual({
            success: true,
            searchId: "search_1",
            count: 0,
        });
    });

    it("marks FAILED on error", async () => {
        vi.mocked(fetchScrapingDogResults).mockRejectedValueOnce(new Error("API down"));

        const result = await handleStartSearch({
            imageUrl: "https://example.com/img.jpg",
            searchId: "search_1",
        });

        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "search_1" },
            data: { status: "FAILED" },
        });
        expect(result).toEqual({
            success: false,
            searchId: "search_1",
        });
    });
});
