import type { TRPCContext } from "@/server/root";

export const domain_ping = async ({ ctx }: { ctx: TRPCContext }) => ({
    dbConnected: !!ctx.db,
    envLoaded: !!ctx.env.publicUrl,
    tasksReady: !!ctx.tasks.startSearch,
    servicesReady: !!ctx.services.payments,
});
