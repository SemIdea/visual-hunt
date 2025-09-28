import { ISearchModel } from "@/server/entities/search/DTO";
import { IUidGeneratorHelperAdapter } from "@/server/integrations/helpers/uidGenerator/adapter";

type ISearchWithUrlDTO = {
  url: string;
  repositories: {
    database: ISearchModel;
  };
  helpers: {
    uid: IUidGeneratorHelperAdapter;
  };
};

export type { ISearchWithUrlDTO };
