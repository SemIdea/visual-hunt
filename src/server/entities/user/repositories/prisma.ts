import { prisma } from "@/server/drivers/prisma";
import { IUserEntity, IUserModel } from "../DTO";

class PrismaUserModel implements IUserModel {
  async create(
    id: string,
    data: Omit<IUserEntity, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.user.create({
      data: {
        id,
        ...data,
      },
    });
  }

  async read(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async readByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<IUserEntity, "id" | "createdAt" | "updatedAt">>
  ) {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }
}

export { PrismaUserModel };
