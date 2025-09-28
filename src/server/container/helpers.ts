import { IUidGeneratorHelperAdapter } from "../integrations/helpers/uidGenerator/adapter";
import { UuidGenerator } from "../integrations/helpers/uidGenerator/implementations/uuid";

type IHelpers = {
  uid: IUidGeneratorHelperAdapter;
};

const helpers: IHelpers = {
  uid: new UuidGenerator(),
};

export { helpers };

export type { IHelpers };
