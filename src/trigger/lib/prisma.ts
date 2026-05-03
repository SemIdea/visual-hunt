import { PrismaClient } from "@prisma/client/edge";

let prismaClient: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
    if (!prismaClient) {
        prismaClient = new PrismaClient();
    }
    return prismaClient;
}
