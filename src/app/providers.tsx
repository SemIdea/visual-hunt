"use client";

import TrpcProvider from "@/context/trpc";
import { HeroUIProvider } from "@heroui/react";
import { getServerSession } from "next-auth";
import { SessionProvider } from "next-auth/react";

async function Providers({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();

  return (
    <SessionProvider session={session}>
      <HeroUIProvider>
        <TrpcProvider>{children}</TrpcProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}

export default Providers;
