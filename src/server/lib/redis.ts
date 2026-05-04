import { Redis } from "ioredis";
import { env } from "@/server/lib/env";

const globalForRedis = globalThis as unknown as { redis: Redis | undefined };

export const redis = globalForRedis.redis ?? new Redis(env.database.redis.url);

if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = redis;
}
