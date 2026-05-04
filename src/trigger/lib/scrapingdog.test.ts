import { describe, expect, it, vi } from "vitest";
import { fetchScrapingDogResults, ScrapingDogError, ScrapingDogTimeoutError } from "./scrapingdog";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const API_KEY = "test_key";

describe("fetchScrapingDogResults", () => {
    it("returns mapped results on success", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                lens_results: [
                    {
                        title: "Result A",
                        link: "https://a.com",
                        source: "src_a",
                        thumbnail: "https://a.com/thumb.jpg",
                    },
                    {
                        title: "Result B",
                        link: "https://b.com",
                        source: "src_b",
                        thumbnail: "https://b.com/thumb.jpg",
                    },
                ],
            }),
        });

        const results = await fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY);

        expect(results).toHaveLength(2);
        expect(results[0]).toEqual({
            title: "Result A",
            link: "https://a.com",
            source: "src_a",
            thumbnail: "https://a.com/thumb.jpg",
            position: 1,
        });
        expect(results[1]).toEqual({
            title: "Result B",
            link: "https://b.com",
            source: "src_b",
            thumbnail: "https://b.com/thumb.jpg",
            position: 2,
        });
    });

    it("returns empty array when no lens_results", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({}),
        });

        const results = await fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY);

        expect(results).toEqual([]);
    });

    it("returns empty array when lens_results is empty", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ lens_results: [] }),
        });

        const results = await fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY);

        expect(results).toEqual([]);
    });

    it("throws ScrapingDogError on non-ok response", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: async () => ({}),
        });

        await expect(fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY)).rejects.toThrow(
            ScrapingDogError,
        );
    });

    it("throws ScrapingDogError on rate limit (429)", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 429,
            json: async () => ({}),
        });

        await expect(fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY)).rejects.toThrow(
            ScrapingDogError,
        );
    });

    it("throws ScrapingDogTimeoutError on abort", async () => {
        mockFetch.mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));

        await expect(fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY)).rejects.toThrow(
            ScrapingDogTimeoutError,
        );
    });

    it("handles missing fields gracefully", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({
                lens_results: [{ title: "Only title" }],
            }),
        });

        const results = await fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY);

        expect(results[0]).toEqual({
            title: "Only title",
            link: "",
            source: "",
            thumbnail: "",
            position: 1,
        });
    });

    it("passes exact_matches=true in query", async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: async () => ({ lens_results: [] }),
        });

        await fetchScrapingDogResults("https://img.com/photo.jpg", API_KEY);

        const calledUrl = mockFetch.mock.calls[0][0] as string;
        expect(calledUrl).toContain("exact_matches=true");
        expect(calledUrl).toContain(`api_key=${API_KEY}`);
        expect(calledUrl).toContain(encodeURIComponent("https://img.com/photo.jpg"));
    });
});
