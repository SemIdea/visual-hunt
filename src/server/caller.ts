import { createTRPCContext } from "./createContex";
import { appRouter } from "./routes/app.routes";

const createCaller = async () => {
  return appRouter.createCaller(createTRPCContext());
};

export { createCaller };