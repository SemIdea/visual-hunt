import { BaseEntity } from "../base/entity";
import { IResultEntity, IResultModel } from "./DTO";

class ResultEntityClass extends BaseEntity<IResultEntity, IResultModel> {
  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const ResultEntity = new ResultEntityClass();

export { ResultEntity };
