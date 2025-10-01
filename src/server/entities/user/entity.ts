import { BaseEntity } from "../base/entity";
import { IReadUserByEmailDTO, IUserEntity, IUserModel } from "./DTO";

class UserEntityClass extends BaseEntity<IUserEntity, IUserModel> {
  async readByEmail({ email, repositories }: IReadUserByEmailDTO) {
    return await repositories.database.readByEmail(email);
  }

  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const UserEntity = new UserEntityClass();

export { UserEntity };
