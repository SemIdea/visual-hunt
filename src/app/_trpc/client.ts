import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/server/routes/app.routes";

const trpc = createTRPCReact<AppRouter>();

export { trpc };
