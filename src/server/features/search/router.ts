import { createTRPCRouter } from "@/server/root";
import { procedure_deleteSearch } from "./procedures/delete";
import { procedure_getSearch } from "./procedures/get";
import { procedure_getSearchHistory } from "./procedures/get-history";
import { procedure_searchWithUrl } from "./procedures/with-url";

export const router_search = createTRPCRouter({
    searchWithUrl: procedure_searchWithUrl,
    deleteSearch: procedure_deleteSearch,
    getSearch: procedure_getSearch,
    getSearchHistory: procedure_getSearchHistory,
    search: procedure_searchWithUrl,
});
