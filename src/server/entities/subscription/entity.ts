import { BaseEntity } from "../base/entity";
import {
  IReadSubscriptionByUserId,
  ISubscriptionEntity,
  ISubscriptionModel,
  IUpdateSubscriptionByUserId,
} from "./DTO";

class SubscriptionEntityClass extends BaseEntity<
  ISubscriptionEntity,
  ISubscriptionModel
> {
  readByUserId = async ({
    userId,
    repositories,
  }: IReadSubscriptionByUserId) => {
    const subscription = await repositories.database.readByUserId(userId);

    return subscription;
  };

  updateByUserId = async ({
    userId,
    data,
    repositories,
  }: IUpdateSubscriptionByUserId) => {
    const updatedSubscription = await repositories.database.updateByUserId(
      userId,
      data
    );

    return updatedSubscription;
  };

  constructor() {
    super({
      shouldCache: false,
    });
  }
}

const SubscriptionEntity = new SubscriptionEntityClass();

export { SubscriptionEntity };
