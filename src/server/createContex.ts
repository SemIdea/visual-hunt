import { helpers, IHelpers } from "./container/helpers";
import { IRepositories, repositories } from "./container/repositories";
import { User } from "next-auth";

type IBaseContextDTO = {
  helpers: IHelpers;
  repositories: IRepositories;
};

type IAPIContextDTO = IBaseContextDTO & {
  user?: User;
};

type IProtectedAPIContextDTO = IBaseContextDTO & {
  user: Required<User>;
};

const createTRPCContext = async (): Promise<IAPIContextDTO> => {
  const ctx: IAPIContextDTO = {
    helpers,
    repositories,
  };

  return ctx;
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export { createTRPCContext };
export type { Context, IAPIContextDTO, IProtectedAPIContextDTO };
