import type { Subscription, User } from "@prisma/client";
import {
  IEntityCacheRepository,
  IEntityDatabaseRepository,
} from "../base/entity";

type IUserEntity = User;
type IUserWithSubscription = IUserEntity & {
  subscription?: Subscription;
};

type IUserExtraRepositories = {
  readByEmail: (email: string) => Promise<IUserEntity | null>;
  readBySubscriptionId: (
    subscriptionId: string
  ) => Promise<IUserWithSubscription | null>;
};

type IUserModel = IEntityDatabaseRepository<
  IUserEntity,
  IUserExtraRepositories
>;

type IReadUserByEmailDTO = {
  email: string;
  repositories: {
    database: IUserModel;
    cache: IEntityCacheRepository;
  };
};

type IReadUserWithSubscriptionDTO = {
  userId: string;
  repositories: {
    database: IUserModel;
    cache: IEntityCacheRepository;
  };
};

type IReadUserBySubscriptionIdDTO = {
  subscriptionId: string;
  repositories: {
    database: IUserModel;
  };
};

export type {
  IUserEntity,
  IUserModel,
  IReadUserByEmailDTO,
  IReadUserWithSubscriptionDTO,
  IUserWithSubscription,
  IReadUserBySubscriptionIdDTO,
};
