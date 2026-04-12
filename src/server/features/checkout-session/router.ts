import { createTRPCRouter } from "@/server/root";
import { procedure_createCheckoutSession } from "./procedures/create-checkout-session";

export const router_checkout = createTRPCRouter({
    create: procedure_createCheckoutSession,
});
