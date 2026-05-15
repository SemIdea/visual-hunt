import { createTRPCRouter } from "@/server/root";
import { procedure_deleteSearch } from "./procedures/delete";
import { procedure_getSearch } from "./procedures/get";
import { procedure_getSearchHistory } from "./procedures/get-history";
import { procedure_ping } from "./procedures/ping";
import { procedure_startSearch } from "./procedures/start-search";

export const router_search = createTRPCRouter({
    ping: procedure_ping,
    getSearch: procedure_getSearch,
    startSearch: procedure_startSearch,
    getSearchHistory: procedure_getSearchHistory,
    deleteSearch: procedure_deleteSearch,
});
