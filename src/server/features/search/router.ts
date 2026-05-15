import { createTRPCRouter } from "@/server/root";
import { procedure_deleteSearch } from "./procedures/delete";
import { procedure_getSearch, procedure_readSearchWithResults } from "./procedures/get";
import { procedure_getSearchHistory } from "./procedures/get-history";
import { procedure_ping } from "./procedures/ping";
import { procedure_startSearch } from "./procedures/start-search";
import { procedure_searchWithUrl } from "./procedures/with-url";

export const router_search = createTRPCRouter({
    ping: procedure_ping,
    getSearch: procedure_getSearch,
    startSearch: procedure_startSearch,
    searchWithUrl: procedure_searchWithUrl,
    readSearchWithResults: procedure_readSearchWithResults,
    readSearchHistory: procedure_getSearchHistory,
    deleteSearch: procedure_deleteSearch,
});
