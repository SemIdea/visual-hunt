import { describe, expect, it, vi } from "vitest";
import { auth } from "@/app/api/auth/[...nextauth]/auth";

vi.mock("@/app/api/auth/[...nextauth]/auth", () => ({
    auth: vi.fn(),
}));
vi.mock("@/server/lib/stripe", () => ({
    stripe: {},
}));
vi.mock("@/server/lib/prisma", () => ({
    prismaClient: {
        search: { create: vi.fn().mockResolvedValue({ id: "search_mock" }) },
    },
}));
vi.mock("@/server/lib/tasks", () => ({
    taskRegistry: {
        startSearch: {
            trigger: vi.fn().mockResolvedValue({ id: "job_mock" }),
        },
    },
}));

import { createCallerFactory, createTRPCContext } from "@/server/root";
import { appRouter } from "@/server";

describe("search.ping", () => {
    it("returns dbConnected, envLoaded, tasksReady, servicesReady", async () => {
        vi.mocked(auth).mockResolvedValue(null);

        const ctx = await createTRPCContext();
        const caller = createCallerFactory(appRouter)(ctx);

        const result = await caller.search.ping();

        expect(result.dbConnected).toBe(true);
        expect(result.envLoaded).toBe(true);
        expect(result.tasksReady).toBe(true);
        expect(result.servicesReady).toBe(true);
    });
});

describe("search.startSearch", () => {
    it("triggers job and returns jobId, searchId, imageUrl", async () => {
        vi.mocked(auth).mockResolvedValue({
            user: { id: "test_user" },
            expires: new Date(Date.now() + 86400000).toISOString(),
        } as never);

        const ctx = await createTRPCContext();
        const caller = createCallerFactory(appRouter)(ctx);

        const result = await caller.search.startSearch({
            imageUrl: "https://example.com/img.jpg",
        });

        expect(result).toHaveProperty("jobId", "job_mock");
        expect(result).toHaveProperty("searchId", "search_mock");
        expect(result).toHaveProperty("imageUrl", "https://example.com/img.jpg");
    });

    it("rejects invalid URL", async () => {
        vi.mocked(auth).mockResolvedValue({
            user: { id: "test_user" },
            expires: new Date(Date.now() + 86400000).toISOString(),
        } as never);

        const ctx = await createTRPCContext();
        const caller = createCallerFactory(appRouter)(ctx);

        await expect(
            caller.search.startSearch({ imageUrl: "not-a-url" }),
        ).rejects.toThrow();
    });

    it("rejects unauthenticated requests", async () => {
        vi.mocked(auth).mockResolvedValue(null);

        const ctx = await createTRPCContext();
        const caller = createCallerFactory(appRouter)(ctx);

        await expect(
            caller.search.startSearch({ imageUrl: "https://example.com/img.jpg" }),
        ).rejects.toThrow("UNAUTHORIZED");
    });
});
