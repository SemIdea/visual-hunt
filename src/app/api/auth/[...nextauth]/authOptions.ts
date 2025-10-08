import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // 1. JWT callback is called whenever a JWT is created or updated.
    async jwt({ token, user }) {
      // On initial sign in, `user` object is available.
      if (user) {
        token.id = user.id;
        // Fetch the subscription from your database.
        const subscription = await prisma.subscription.findUnique({
          where: { userId: user.id },
          select: {
            status: true,
            currentPeriodEnd: true,
            stripePriceId: true,
          },
        });

        // Add the subscription status to the token.
        if (subscription) {
          token.subscription = {
            status: subscription.status,
            currentPeriodEnd: subscription.currentPeriodEnd,
            priceId: subscription.stripePriceId,
          };
        }
      }
      return token;
    },

    // 2. Session callback is called whenever a session is checked.
    async session({ session, token }) {
      // Pass the subscription data from the token to the session object.
      if (token.subscription && session.user) {
        session.user.subscription = token.subscription;
      }
      return session;
    },
  },
};

export { authOptions };
