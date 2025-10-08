// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";

// Define the shape of your subscription data
interface Subscription {
  status: string | null;
  currentPeriodEnd: Date | null;
  priceId: string | null;
}

// Extend the existing User and Session types
declare module "next-auth" {
  interface User {
    subscription?: Subscription;
  }

  interface Session extends DefaultSession {
    user?: User & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    subscription?: Subscription;
  }
}
