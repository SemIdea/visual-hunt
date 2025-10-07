import { IReadSearchHistoryDTO } from "./DTO";
import { SearchEntity } from "@/server/entities/search/entity";

const ReadSearchHistoryService = ({
  repositories,
  ...data
}: IReadSearchHistoryDTO) => {
  const searches = SearchEntity.readSearchHistory({ repositories, ...data });

  return searches;
};

export { ReadSearchHistoryService };
