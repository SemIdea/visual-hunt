"use client";

import TrpcProvider from "@/context/trpc";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type ProvidersProps = {
  session: Session | null;
  children: ReactNode;
} & React.ComponentProps<typeof NextThemesProvider>;

function Providers({
  session,
  children,
  ...themeProps
}: ProvidersProps): React.ReactNode {
  return (
    <SessionProvider session={session}>
      <TrpcProvider>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </TrpcProvider>
    </SessionProvider>
  );
}

export default Providers;
