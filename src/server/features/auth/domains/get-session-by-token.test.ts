import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "@/server/root";
import { SessionStatus } from "../schemas";

const { mockHmacSha256 } = vi.hoisted(() => ({
    mockHmacSha256: vi.fn(),
}));

vi.mock("@/server/lib/crypto", () => ({
    HmacSha256: mockHmacSha256,
}));

import { domain_getSessionByToken } from "./get-session-by-token";

const mockRedisGet = vi.fn();
const mockRedisSet = vi.fn();
const mockFindUnique = vi.fn();

const makeCtx = (overrides: Partial<TRPCContext> = {}): TRPCContext =>
    ({
        redis: { get: mockRedisGet, set: mockRedisSet },
        db: { session: { findUnique: mockFindUnique } },
        env: {
            auth: {
                session: {
                    accessSecret: "accessSecret",
                    cache: { sessionKeyPrefix: "session:", ttl: 300000 },
                },
            },
        },
        ...overrides,
    }) as unknown as TRPCContext;

const validSessionRow = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    userId: "660e8400-e29b-41d4-a716-446655440001",
    accessTokenExpiresAt: new Date(Date.now() + 86400000),
    refreshTokenExpiresAt: new Date(Date.now() + 604800000),
    revokedAt: null,
    userAgent: { browser: "Chrome", engine: "Blink", os: "Linux" },
    ip: "203.0.113.5",
    user: { id: "user_1" },
};

describe("domain_getSessionByToken", () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mockHmacSha256.mockReturnValue("hashed_token");
    });

    it("returns session and VALID status when token is valid and not cached", async () => {
        mockRedisGet.mockResolvedValue(null);
        mockFindUnique.mockResolvedValue(validSessionRow);

        const result = await domain_getSessionByToken({
            ctx: makeCtx(),
            params: { token: "valid_token" },
        });

        expect(result.session).not.toBeNull();
        expect(result.session?.id).toBe("550e8400-e29b-41d4-a716-446655440000");
        expect(result.status).toBe(SessionStatus.VALID);
        expect(mockRedisSet).toHaveBeenCalled();
    });

    it("returns cached session when available in Redis", async () => {
        const cached = {
            id: "550e8400-e29b-41d4-a716-446655440000",
            userId: "660e8400-e29b-41d4-a716-446655440001",
            accessTokenExpiresAt: new Date(Date.now() + 86400000).toISOString(),
            revokedAt: null,
            userAgent: { browser: "Chrome", engine: "Blink", os: "Linux" },
            ip: "203.0.113.5",
        };
        mockRedisGet.mockResolvedValue(JSON.stringify(cached));

        const result = await domain_getSessionByToken({
            ctx: makeCtx(),
            params: { token: "cached_token" },
        });

        expect(result.session).not.toBeNull();
        expect(result.status).toBe(SessionStatus.VALID);
        expect(mockFindUnique).not.toHaveBeenCalled();
    });

    it("returns NOT_FOUND when token has no session", async () => {
        mockRedisGet.mockResolvedValue(null);
        mockFindUnique.mockResolvedValue(null);

        const result = await domain_getSessionByToken({
            ctx: makeCtx(),
            params: { token: "unknown_token" },
        });

        expect(result.session).toBeNull();
        expect(result.status).toBe(SessionStatus.NOT_FOUND);
    });

    it("returns EXPIRED when access token is expired", async () => {
        mockRedisGet.mockResolvedValue(null);
        mockFindUnique.mockResolvedValue({
            ...validSessionRow,
            accessTokenExpiresAt: new Date(Date.now() - 1000),
        });

        const result = await domain_getSessionByToken({
            ctx: makeCtx(),
            params: { token: "expired_token" },
        });

        expect(result.session).toBeNull();
        expect(result.status).toBe(SessionStatus.EXPIRED);
    });

    it("returns REVOKED when session is revoked", async () => {
        mockRedisGet.mockResolvedValue(null);
        mockFindUnique.mockResolvedValue({
            ...validSessionRow,
            revokedAt: new Date(),
        });

        const result = await domain_getSessionByToken({
            ctx: makeCtx(),
            params: { token: "revoked_token" },
        });

        expect(result.session).toBeNull();
        expect(result.status).toBe(SessionStatus.REVOKED);
    });
});
