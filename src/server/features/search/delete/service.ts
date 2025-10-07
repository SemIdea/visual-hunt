import { UserEntity } from "@/server/entities/user/entity";
import { IDeleteSearchDTO } from "./DTO";
import { SearchEntity } from "@/server/entities/search/entity";

const DeleteSearchService = async ({
  repositories,
  ...data
}: IDeleteSearchDTO) => {
  const user = await UserEntity.read({
    id: data.userId,
    repositories: {
      ...repositories,
      database: repositories.user,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const search = await SearchEntity.read({
    ...data,
    repositories,
  });

  if (!search) {
    throw new Error("Search not found");
  }

  if (search.userId !== data.userId) {
    throw new Error("You do not have permission to delete this search");
  }

  return SearchEntity.delete({
    ...data,
    data: search,
    repositories: {
      ...repositories,
      database: repositories.database,
    },
  });
};

export { DeleteSearchService };
