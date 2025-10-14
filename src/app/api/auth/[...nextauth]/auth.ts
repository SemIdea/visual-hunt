import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AdapterUser, AdapterAccount } from "next-auth/adapters";

// Your custom entity and repository imports
import { UserEntity } from "@/server/entities/user/entity";
import { AccountEntity } from "@/server/entities/account/entity";
import { helpers } from "@/server/container/helpers";
import { repositories } from "@/server/container/repositories";
import { SessionEntity } from "@/server/entities/session/entity";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Your custom pages configuration is preserved
  pages: {
    signIn: "/auth/login",
  },

  // Your custom adapter logic is preserved
  adapter: {
    ...PrismaAdapter(prisma),
    createUser: async (userData: Omit<AdapterUser, "id">) => {
      const user = await UserEntity.create({
        id: helpers.uid.generate(),
        data: {
          name: userData.name!,
          email: userData.email!,
          image: userData.image!,
          stripeCustomerId: null,
          emailVerified: userData.emailVerified || null,
        },
        repositories: {
          ...repositories,
          database: repositories.user,
        },
      });

      return user as AdapterUser; // Ensure the return type matches AdapterUser
    },
    linkAccount: async (accountData: AdapterAccount) => {
      const account = await AccountEntity.create({
        id: helpers.uid.generate(),
        data: {
          access_token: accountData.access_token!,
          token_type: accountData.token_type!,
          provider: accountData.provider,
          providerAccountId: accountData.providerAccountId,
          scope: accountData.scope!,
          type: accountData.type,
          userId: accountData.userId,
        },
        repositories: {
          ...repositories,
          database: repositories.account,
        },
      });
      // The linkAccount method in the adapter doesn't need to return the account
      // but if you have custom logic that does, ensure it's handled correctly.
      // Prisma adapter expects void or the account. Returning it is safe.
      return account as AdapterAccount;
    },
    getUserByEmail: async (email: string) => {
      const user = await UserEntity.readByEmail({
        email,
        repositories: {
          ...repositories,
          database: repositories.user,
        },
      });
      console.log("getUserByEmail", user);

      if (!user) return null;
      return user as AdapterUser; // Ensure the return type matches
    },
    getUser: async (id: string) => {
      const user = await UserEntity.read({
        id,
        repositories: {
          ...repositories,
          database: repositories.user,
        },
      });
      console.log("getUser", user);

      if (!user) return null;
      return user as AdapterUser; // Ensure the return type matches
    },
    getSessionAndUser: async (sessionToken: string) => {
      const startTime = Date.now();

      const session = await SessionEntity.readBySessionToken({
        sessionToken,
        repositories: {
          ...repositories,
          database: repositories.session,
        },
      });

      if (!session) return null;

      const user = await UserEntity.read({
        id: session.userId,
        repositories: {
          ...repositories,
          database: repositories.user,
        },
      });

      if (!user) return null;
      
      const endTime = Date.now();
      console.log(
        `getSessionAndUser took ${endTime - startTime} ms to execute.`
      );

      return {
        session,
        user,
      };
    },
  },

  // Your providers are configured here
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    Google({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  // Callbacks for extending the session with custom data
  callbacks: {
    async session({ session, user }) {
      console.log("Session", session);
      console.log("User", user);
      // The `user` object here is the user from the database.
      // We can add the user ID to the session object.
      // if (session.user) {
      //   session.user.id = user.id;

      //   // Example of re-adding your subscription logic
      //   // const subscription = await prisma.subscription.findUnique({
      //   //   where: { userId: user.id },
      //   // });
      //   // if (subscription) {
      //   //   (session.user as any).subscription = subscription;
      //   // }
      // }

      return session;
    },
  },
});
