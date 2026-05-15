import { PrismaClient } from "@/generated/prisma/edge";

let prismaClient: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
    if (!prismaClient) {
        prismaClient = new PrismaClient();
    }
    return prismaClient;
}
