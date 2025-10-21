import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { AdapterUser, AdapterAccount } from "next-auth/adapters";
import { UserEntity } from "@/server/entities/user/entity";
import { AccountEntity } from "@/server/entities/account/entity";
import { helpers } from "@/server/container/helpers";
import { repositories } from "@/server/container/repositories";
import { SessionEntity } from "@/server/entities/session/entity";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
  },
  trustHost: true,
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

      return user as AdapterUser;
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

      if (!user) return null;
      return user as AdapterUser;
    },
    getUser: async (id: string) => {
      const user = await UserEntity.read({
        id,
        repositories: {
          ...repositories,
          database: repositories.user,
        },
      });

      if (!user) return null;
      return user as AdapterUser;
    },
    getSessionAndUser: async (sessionToken: string) => {
      const sessionWithUserAndSubscription =
        await SessionEntity.readBySessionToken({
          sessionToken,
          repositories: {
            ...repositories,
            database: repositories.session,
          },
        });

      if (!sessionWithUserAndSubscription) return null;

      if (!(sessionWithUserAndSubscription.expires instanceof Date)) {
        sessionWithUserAndSubscription.expires = new Date(
          sessionWithUserAndSubscription.expires
        );
      }

      return {
        session: sessionWithUserAndSubscription,
        user: sessionWithUserAndSubscription.user,
      };
    },
  },

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
  callbacks: {
    async session({ session }) {
      // console.log("Session", session);
      // console.log("User", user);

      return session;
    },
  },
});
