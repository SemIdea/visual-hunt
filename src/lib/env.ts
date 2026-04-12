import ms, { type StringValue } from "ms";

export const env = {
    publicUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    database: {
        redis: { url: process.env.REDIS_URL || "" },
        postgres: { url: process.env.DATABASE_URL || "" },
    },
    auth: {
        nextAuthSecret: process.env.NEXTAUTH_SECRET || "",
        nextAuthUrl: process.env.NEXTAUTH_URL || "",
        github: {
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || "",
        },
        google: {
            clientId: process.env.GOOGLE_ID || "",
            clientSecret: process.env.GOOGLE_SECRET || "",
        },
        session: {
            cacheTtl: ms((process.env.AUTH_SESSION_CACHE_TTL || "15m") as StringValue),
        },
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY || "",
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    },
    cloudinary: {
        url: process.env.CLOUDINARY_URL || "",
        apiSecret: process.env.CLOUDINARY_API_SECRET || "",
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
    },
    scrapingDog: {
        apiKey: process.env.SCRAPING_DOG_API_KEY || "",
    },
    serpApi: {
        apiKey: process.env.SERP_API_KEY || "",
    },
    trigger: {
        secretKey: process.env.TRIGGER_SECRET_KEY || "",
    },
    rateLimit: {
        burst: {
            limit: Number(process.env.RATE_LIMIT_BURST_LIMIT) || 5,
            windowMs: ms((process.env.RATE_LIMIT_BURST_WINDOW_MS || "15s") as StringValue),
        },
        hard: {
            limit: Number(process.env.RATE_LIMIT_HARD_LIMIT) || 15,
            windowMs: ms((process.env.RATE_LIMIT_HARD_WINDOW_MS || "1m") as StringValue),
        },
        ban: {
            maxMinutes: Number(process.env.RATE_LIMIT_MAX_BAN_MINUTES) || 15,
        },
    },
};
