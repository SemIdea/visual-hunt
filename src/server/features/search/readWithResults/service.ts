import { SearchEntity } from "@/server/entities/search/entity";
import { IReadSearchWithResultsDTO } from "./DTO";

const ReadSearchWithResultsService = ({
  repositories,
  ...data
}: IReadSearchWithResultsDTO) => {
  const search = SearchEntity.readWithResults({
    searchId: data.id,
    repositories,
  });

  return search;
};

export { ReadSearchWithResultsService };
