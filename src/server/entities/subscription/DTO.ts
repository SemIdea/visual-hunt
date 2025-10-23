import { Subscription } from "@prisma/client";
import { IEntityDatabaseRepository } from "../base/entity";

type ISubscriptionEntity = Subscription;

type ISubscriptionExtraRepositories = {};

type ISubscriptionModel = IEntityDatabaseRepository<
  ISubscriptionEntity,
  ISubscriptionExtraRepositories
>;

export type {
  ISubscriptionEntity,
  ISubscriptionExtraRepositories,
  ISubscriptionModel,
};
