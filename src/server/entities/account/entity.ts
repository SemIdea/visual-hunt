import { BaseEntity } from "../base/entity";
import { IAccountEntity, IAccountModel } from "./DTO";

class AccountEntityClass extends BaseEntity<IAccountEntity, IAccountModel> {
  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const AccountEntity = new AccountEntityClass();

export { AccountEntity };
