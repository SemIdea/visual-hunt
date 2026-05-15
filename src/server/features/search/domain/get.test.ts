import { describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "@/server/root";
import { domain_getSearch } from "./get";

describe("domain_getSearch", () => {
    it("reads only a search that belongs to the user", async () => {
        const search = {
            id: "search_1",
            userId: "user_1",
            source: "https://example.com/image.jpg",
        };
        const findFirst = vi.fn().mockResolvedValue(search);

        const ctx = {
            db: {
                search: { findFirst },
            },
        } as unknown as TRPCContext;

        const result = await domain_getSearch({
            ctx,
            input: { id: "search_1", userId: "user_1", results: true },
        });

        expect(findFirst).toHaveBeenCalledWith({
            where: { id: "search_1", userId: "user_1" },
            include: { results: true },
        });
        expect(result).toBe(search);
    });

    it("throws NOT_FOUND when the search does not belong to the user", async () => {
        const ctx = {
            db: {
                search: { findFirst: vi.fn().mockResolvedValue(null) },
            },
        } as unknown as TRPCContext;

        await expect(
            domain_getSearch({
                ctx,
                input: { id: "search_1", userId: "other_user" },
            }),
        ).rejects.toMatchObject({
            code: "NOT_FOUND",
            message: "Search not found",
        });
    });
});
