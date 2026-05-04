import { TRPCError } from "@trpc/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TRPCContext } from "@/server/root";
import { domain_checkRateLimit } from "./rate-limit";

const mockIncr = vi.fn();
const mockPexpire = vi.fn();

const makeCtx = (overrides: Partial<TRPCContext> = {}): TRPCContext =>
    ({
        redis: { incr: mockIncr, pexpire: mockPexpire },
        device: { ip: "192.168.1.1" },
        env: {
            auth: {
                rateLimit: { maxRequests: 5, windowMs: 15000 },
            },
        },
        ...overrides,
    }) as unknown as TRPCContext;

describe("domain_checkRateLimit", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("does nothing when IP is missing", async () => {
        const ctx = makeCtx({ device: undefined as never });
        await domain_checkRateLimit({ ctx });
        expect(mockIncr).not.toHaveBeenCalled();
    });

    it("passes when under limit", async () => {
        mockIncr.mockResolvedValue(3);
        mockPexpire.mockResolvedValue(1);
        const ctx = makeCtx();

        await expect(domain_checkRateLimit({ ctx })).resolves.toBeUndefined();
        expect(mockIncr).toHaveBeenCalledWith("rate:192.168.1.1");
        expect(mockPexpire).not.toHaveBeenCalled();
    });

    it("sets pexpire on first request", async () => {
        mockIncr.mockResolvedValue(1);
        mockPexpire.mockResolvedValue(1);
        const ctx = makeCtx();

        await domain_checkRateLimit({ ctx });
        expect(mockPexpire).toHaveBeenCalledWith("rate:192.168.1.1", 15000);
    });

    it("passes at exactly the limit", async () => {
        mockIncr.mockResolvedValue(5);
        mockPexpire.mockResolvedValue(1);

        await expect(domain_checkRateLimit({ ctx: makeCtx() })).resolves.toBeUndefined();
    });

    it("throws when over limit", async () => {
        mockIncr.mockResolvedValue(6);
        mockPexpire.mockResolvedValue(1);

        await expect(domain_checkRateLimit({ ctx: makeCtx() })).rejects.toThrow(TRPCError);
        await expect(domain_checkRateLimit({ ctx: makeCtx() })).rejects.toMatchObject({
            code: "TOO_MANY_REQUESTS",
        });
    });
});
