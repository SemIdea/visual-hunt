import { prisma } from "@/server/drivers/prisma";
import { IAccountEntity, IAccountModel } from "../DTO";

class PrismaAccountModel implements IAccountModel {
  async create(
    id: string,
    data: Omit<IAccountEntity, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.account.create({
      data: {
        id,
        ...data,
      },
    });
  }

  async read(id: string) {
    return await prisma.account.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<IAccountEntity, "id" | "createdAt" | "updatedAt">>
  ) {
    return await prisma.account.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    try {
      await prisma.account.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }
}

export { PrismaAccountModel };