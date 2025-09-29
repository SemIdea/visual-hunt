import { SearchEntity } from "@/server/entities/search/entity";
import { IReadSearchByIdDTO } from "./DTO";

const ReadSearchByIdService = async ({
  repositories,
  ...data
}: IReadSearchByIdDTO) => {
  const search = await SearchEntity.read({
    ...data,
    repositories,
  });

  return search;
};

export { ReadSearchByIdService };
