import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Device } from "@/server/lib/headers";
import type { TRPCContext } from "@/server/root";

const { mockGenerateSession } = vi.hoisted(() => ({
    mockGenerateSession: vi.fn(),
}));

vi.mock("@/server/lib/token", () => ({
    generateSession: mockGenerateSession,
}));

import { domain_createSession } from "./create-session";

const mockSessionCreate = vi.fn();

const mockCtx = {
    db: { session: { create: mockSessionCreate } },
} as unknown as TRPCContext;

const mockDevice: Device = {
    ip: "203.0.113.5",
    userAgent: { browser: "Chrome", engine: "Blink", os: "Linux" },
};

describe("domain_createSession", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("creates session with tokens, hashes, and device info", async () => {
        const now = Date.now();
        vi.useFakeTimers();
        vi.setSystemTime(now);

        mockGenerateSession.mockReturnValue({
            accessToken: "at_abc",
            refreshToken: "rt_def",
            accessTokenHash: "hash_at",
            refreshTokenHash: "hash_rt",
            accessTokenExpiresAt: new Date(now + 900000),
            refreshTokenExpiresAt: new Date(now + 604800000),
            expiresIn: 900,
        });

        const result = await domain_createSession({
            ctx: mockCtx,
            params: { userId: "user_123", device: mockDevice },
        });

        expect(mockSessionCreate).toHaveBeenCalledWith({
            data: {
                accessTokenHash: "hash_at",
                refreshTokenHash: "hash_rt",
                accessTokenExpiresAt: new Date(now + 900000),
                refreshTokenExpiresAt: new Date(now + 604800000),
                userId: "user_123",
                userAgent: { browser: "Chrome", engine: "Blink", os: "Linux" },
                ip: "203.0.113.5",
            },
        });

        expect(result).toEqual({
            accessToken: "at_abc",
            refreshToken: "rt_def",
            expiresIn: 900,
        });

        vi.useRealTimers();
    });
});
