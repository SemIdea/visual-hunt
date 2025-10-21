import { prisma } from "@/server/drivers/prisma";
import { AppSessionData, ISessionEntity, ISessionModel } from "../DTO";

class PrismaSessionModel implements ISessionModel {
  async create(
    id: string,
    data: Omit<ISessionEntity, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.session.create({
      data: {
        id,
        ...data,
      },
    });
  }

  async read(id: string) {
    return await prisma.session.findUnique({
      where: { id },
    });
  }

  async readBySessionToken(sessionToken: string) {
    return await prisma.session.findUnique({
      where: { sessionToken },
    });
  }

  async readWithUserAndSubscriptionBySessionToken(sessionToken: string) {
    return (await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          include: {
            subscription: true,
          },
        },
      },
    })) as AppSessionData | null;
  }

  async readUserSessions(userId: string) {
    return await prisma.session.findMany({
      where: { userId },
    });
  }

  async update(
    id: string,
    data: Partial<Omit<ISessionEntity, "id" | "createdAt" | "updatedAt">>
  ) {
    return await prisma.session.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    try {
      await prisma.session.delete({
        where: { id },
      });

      return true;
    } catch {
      return false;
    }
  }
}

export { PrismaSessionModel };
