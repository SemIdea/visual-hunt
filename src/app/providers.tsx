"use client";

import TrpcProvider from "@/context/trpc";
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
      <TrpcProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </TrpcProvider>
    </SessionProvider>
  );
}

export default Providers;
