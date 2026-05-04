import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "@/server/root";

const { mockHmacSha256, mockInvalidateCache } = vi.hoisted(() => ({
    mockHmacSha256: vi.fn(),
    mockInvalidateCache: vi.fn(),
}));

vi.mock("@/server/lib/crypto", () => ({
    HmacSha256: mockHmacSha256,
}));

vi.mock("./invalidate-session-cache", () => ({
    domain_invalidateSessionCache: mockInvalidateCache,
}));

import { domain_revokeSession } from "./revoke-session";

const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();

const makeCtx = (overrides: Partial<TRPCContext> = {}): TRPCContext =>
    ({
        db: { session: { findUnique: mockFindUnique, update: mockUpdate } },
        env: {
            auth: {
                session: {
                    accessSecret: "accessSecret",
                    cache: { sessionKeyPrefix: "session:" },
                },
            },
        },
        ...overrides,
    }) as unknown as TRPCContext;

describe("domain_revokeSession", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("revokes session and invalidates cache", async () => {
        const fakeNow = new Date("2025-06-01T00:00:00Z");
        vi.useFakeTimers();
        vi.setSystemTime(fakeNow);

        mockFindUnique.mockResolvedValue({
            id: "session_1",
            revokedAt: null,
        });
        mockHmacSha256.mockReturnValue("hashed_at");

        const result = await domain_revokeSession({
            ctx: makeCtx(),
            params: { sessionId: "session_1", accessToken: "at_to_revoke" },
        });

        expect(result).toEqual({ sessionId: "session_1" });
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "session_1" },
            data: { revokedAt: fakeNow },
        });
        expect(mockInvalidateCache).toHaveBeenCalledWith({
            ctx: expect.anything(),
            params: { accessTokenHash: "hashed_at" },
        });

        vi.useRealTimers();
    });

    it("throws NOT_FOUND when session does not exist", async () => {
        mockFindUnique.mockResolvedValue(null);

        await expect(
            domain_revokeSession({
                ctx: makeCtx(),
                params: { sessionId: "unknown", accessToken: "at" },
            }),
        ).rejects.toMatchObject({ code: "NOT_FOUND" });
    });

    it("throws FORBIDDEN when session already revoked", async () => {
        mockFindUnique.mockResolvedValue({
            id: "session_1",
            revokedAt: new Date(),
        });

        await expect(
            domain_revokeSession({
                ctx: makeCtx(),
                params: { sessionId: "session_1", accessToken: "at" },
            }),
        ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });
});
