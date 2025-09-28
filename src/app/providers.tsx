"use client";

import TrpcProvider from "@/context/trpc";
import { HeroUIProvider } from "@heroui/react";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HeroUIProvider>
      <TrpcProvider>{children}</TrpcProvider>
    </HeroUIProvider>
  );
}

export default Providers;
