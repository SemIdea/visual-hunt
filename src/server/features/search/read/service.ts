import { SearchEntity } from "@/server/entities/search/entity";
import { IReadSearchDTO } from "./DTO";

const ReadSearchService = async ({ repositories, ...data }: IReadSearchDTO) => {
  const search = await SearchEntity.read({
    ...data,
    repositories,
  });

  return search;
};

export { ReadSearchService };
