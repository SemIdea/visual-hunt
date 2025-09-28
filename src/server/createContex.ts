import { helpers, IHelpers } from "./container/helpers";
import { IRepositories, repositories } from "./container/repositories";

type IBaseContextDTO = {
  helpers: IHelpers;
  repositories: IRepositories;
};

type IAPIContextDTO = IBaseContextDTO & {};

const createTRPCContext = () => {
  const ctx: IAPIContextDTO = {
    helpers,
    repositories,
  };

  return ctx;
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export { createTRPCContext };
export type { Context, IAPIContextDTO };
