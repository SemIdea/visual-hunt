import ms from "ms";

export const env = {
    publicUrl: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",

    database: {
        redis: { url: process.env.REDIS_URL || "" },
        postgres: { url: process.env.DATABASE_URL || "" },
    },

    auth: {
        session: {
            accessSecret: process.env.AUTH_SESSION_ACCESS_SECRET || "accessSecret",
            refreshSecret: process.env.AUTH_SESSION_REFRESH_SECRET || "refreshSecret",
            token: {
                byteLength: Number(process.env.AUTH_TOKEN_BYTE_LENGTH) || 32,
                expire: {
                    accessToken: ms((process.env.AUTH_ACCESS_TOKEN_TTL || "15m") as ms.StringValue),
                    refreshToken: ms(
                        (process.env.AUTH_REFRESH_TOKEN_TTL || "7d") as ms.StringValue,
                    ),
                },
            },
            cache: {
                ttl: ms((process.env.AUTH_SESSION_CACHE_TTL || "5m") as ms.StringValue),
                sessionKeyPrefix: process.env.AUTH_SESSION_CACHE_KEY_PREFIX || "session:",
            },
        },
        user: {
            bcrypt: {
                cost: Number(process.env.AUTH_USER_BCRYPT_COST) || 12,
            },
        },
        rateLimit: {
            maxRequests: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
            windowMs: ms((process.env.AUTH_RATE_LIMIT_WINDOW_MS || "15s") as ms.StringValue),
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
};
