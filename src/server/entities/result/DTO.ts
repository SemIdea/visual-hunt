import type { Result } from "@prisma/client";
import { IEntityDatabaseRepository } from "../base/entity";

type IResultEntity = Result;

type IResultModel = IEntityDatabaseRepository<IResultEntity, {}>;

export type { IResultEntity, IResultModel };
