import { BaseEntity } from "../base/entity";
import { IReadUserByEmailDTO, IUserEntity, IUserModel } from "./DTO";

class UserEntityClass extends BaseEntity<
  IUserEntity,
  IUserModel,
  "user",
  "id" | "email"
> {
  async readByEmail({ email, repositories }: IReadUserByEmailDTO) {
    // const cachedUser = this.readCachedEntityByIndex({
    //   indexName: "email",
    //   indexValue: email,
    //   repositories,
    // });

    // if (cachedUser) return cachedUser;

    const user = await repositories.database.readByEmail(email);

    if (!user) return null;

    await this.cacheEntity({
      data: user,
      repositories,
    });

    return user;
  }

  constructor() {
    super({
      shouldCache: true,
      cache: {
        key: "user",
        ttl: 1000 * 60 * 15, // 15 minutes
      },
      index: ["id", "email"],
    });
  }
}

const UserEntity = new UserEntityClass();

export { UserEntity };
