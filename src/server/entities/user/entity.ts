import { BaseEntity } from "../base/entity";
import { IReadUserByEmailDTO, IUserEntity, IUserModel } from "./DTO";

class UserEntityClass extends BaseEntity<
  IUserEntity,
  IUserModel,
  "user",
  "id" | "email"
> {
  async readByEmail({ email, repositories }: IReadUserByEmailDTO) {
    const cachedUser = this.readCachedEntityByIndex({
      indexName: "email",
      indexValue: email,
      repositories,
    });

    if (cachedUser) return cachedUser;

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
        key: "user:%id%",
        ttl: 1000 * 60 * 15, // 15 minutes
      },
      index: {
        email: {
          key: "user:email:%email%",
          ttl: 1000 * 60 * 15, // 15 minutes
        },
        id: {
          key: "user:id:%id%",
          ttl: 1000 * 60 * 15, // 15 minutes
        },
      },
    });
  }
}

const UserEntity = new UserEntityClass();

export { UserEntity };
