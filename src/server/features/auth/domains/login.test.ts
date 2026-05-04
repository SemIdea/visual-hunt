import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "@/server/root";

const { mockVerifyPassword, mockCreateSession } = vi.hoisted(() => ({
    mockVerifyPassword: vi.fn(),
    mockCreateSession: vi.fn(),
}));

vi.mock("@/server/lib/bcrypt", () => ({
    verifyPassword: mockVerifyPassword,
}));

vi.mock("./create-session", () => ({
    domain_createSession: mockCreateSession,
}));

import { domain_login } from "./login";

const mockFindUnique = vi.fn();

const makeCtx = (overrides: Partial<TRPCContext> = {}): TRPCContext =>
    ({
        db: { user: { findUnique: mockFindUnique } },
        device: {
            ip: "192.168.1.1",
            userAgent: { browser: "Chrome", engine: "Blink", os: "Linux" },
        },
        ...overrides,
    }) as unknown as TRPCContext;

describe("domain_login", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("returns session on valid credentials", async () => {
        const fakeSession = { accessToken: "at", refreshToken: "rt", expiresIn: 900 };
        mockFindUnique.mockResolvedValue({
            id: "user_1",
            email: "test@test.com",
            passwordHash: "$2b$12$hash",
        });
        mockVerifyPassword.mockResolvedValue(true);
        mockCreateSession.mockResolvedValue(fakeSession);

        const result = await domain_login({
            ctx: makeCtx(),
            params: { email: "test@test.com", password: "password123" },
        });

        expect(result).toEqual(fakeSession);
        expect(mockFindUnique).toHaveBeenCalledWith({ where: { email: "test@test.com" } });
        expect(mockVerifyPassword).toHaveBeenCalledWith("password123", "$2b$12$hash");
        expect(mockCreateSession).toHaveBeenCalledWith({
            ctx: expect.anything(),
            params: { userId: "user_1", device: expect.anything() },
        });
    });

    it("throws UNAUTHORIZED when user not found", async () => {
        mockFindUnique.mockResolvedValue(null);

        await expect(
            domain_login({
                ctx: makeCtx(),
                params: { email: "unknown@test.com", password: "password123" },
            }),
        ).rejects.toThrow(TRPCError);

        await expect(
            domain_login({
                ctx: makeCtx(),
                params: { email: "unknown@test.com", password: "password123" },
            }),
        ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    });

    it("throws UNAUTHORIZED when user has no passwordHash", async () => {
        mockFindUnique.mockResolvedValue({
            id: "user_1",
            email: "oauth@test.com",
            passwordHash: null,
        });

        await expect(
            domain_login({
                ctx: makeCtx(),
                params: { email: "oauth@test.com", password: "password123" },
            }),
        ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    });

    it("throws UNAUTHORIZED when password does not match", async () => {
        mockFindUnique.mockResolvedValue({
            id: "user_1",
            email: "test@test.com",
            passwordHash: "$2b$12$hash",
        });
        mockVerifyPassword.mockResolvedValue(false);

        await expect(
            domain_login({
                ctx: makeCtx(),
                params: { email: "test@test.com", password: "wrongpassword" },
            }),
        ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
    });
});
