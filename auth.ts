import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";

import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserByEmail } from "./lib/user";

declare module "next-auth" {
  interface Session {
    user: {
      role: "USER" | "ADMIN";
      userId: string;
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },

  cookies: {
    sessionToken: {
      name:
        process.env.NODE_ENV === "production"
          ? "syntaxly.session-token"
          : "syntaxly.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      },
    },
    callbackUrl: {
      name: "syntaxly.callback-url",
      options: {
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      },
    },
    csrfToken: {
      name: "syntaxly.csrf-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
      },
    },
    pkceCodeVerifier: {
      name: "syntaxly.pkce.code_verifier",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15,
      },
    },
    state: {
      name: "syntaxly.state",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15,
      },
    },
    nonce: {
      name: "syntaxly.nonce",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15,
      },
    },
  },

  ...authConfig,
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.email) return token;

      const user = await getUserByEmail(token.email);

      if (!user) return token;

      token.role = user.role;
      token.userId = user.id;

      return token;
    },
    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role as "USER" | "ADMIN";
      }

      if (token.userId) {
        session.user.userId = token.userId as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
