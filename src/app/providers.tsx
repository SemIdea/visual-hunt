"use client";

import { TRPCReactProvider } from "@/lib/trpc/client";
import { SessionProvider } from "next-auth/react";
import { ComponentProps, ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ProvidersProps = {
  children: ReactNode;
} & ComponentProps<typeof NextThemesProvider>;

function Providers({ children, ...themeProps }: ProvidersProps): ReactNode {
  return (
    <SessionProvider
      refetchOnWindowFocus={false}
      refetchInterval={0}
    >
      <TRPCReactProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </TRPCReactProvider>
    </SessionProvider>
  );
}

export default Providers;
