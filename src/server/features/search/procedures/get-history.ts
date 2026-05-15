import { protectedProcedure } from "@/server/root";
import { domain_getSearchHistory } from "../domain/get-history";

export const procedure_getSearchHistory = protectedProcedure.query(async ({ ctx }) => {
    return await domain_getSearchHistory({
        ctx,
        input: { userId: ctx.session.userId },
    });
});
