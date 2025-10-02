"use client";

import TrpcProvider from "@/context/trpc";
import { HeroUIProvider } from "@heroui/react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

function Providers({
  session,
  children,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <HeroUIProvider>
        <TrpcProvider>{children}</TrpcProvider>
      </HeroUIProvider>
    </SessionProvider>
  );
}

export default Providers;
