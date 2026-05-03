import { createTRPCRouter } from "@/server/root";
import { procedure_ping } from "./procedures/ping";
import { procedure_startSearch } from "./procedures/start-search";

export const router_search = createTRPCRouter({
    ping: procedure_ping,
    startSearch: procedure_startSearch,
});
