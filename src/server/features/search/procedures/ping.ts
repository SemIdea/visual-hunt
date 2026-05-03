import { publicProcedure } from "@/server/root";
import { domain_ping } from "../domain/ping";

export const procedure_ping = publicProcedure.query(async ({ ctx }) => {
    return domain_ping({ ctx });
});
