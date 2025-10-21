// types/next-auth.d.ts

import { Subscription } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";


// Extend the existing User and Session types
declare module "next-auth" {
  interface User {
    subscription?: Subscription | null;
  }

  interface Session extends DefaultSession {
    user?: User & DefaultSession["user"];
  }
}

// src/types/auth.d.ts

// Import the original type, though it's not strictly necessary for augmentation
// it helps with clarity and editor intellisense.
import { AdapterUser } from "next-auth/adapters";

// Use 'declare module' to target the package's type definitions
declare module "next-auth/adapters" {
  /**
   * Extends the built-in AdapterUser model.
   * Now, everywhere in your project, AdapterUser will have this new property.
   */
  interface AdapterUser {
    subscription?: Subscription | null;
  }
}