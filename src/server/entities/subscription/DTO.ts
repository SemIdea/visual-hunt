import { Subscription } from "@prisma/client";
import { IEntityDatabaseRepository } from "../base/entity";

type ISubscriptionEntity = Subscription;

type ISubscriptionExtraRepositories = {
  readByUserId: (userId: string) => Promise<ISubscriptionEntity | null>;
  updateByUserId: (
    userId: string,
    data: Partial<Omit<ISubscriptionEntity, "id" | "createdAt" | "updatedAt">>
  ) => Promise<ISubscriptionEntity>;
};

type ISubscriptionModel = IEntityDatabaseRepository<
  ISubscriptionEntity,
  ISubscriptionExtraRepositories
>;

type IReadSubscriptionByUserId = {
  userId: string;
  repositories: {
    database: ISubscriptionExtraRepositories;
  };
};

type IUpdateSubscriptionByUserId = {
  userId: string;
  data: Partial<Omit<ISubscriptionEntity, "id" | "createdAt" | "updatedAt">>;
  repositories: {
    database: ISubscriptionExtraRepositories;
  };
};

export type {
  ISubscriptionEntity,
  ISubscriptionExtraRepositories,
  ISubscriptionModel,
  IReadSubscriptionByUserId,
  IUpdateSubscriptionByUserId,
};
