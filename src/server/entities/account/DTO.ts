import { Account } from "@prisma/client";
import { IEntityDatabaseRepository } from "../base/entity";

type IAccountEntity = Account;

type IAccountExtraRepositories = {};

type IAccountModel = IEntityDatabaseRepository<
  IAccountEntity,
  IAccountExtraRepositories
>;

export type { IAccountEntity, IAccountModel };
