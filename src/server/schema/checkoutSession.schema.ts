import z from "zod";

const createCheckoutSessionSchema = z.object({
  priceId: z.string().nonempty("Price ID is required"),
});

type CreateCheckoutSessionInput = z.TypeOf<typeof createCheckoutSessionSchema>;

export { createCheckoutSessionSchema };
export type { CreateCheckoutSessionInput };
