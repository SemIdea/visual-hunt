"use client";

import TrpcProvider from "@/context/trpc";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ComponentProps, ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ProvidersProps = {
  session: Session | null;
  children: ReactNode;
} & ComponentProps<typeof NextThemesProvider>;

function Providers({
  session,
  children,
  ...themeProps
}: ProvidersProps): ReactNode {
  return (
    <SessionProvider session={session}>
      <TrpcProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </TrpcProvider>
    </SessionProvider>
  );
}

export default Providers;
