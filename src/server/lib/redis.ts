import { Redis } from "ioredis";
import { env } from "@/server/lib/env";

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

export const getRedis = () => {
    globalForRedis.redis ??= new Redis(env.database.redis.url);
    return globalForRedis.redis;
};

export const redis = new Proxy({} as Redis, {
    get(_target, prop) {
        const client = getRedis();
        const value = client[prop as keyof Redis];
        return typeof value === "function" ? value.bind(client) : value;
    },
});
