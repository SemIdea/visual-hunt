import { protectedProcedure, t } from "../createRouter";
import { createCheckoutSessionController } from "../features/checkoutSession/create/controller";
import { createCheckoutSessionSchema } from "../schema/checkoutSession.schema";

const CheckoutSessionRouter = t.router({
  create: protectedProcedure
    .input(createCheckoutSessionSchema)
    .mutation(async ({ input, ctx }) =>
      createCheckoutSessionController({ input, ctx })
    ),
});

export { CheckoutSessionRouter };
