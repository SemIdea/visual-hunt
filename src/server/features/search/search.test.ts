import { describe, expect, it, vi } from "vitest";

vi.mock("@/server/lib/stripe", () => ({
    stripe: {},
}));

vi.mock("@/server/lib/redis", () => ({
    redis: {
        get: vi.fn().mockResolvedValue(null),
        set: vi.fn().mockResolvedValue("OK"),
        del: vi.fn().mockResolvedValue(1),
        incr: vi.fn().mockResolvedValue(1),
        pexpire: vi.fn().mockResolvedValue(1),
    },
}));

vi.mock("@/server/features/auth/domains/get-session-by-token", () => ({
    domain_getSessionByToken: vi.fn(),
}));

vi.mock("@/server/lib/prisma", () => ({
    prismaClient: {
        search: { create: vi.fn().mockResolvedValue({ id: "search_mock" }) },
        user: { findUnique: vi.fn().mockResolvedValue({ id: "test_user" }) },
        session: {
            findUnique: vi.fn().mockResolvedValue(null),
            update: vi.fn().mockResolvedValue({}),
        },
    },
}));
vi.mock("@/server/lib/tasks", () => ({
    taskRegistry: {
        createPublicToken: vi.fn().mockResolvedValue("public_token"),
        startSearch: {
            trigger: vi.fn().mockResolvedValue({ id: "job_mock" }),
        },
    },
}));

import { appRouter } from "@/server";
import { domain_getSessionByToken } from "@/server/features/auth/domains/get-session-by-token";
import { SessionStatus } from "@/server/features/auth/schemas";
import { createCallerFactory, createTRPCContext } from "@/server/root";

const mockHeaders = () =>
    new Headers({
        "user-agent": "Mozilla/5.0",
        authorization: "Bearer test_token",
    });

describe("search.ping", () => {
    it("returns dbConnected, envLoaded, tasksReady, servicesReady", async () => {
        const ctx = await createTRPCContext({ headers: new Headers({ "user-agent": "test" }) });
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
        vi.mocked(domain_getSessionByToken).mockResolvedValue({
            session: {
                id: "session_id",
                userId: "test_user",
                accessTokenExpiresAt: new Date(Date.now() + 86400000),
                revokedAt: null,
                userAgent: { browser: "test", engine: "test", os: "test" },
                ip: "127.0.0.1",
            },
            status: SessionStatus.VALID,
        });

        const ctx = await createTRPCContext({ headers: mockHeaders() });
        const caller = createCallerFactory(appRouter)(ctx);

        const result = await caller.search.startSearch({
            imageUrl: "https://example.com/img.jpg",
        });

        expect(result).toHaveProperty("jobId", "job_mock");
        expect(result).toHaveProperty("searchId", "search_mock");
        expect(result).toHaveProperty("imageUrl", "https://example.com/img.jpg");
        expect(result).toHaveProperty("publicAccessToken", "public_token");
    });

    it("rejects invalid URL", async () => {
        vi.mocked(domain_getSessionByToken).mockResolvedValue({
            session: {
                id: "session_id",
                userId: "test_user",
                accessTokenExpiresAt: new Date(Date.now() + 86400000),
                revokedAt: null,
                userAgent: { browser: "test", engine: "test", os: "test" },
                ip: "127.0.0.1",
            },
            status: SessionStatus.VALID,
        });

        const ctx = await createTRPCContext({ headers: mockHeaders() });
        const caller = createCallerFactory(appRouter)(ctx);

        await expect(caller.search.startSearch({ imageUrl: "not-a-url" })).rejects.toThrow();
    });

    it("rejects unauthenticated requests", async () => {
        const ctx = await createTRPCContext({
            headers: new Headers({ "user-agent": "test" }),
        });
        const caller = createCallerFactory(appRouter)(ctx);

        await expect(
            caller.search.startSearch({ imageUrl: "https://example.com/img.jpg" }),
        ).rejects.toThrow("Missing access token");
    });
});
