import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "@/server/root";

const { mockHashPassword, mockCreateSession } = vi.hoisted(() => ({
    mockHashPassword: vi.fn(),
    mockCreateSession: vi.fn(),
}));

vi.mock("@/server/lib/bcrypt", () => ({
    hashPassword: mockHashPassword,
}));

vi.mock("./create-session", () => ({
    domain_createSession: mockCreateSession,
}));

import { domain_register } from "./register";

const mockFindUnique = vi.fn();
const mockCreate = vi.fn();

const makeCtx = (overrides: Partial<TRPCContext> = {}): TRPCContext =>
    ({
        db: { user: { findUnique: mockFindUnique, create: mockCreate } },
        env: { AUTH_USER_BCRYPT_COST: 12 },
        device: {
            ip: "192.168.1.1",
            userAgent: { browser: "Chrome", engine: "Blink", os: "Linux" },
        },
        ...overrides,
    }) as unknown as TRPCContext;

describe("domain_register", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("creates user and returns session", async () => {
        mockFindUnique.mockResolvedValue(null);
        mockHashPassword.mockResolvedValue("$2b$12$hashedpassword");
        mockCreate.mockResolvedValue({
            id: "user_1",
            name: "Test User",
            email: "test@test.com",
        });
        mockCreateSession.mockResolvedValue({
            accessToken: "at",
            refreshToken: "rt",
            expiresIn: 900,
        });

        const result = await domain_register({
            ctx: makeCtx(),
            params: { name: "Test User", email: "test@test.com", password: "password123" },
        });

        expect(result).toEqual({ accessToken: "at", refreshToken: "rt", expiresIn: 900 });
        expect(mockFindUnique).toHaveBeenCalledWith({ where: { email: "test@test.com" }, select: { id: true } });
        expect(mockHashPassword).toHaveBeenCalledWith("password123", 12);
        expect(mockCreate).toHaveBeenCalledWith({
            data: { name: "Test User", email: "test@test.com", passwordHash: "$2b$12$hashedpassword" },
        });
        expect(mockCreateSession).toHaveBeenCalledWith({
            ctx: expect.anything(),
            params: { userId: "user_1", device: expect.anything() },
        });
    });

    it("throws CONFLICT when email already registered", async () => {
        mockFindUnique.mockResolvedValue({ id: "existing_id" });

        await expect(
            domain_register({
                ctx: makeCtx(),
                params: { name: "Test User", email: "existing@test.com", password: "password123" },
            }),
        ).rejects.toMatchObject({ code: "CONFLICT" });

        expect(mockHashPassword).not.toHaveBeenCalled();
        expect(mockCreate).not.toHaveBeenCalled();
        expect(mockCreateSession).not.toHaveBeenCalled();
    });
});
