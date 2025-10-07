import { BaseEntity } from "../base/entity";
import {
  IReadSearchHistoryDTO,
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

  async readSearchHistory({ userId, repositories }: IReadSearchHistoryDTO) {
    return await repositories.database.readSearchHistory(userId);
  }

  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const SearchEntity = new SearchEntityClass();

export { SearchEntity };
