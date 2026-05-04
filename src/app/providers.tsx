"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps, ReactNode } from "react";
import { AuthProvider } from "@/lib/auth/context";
import { TRPCReactProvider } from "@/lib/trpc/client";

type ProvidersProps = {
    children: ReactNode;
} & ComponentProps<typeof NextThemesProvider>;

function Providers({ children, ...themeProps }: ProvidersProps): ReactNode {
    return (
        <TRPCReactProvider>
            <AuthProvider>
                <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
            </AuthProvider>
        </TRPCReactProvider>
    );
}

export default Providers;
