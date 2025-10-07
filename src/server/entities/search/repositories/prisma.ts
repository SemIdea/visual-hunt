import { prisma } from "@/server/drivers/prisma";
import { ISearchEntity, ISearchModel } from "../DTO";

class PrismaSearchModel implements ISearchModel {
  async create(
    id: string,
    data: Omit<ISearchEntity, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.search.create({
      data: {
        id,
        ...data,
      },
    });
  }

  async read(id: string) {
    return await prisma.search.findUnique({
      where: { id },
    });
  }

  async readWithResults(searchId: string) {
    return await prisma.search.findUnique({
      where: { id: searchId },
      include: {
        results: true,
      },
    });
  }

  async readSearchHistory(userId: string) {
    return await prisma.search.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<ISearchEntity, "id" | "createdAt" | "updatedAt">>
  ) {
    return await prisma.search.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    try {
      await prisma.search.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }
}

export { PrismaSearchModel };
