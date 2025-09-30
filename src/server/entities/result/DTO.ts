import { IEntityDatabaseRepository } from "../base/entity";

type IResultEntity = {
  id: string;
  searchId: string;
  position: number;
  title: string;
  source: string;
  link: string;
  thumbnail: string;
  width: number;
  height: number;
};

type IResultModel = IEntityDatabaseRepository<IResultEntity, {}>;

export type { IResultEntity, IResultModel };
