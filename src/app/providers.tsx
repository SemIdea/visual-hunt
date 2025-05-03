"use client";

import { HeroUIProvider } from "@heroui/react";

function Providers({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}

export default Providers;
