import z from "zod";

export enum AuthStatus {
    AUTHENTICATED = "AUTHENTICATED",
    LOGGED_OUT = "LOGGED_OUT",
}

export const authenticatedResultSchema = z.object({
    status: z.literal(AuthStatus.AUTHENTICATED),
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    expiresIn: z.number().min(1),
});

export const loginResultSchema = z.discriminatedUnion("status", [authenticatedResultSchema]);

export const logoutResultSchema = z.object({
    status: z.literal(AuthStatus.LOGGED_OUT),
});

export const refreshSessionResultSchema = z.object({
    accessToken: z.string().min(1),
    refreshToken: z.string().min(1),
    expiresIn: z.number().min(1),
});

export const UserAgentSchema = z.object({
    browser: z.string().min(1),
    engine: z.string().min(1),
    os: z.string().min(1),
});

export type IUserAgent = z.infer<typeof UserAgentSchema>;

export const sessionSchema = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    accessTokenExpiresAt: z.coerce.date(),
    revokedAt: z.coerce.date().nullable(),
    userAgent: UserAgentSchema,
    ip: z.string(),
});

export type ISession = z.infer<typeof sessionSchema>;

export enum SessionStatus {
    VALID = "VALID",
    INVALID = "INVALID",
    NOT_FOUND = "NOT_FOUND",
    EXPIRED = "EXPIRED",
    REVOKED = "REVOKED",
}

export const loginInputSchema = z.object({
    email: z.string().email().max(255).trim().toLowerCase(),
    password: z.string().min(8).max(128),
});

export const refreshSessionInputSchema = z.object({
    refreshToken: z.string().min(1),
});
