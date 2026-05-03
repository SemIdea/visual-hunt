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
