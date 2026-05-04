import { describe, expect, it, vi } from "vitest";

const { mockHash, mockCompare } = vi.hoisted(() => ({
    mockHash: vi.fn(),
    mockCompare: vi.fn(),
}));

vi.mock("bcrypt", () => ({
    default: {
        hash: mockHash,
        compare: mockCompare,
    },
}));

import { hashPassword, verifyPassword } from "./bcrypt";

describe("hashPassword", () => {
    it("calls bcrypt.hash with password and cost", async () => {
        mockHash.mockResolvedValue("$2b$12$hashedvalue");

        const result = await hashPassword("mypassword", 12);

        expect(mockHash).toHaveBeenCalledWith("mypassword", 12);
        expect(result).toBe("$2b$12$hashedvalue");
    });
});

describe("verifyPassword", () => {
    it("returns true when password matches hash", async () => {
        mockCompare.mockResolvedValue(true);

        const result = await verifyPassword("mypassword", "$2b$12$hashedvalue");

        expect(mockCompare).toHaveBeenCalledWith("mypassword", "$2b$12$hashedvalue");
        expect(result).toBe(true);
    });

    it("returns false when password does not match hash", async () => {
        mockCompare.mockResolvedValue(false);

        const result = await verifyPassword("wrongpassword", "$2b$12$hashedvalue");

        expect(result).toBe(false);
    });
});
