import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockRandomBytes, mockHmacSha256 } = vi.hoisted(() => ({
    mockRandomBytes: vi.fn(),
    mockHmacSha256: vi.fn(),
}));

vi.mock("node:crypto", () => ({
    randomBytes: mockRandomBytes,
}));

vi.mock("./crypto", () => ({
    HmacSha256: mockHmacSha256,
}));

import type { TRPCContext } from "@/server/root";
import { generateSession, generateSessionTokens, generateToken } from "./token";

const mockCtx = {
    env: {
        auth: {
            session: {
                accessSecret: "accessSecret",
                refreshSecret: "refreshSecret",
                token: {
                    byteLength: 32,
                    expire: {
                        accessToken: 900000,
                        refreshToken: 604800000,
                    },
                },
                cache: {
                    ttl: 300000,
                    sessionKeyPrefix: "session:",
                },
            },
            rateLimit: {
                maxRequests: 10,
                windowMs: 15000,
            },
        },
    },
} as TRPCContext;

describe("generateToken", () => {
    it("returns token with prefix and hex", () => {
        mockRandomBytes.mockReturnValue(Buffer.from("abcdef", "hex"));
        const result = generateToken(3, "test");
        expect(result).toBe("test_abcdef");
        expect(mockRandomBytes).toHaveBeenCalledWith(3);
    });
});

describe("generateSessionTokens", () => {
    it("returns accessToken, refreshToken, and hashes", () => {
        mockRandomBytes
            .mockReturnValueOnce(Buffer.from("aa", "hex"))
            .mockReturnValueOnce(Buffer.from("bb", "hex"));
        mockHmacSha256.mockReturnValueOnce("hash_aa").mockReturnValueOnce("hash_bb");

        const result = generateSessionTokens(mockCtx);

        expect(result.accessToken).toBe("aa");
        expect(result.refreshToken).toBe("bb");
        expect(result.accessTokenHash).toBe("hash_aa");
        expect(result.refreshTokenHash).toBe("hash_bb");
        expect(mockHmacSha256).toHaveBeenCalledWith("aa", "accessSecret");
        expect(mockHmacSha256).toHaveBeenCalledWith("bb", "refreshSecret");
    });
});

describe("generateSession", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2025-01-01T00:00:00Z"));
    });
    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns tokens, hashes, expirations, and expiresIn", () => {
        mockRandomBytes
            .mockReturnValueOnce(Buffer.from("aa", "hex"))
            .mockReturnValueOnce(Buffer.from("bb", "hex"));
        mockHmacSha256.mockReturnValueOnce("hash_aa").mockReturnValueOnce("hash_bb");

        const result = generateSession(mockCtx);

        expect(result.accessToken).toBe("aa");
        expect(result.refreshToken).toBe("bb");
        expect(result.accessTokenHash).toBe("hash_aa");
        expect(result.refreshTokenHash).toBe("hash_bb");
        expect(result.accessTokenExpiresAt).toEqual(new Date("2025-01-01T00:15:00Z"));
        expect(result.refreshTokenExpiresAt).toEqual(new Date("2025-01-08T00:00:00Z"));
        expect(result.expiresIn).toBe(900);
    });
});
