import { describe, expect, it, vi } from "vitest";

vi.mock("@/app/api/auth/[...nextauth]/auth", () => ({
    auth: vi.fn().mockResolvedValue(null),
}));
vi.mock("@/server/lib/stripe", () => ({
    stripe: {},
}));

import { createCallerFactory, createTRPCContext } from "@/server/root";
import { appRouter } from "@/server";

describe("search.ping", () => {
    it("returns dbConnected, envLoaded, tasksReady, servicesReady", async () => {
        const ctx = await createTRPCContext();
        const caller = createCallerFactory(appRouter)(ctx);

        const result = await caller.search.ping();

        expect(result.dbConnected).toBe(true);
        expect(result.envLoaded).toBe(true);
        expect(result.tasksReady).toBe(true);
        expect(result.servicesReady).toBe(true);
    });
});

