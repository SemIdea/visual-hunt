import { getServerSession } from "next-auth";
import { helpers, IHelpers } from "./container/helpers";
import { IRepositories, repositories } from "./container/repositories";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserEntity } from "./entities/user/entity";

type IBaseContextDTO = {
  helpers: IHelpers;
  repositories: IRepositories;
};

type IAPIContextDTO = IBaseContextDTO & {
  userId?: string;
};

type IProtectedAPIContextDTO = IBaseContextDTO & {
  userId: string;
};

const createTRPCContext = async (): Promise<IAPIContextDTO> => {
  const ctx: IAPIContextDTO = {
    helpers,
    repositories,
  };

  const session = await getServerSession(authOptions);

  if (!session?.user) return ctx;

  const user = await UserEntity.readByEmail({
    email: session.user.email!,
    repositories: {
      ...ctx.repositories,
      database: ctx.repositories.user,
    },
  });

  if (!user) return ctx;

  ctx.userId = user.id;
  
  return ctx;
};

type Context = Awaited<ReturnType<typeof createTRPCContext>>;

export { createTRPCContext };
export type { Context, IAPIContextDTO, IProtectedAPIContextDTO };
