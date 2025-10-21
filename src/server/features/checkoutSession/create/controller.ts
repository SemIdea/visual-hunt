import { IProtectedAPIContextDTO } from "@/server/createContex";
import { CreateCheckoutSessionInput } from "@/server/schema/checkoutSession.schema";
import { CreateCheckoutSessionService } from "./service";

const createCheckoutSessionController = async ({
  input,
  ctx,
}: {
  input: CreateCheckoutSessionInput;
  ctx: IProtectedAPIContextDTO;
}) => {
  const checkoutSessionUrl = await CreateCheckoutSessionService({
    priceId: input.priceId,
    userId: ctx.user.id,
    repositories: {
      user: ctx.repositories.user,
      cache: ctx.repositories.cache,
    },
  });

  return { url: checkoutSessionUrl };
};

export { createCheckoutSessionController };
