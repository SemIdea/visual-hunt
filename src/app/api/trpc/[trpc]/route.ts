import { createTRPCContext } from "@/server/createContex";
import { appRouter } from "@/server/routes/app.routes";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { NextRequest } from "next/server";

const createContext = async () => {
  return await createTRPCContext();
};

const handler = (req: NextRequest) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: async () => await createContext(),
  });
};

export { handler as GET, handler as POST };
