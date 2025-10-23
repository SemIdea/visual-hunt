import { prisma } from "@/server/drivers/prisma";
import { ISubscriptionEntity, ISubscriptionModel } from "../DTO";

class ISubscriptionPrismaModel implements ISubscriptionModel {
  async create(
    id: string,
    data: Omit<ISubscriptionEntity, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.subscription.create({
      data: {
        id,
        ...data,
      },
    });
  }

  async read(id: string) {
    return await prisma.subscription.findUnique({
      where: { id },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<ISubscriptionEntity, "id" | "createdAt" | "updatedAt">>
  ) {
    return await prisma.subscription.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    try {
      await prisma.subscription.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }
}

export { ISubscriptionPrismaModel };
