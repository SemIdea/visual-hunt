import { BaseEntity } from "../base/entity";
import { ISearchEntity, ISearchModel } from "./DTO";

class SearchEntityClass extends BaseEntity<ISearchEntity, ISearchModel> {
  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const SearchEntity = new SearchEntityClass();

export { SearchEntity };
