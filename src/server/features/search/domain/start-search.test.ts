import { describe, expect, it, vi } from "vitest";

const mockTrigger = vi.fn();
const mockSearchCreate = vi.fn();

vi.mock("@/server/lib/tasks", () => ({
    taskRegistry: {
        startSearch: {
            trigger: mockTrigger,
        },
    },
}));

import type { TRPCContext } from "@/server/root";
import { domain_startSearch } from "./start-search";

describe("domain_startSearch", () => {
    it("creates search, triggers job, returns jobId and searchId", async () => {
        mockTrigger.mockResolvedValueOnce({ id: "job_123" });
        mockSearchCreate.mockResolvedValueOnce({
            id: "search_uuid",
            source: "https://example.com/img.jpg",
        });

        const ctx = {
            tasks: {
                startSearch: { trigger: mockTrigger },
                createPublicToken: vi.fn().mockResolvedValue("public_token"),
            },
            db: {
                search: { create: mockSearchCreate },
            },
        } as unknown as TRPCContext;

        const result = await domain_startSearch({
            ctx,
            input: {
                imageUrl: "https://example.com/img.jpg",
                userId: "user_1",
            },
        });

        expect(mockTrigger).toHaveBeenCalledOnce();
        const triggerArg = mockTrigger.mock.calls[0][0];
        expect(triggerArg).toMatchObject({
            imageUrl: "https://example.com/img.jpg",
        });
        expect(typeof triggerArg.searchId).toBe("string");

        expect(mockSearchCreate).toHaveBeenCalledOnce();
        const createArg = mockSearchCreate.mock.calls[0][0];
        expect(createArg).toMatchObject({
            data: {
                source: "https://example.com/img.jpg",
                userId: "user_1",
                status: "PENDING",
                jobId: "job_123",
                publicAccessToken: "public_token",
            },
        });
        expect(typeof createArg.data.id).toBe("string");

        expect(result).toHaveProperty("jobId", "job_123");
        expect(result).toHaveProperty("searchId", "search_uuid");
        expect(result).toHaveProperty("imageUrl", "https://example.com/img.jpg");
        expect(result).toHaveProperty("publicAccessToken", "public_token");
    });
});
