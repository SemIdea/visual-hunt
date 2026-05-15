import { beforeEach, describe, expect, it, vi } from "vitest";

const { mockDomainRegister } = vi.hoisted(() => ({
    mockDomainRegister: vi.fn(),
}));

vi.mock("../domains/register", () => ({
    domain_register: mockDomainRegister,
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

vi.mock("@/server/lib/stripe", () => ({
    stripe: {},
}));

vi.mock("@/server/lib/prisma", () => ({
    prismaClient: {
        user: { findUnique: vi.fn() },
        session: { findUnique: vi.fn() },
    },
}));

vi.mock("@/server/features/auth/domains/get-session-by-token", () => ({
    domain_getSessionByToken: vi.fn(),
}));

import { appRouter } from "@/server";
import { createCallerFactory, createTRPCContext } from "@/server/root";

describe("auth.register procedure", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("calls the domain and returns the authenticated payload", async () => {
        mockDomainRegister.mockResolvedValueOnce({
            accessToken: "access-token",
            refreshToken: "refresh-token",
            expiresIn: 900,
        });

        const ctx = await createTRPCContext({
            headers: new Headers({ "user-agent": "Mozilla/5.0" }),
        });
        const caller = createCallerFactory(appRouter)(ctx);

        const result = await caller.auth.register({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
        });

        expect(mockDomainRegister).toHaveBeenCalledWith({
            ctx,
            params: {
                name: "Test User",
                email: "test@example.com",
                password: "password123",
            },
        });
        expect(result).toEqual({
            result: {
                status: "AUTHENTICATED",
                accessToken: "access-token",
                refreshToken: "refresh-token",
                expiresIn: 900,
            },
        });
    });
});
