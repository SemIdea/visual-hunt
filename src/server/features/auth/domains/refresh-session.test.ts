import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "@/server/root";

const { mockHmacSha256, mockGenerateSession, mockInvalidateCache } = vi.hoisted(() => ({
    mockHmacSha256: vi.fn(),
    mockGenerateSession: vi.fn(),
    mockInvalidateCache: vi.fn(),
}));

vi.mock("@/server/lib/crypto", () => ({
    HmacSha256: mockHmacSha256,
}));

vi.mock("@/server/lib/token", () => ({
    generateSession: mockGenerateSession,
}));

vi.mock("./invalidate-session-cache", () => ({
    domain_invalidateSessionCache: mockInvalidateCache,
}));

import { domain_refreshSession } from "./refresh-session";

const mockFindUnique = vi.fn();
const mockUpdate = vi.fn();

const makeCtx = (overrides: Partial<TRPCContext> = {}): TRPCContext =>
    ({
        db: { session: { findUnique: mockFindUnique, update: mockUpdate } },
        env: {
            auth: {
                session: {
                    refreshSecret: "refreshSecret",
                    accessSecret: "accessSecret",
                    cache: { sessionKeyPrefix: "session:" },
                },
            },
        },
        ...overrides,
    }) as unknown as TRPCContext;

describe("domain_refreshSession", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("rotates tokens on valid refresh", async () => {
        mockHmacSha256.mockReturnValueOnce("hash_old_rt").mockReturnValueOnce("hash_old_at");
        mockFindUnique.mockResolvedValue({
            id: "session_1",
            accessTokenHash: "old_at_hash",
            refreshTokenExpiresAt: new Date(Date.now() + 86400000),
            revokedAt: null,
        });
        mockGenerateSession.mockReturnValue({
            accessToken: "new_at",
            refreshToken: "new_rt",
            accessTokenHash: "new_at_hash",
            refreshTokenHash: "new_rt_hash",
            accessTokenExpiresAt: new Date(Date.now() + 900000),
            refreshTokenExpiresAt: new Date(Date.now() + 604800000),
            expiresIn: 900,
        });
        mockInvalidateCache.mockResolvedValue(undefined);

        const result = await domain_refreshSession({
            ctx: makeCtx(),
            params: { refreshToken: "valid_rt" },
        });

        expect(result).toEqual({ accessToken: "new_at", refreshToken: "new_rt", expiresIn: 900 });
        expect(mockUpdate).toHaveBeenCalledWith({
            where: { id: "session_1" },
            data: {
                accessTokenHash: "new_at_hash",
                refreshTokenHash: "new_rt_hash",
                accessTokenExpiresAt: expect.any(Date),
                refreshTokenExpiresAt: expect.any(Date),
            },
        });
        expect(mockInvalidateCache).toHaveBeenCalledWith({
            ctx: expect.anything(),
            params: { accessTokenHash: "hash_old_at" },
        });
    });

    it("throws UNAUTHORIZED when refresh token not found", async () => {
        mockHmacSha256.mockReturnValue("hash_unknown");
        mockFindUnique.mockResolvedValue(null);

        await expect(
            domain_refreshSession({ ctx: makeCtx(), params: { refreshToken: "bad_rt" } }),
        ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    });

    it("throws FORBIDDEN when session is revoked", async () => {
        mockHmacSha256.mockReturnValue("hash_revoked");
        mockFindUnique.mockResolvedValue({
            id: "session_1",
            refreshTokenExpiresAt: new Date(Date.now() + 86400000),
            revokedAt: new Date(),
        });

        await expect(
            domain_refreshSession({ ctx: makeCtx(), params: { refreshToken: "revoked_rt" } }),
        ).rejects.toMatchObject({ code: "FORBIDDEN" });
    });

    it("throws UNAUTHORIZED when refresh token expired", async () => {
        mockHmacSha256.mockReturnValue("hash_expired");
        mockFindUnique.mockResolvedValue({
            id: "session_1",
            refreshTokenExpiresAt: new Date(Date.now() - 1000),
            revokedAt: null,
        });

        await expect(
            domain_refreshSession({ ctx: makeCtx(), params: { refreshToken: "expired_rt" } }),
        ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    });
});
