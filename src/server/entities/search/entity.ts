import { BaseEntity } from "../base/entity";
import {
  IReadSearchWithResults,
  ISearchEntity,
  ISearchEntityWithResults,
  ISearchModel,
} from "./DTO";

class SearchEntityClass extends BaseEntity<ISearchEntity, ISearchModel> {
  async readWithResults({ searchId, repositories }: IReadSearchWithResults) {
    const search = await repositories.database.readWithResults(searchId);

    return search as ISearchEntityWithResults | null;
  }

  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const SearchEntity = new SearchEntityClass();

export { SearchEntity };
