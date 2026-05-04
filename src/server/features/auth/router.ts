import { createTRPCRouter } from "@/server/root";
import { procedure_login } from "./procedures/login";
import { procedure_logout } from "./procedures/logout";
import { procedure_me } from "./procedures/me";
import { procedure_refreshSession } from "./procedures/refresh-session";

export const router_auth = createTRPCRouter({
    login: procedure_login,
    logout: procedure_logout,
    refreshSession: procedure_refreshSession,
    me: procedure_me,
});
