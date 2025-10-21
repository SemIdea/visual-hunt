import { BaseEntity } from "../base/entity";
import {
  IReadUserByEmailDTO,
  IReadUserWithSubscriptionDTO,
  IUserEntity,
  IUserModel,
} from "./DTO";

class UserEntityClass extends BaseEntity<
  IUserEntity,
  IUserModel,
  "user",
  "id" | "email"
> {
  async readByEmail({ email, repositories }: IReadUserByEmailDTO) {
    const cachedUser = this.readCachedEntity({
      index: "email",
      value: email,
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

  async readWithSubscription({
    userId,
    repositories,
  }: IReadUserWithSubscriptionDTO) {
    const cachedUser = this.readCachedEntity({
      index: "id",
      value: userId,
      repositories,
    });

    if (cachedUser) return cachedUser;

    const user = await repositories.database.read(userId);

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
        indexes: ["id"],
      },
    });
  }
}

const UserEntity = new UserEntityClass();

export { UserEntity };
