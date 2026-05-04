import { randomBytes } from "node:crypto";
import type { TRPCContext } from "@/server/root";
import { HmacSha256 } from "./crypto";

const getTokenExpiration = (ctx: TRPCContext) => {
    return {
        accessToken: new Date(Date.now() + ctx.env.auth.session.token.expire.accessToken),
        refreshToken: new Date(Date.now() + ctx.env.auth.session.token.expire.refreshToken),
    };
};

export const generateSessionTokens = (ctx: TRPCContext) => {
    const accessToken = randomBytes(ctx.env.auth.session.token.byteLength).toString("hex");
    const refreshToken = randomBytes(ctx.env.auth.session.token.byteLength).toString("hex");
    return {
        accessToken,
        refreshToken,
        accessTokenHash: HmacSha256(accessToken, ctx.env.auth.session.accessSecret),
        refreshTokenHash: HmacSha256(refreshToken, ctx.env.auth.session.refreshSecret),
    };
};

export const generateSession = (ctx: TRPCContext) => {
    const tokens = generateSessionTokens(ctx);
    const expiration = getTokenExpiration(ctx);
    return {
        ...tokens,
        accessTokenExpiresAt: expiration.accessToken,
        refreshTokenExpiresAt: expiration.refreshToken,
        expiresIn: Math.floor((expiration.accessToken.getTime() - Date.now()) / 1000),
    };
};

export const generateToken = (byteLength: number, prefix: string) => {
    return `${prefix}_${randomBytes(byteLength).toString("hex")}`;
};
