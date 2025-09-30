import { prisma } from "@/server/drivers/prisma";
import { IResultEntity, IResultModel } from "../DTO";

class PrismaResultModel implements IResultModel {
  async create(
    id: string,
    data: Omit<IResultEntity, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.result.create({
      data: {
        id,
        ...data,
      },
    });
  }

  async read(id: string) {
    return await prisma.result.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<IResultEntity, "id" | "createdAt" | "updatedAt">>
  ) {
    return await prisma.result.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    try {
      await prisma.result.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting result:", error);
      return false;
    }
  }
}

export { PrismaResultModel };
