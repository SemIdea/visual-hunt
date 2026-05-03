import { createTRPCRouter } from "@/server/root";
import { procedure_ping } from "./procedures/ping";

export const router_search = createTRPCRouter({
    ping: procedure_ping,
});
