"use client";

import TrpcProvider from "@/context/trpc";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

function Providers({
  session,
  children,
}: {
  children: ReactNode;
  session: Session | null;
}) {
  return (
    <SessionProvider session={session}>
      <TrpcProvider>{children}</TrpcProvider>
    </SessionProvider>
  );
}

export default Providers;
