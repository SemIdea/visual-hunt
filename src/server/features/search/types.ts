import type { Prisma, Result, Search } from "@/generated/prisma";

export type SearchEntity = Search;
export type ResultEntity = Result;
export type SearchEntityWithResults = Prisma.SearchGetPayload<{
    include: { results: true };
}>;
