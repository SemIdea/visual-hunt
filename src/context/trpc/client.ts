import { httpBatchLink, loggerLink } from "@trpc/react-query";
import { trpc } from "@/app/_trpc/client";

export const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      loggerLink({
        enabled: () => true,
      }),
      httpBatchLink({
        url: "/api/trpc",
      }),
    ],
  });
};
