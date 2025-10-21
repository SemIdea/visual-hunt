import { IUserModel } from "@/server/entities/user/DTO";
import { ICacheRepositoryAdapter } from "@/server/integrations/repositories/cache/adapter";

type ICreateCheckoutSessionDTO = {
  priceId: string;
  userId: string;
  repositories: {
    user: IUserModel;
    cache: ICacheRepositoryAdapter
  };
};

export type { ICreateCheckoutSessionDTO };
