import { helpers, IHelpers } from "./container/helpers";
import { IRepositories, repositories } from "./container/repositories";
import { UserEntity } from "./entities/user/entity";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { IUserEntity } from "./entities/user/DTO";

type IBaseContextDTO = {
  helpers: IHelpers;
  repositories: IRepositories;
};

type IAPIContextDTO = IBaseContextDTO & {
  user?: IUserEntity;
};

type IProtectedAPIContextDTO = IBaseContextDTO & {
  user: IUserEntity;
};

const createTRPCContext = async (): Promise<IAPIContextDTO> => {
  const ctx: IAPIContextDTO = {
    helpers,
    repositories,
  };

  const session = await auth();

  if (!session?.user) return ctx;
  const user = await UserEntity.readByEmail({
    email: session.user.email!,
    repositories: {
      ...ctx.repositories,
      database: ctx.repositories.user,
    },
  });

  if (!user) return ctx;

  ctx.user = user;

  return ctx;
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export { createTRPCContext };
export type { Context, IAPIContextDTO, IProtectedAPIContextDTO };
