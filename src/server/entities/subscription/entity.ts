import { BaseEntity } from "../base/entity";
import { ISubscriptionEntity, ISubscriptionModel } from "./DTO";

class SubscriptionEntityClass extends BaseEntity<
  ISubscriptionEntity,
  ISubscriptionModel
> {
  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const SubscriptionEntity = new SubscriptionEntityClass();

export { SubscriptionEntity };
