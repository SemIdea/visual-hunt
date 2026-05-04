import { TRPCError } from "@trpc/server";
import type { IUserAgent } from "@/server/features/auth/schemas";
import { UserAgentSchema } from "@/server/features/auth/schemas";

export interface Device {
    ip: string;
    userAgent: IUserAgent;
}

export const parseHeaders = (headers: Headers): Device => {
    const xff = headers.get("x-forwarded-for");
    const ip = xff?.split(",")[0].trim() ?? headers.get("cf-connecting-ip") ?? "127.0.0.1";

    const rawUA = headers.get("user-agent");

    if (!rawUA) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Missing user-agent header" });
    }

    const parsed = UserAgentSchema.safeParse({
        browser: rawUA.split("/")[0] || "Unknown",
        engine: "Unknown",
        os: "Unknown",
    });

    if (!parsed.success) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid user agent" });
    }

    return { ip, userAgent: parsed.data };
};

export const extractBearerToken = (headers: Headers): string | null => {
    const auth = headers.get("authorization");
    const [type, token] = auth?.split(" ") ?? [];
    if (type !== "Bearer" || !token) return null;
    return token;
};
