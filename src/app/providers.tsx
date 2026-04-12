"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps, ReactNode } from "react";
import { TRPCReactProvider } from "@/lib/trpc/client";

type ProvidersProps = {
    children: ReactNode;
} & ComponentProps<typeof NextThemesProvider>;

function Providers({ children, ...themeProps }: ProvidersProps): ReactNode {
    return (
        <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
            <TRPCReactProvider>
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </TRPCReactProvider>
        </SessionProvider>
    );
}

export default Providers;
