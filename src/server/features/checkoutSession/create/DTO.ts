import { IUserModel } from "@/server/entities/user/DTO";

type ICreateCheckoutSessionDTO = {
  priceId: string;
  userId: string;
  repositories: {
    user: IUserModel;
  };
};

export type { ICreateCheckoutSessionDTO };
