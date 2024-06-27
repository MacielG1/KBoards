import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./utils/db";
import { accounts, users } from "./drizzle/schema";
import { eq } from "drizzle-orm";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),

  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
  },

  events: {
    async linkAccount({ user }) {
      if (user.id) {
        // Update the user's emailVerified field when they link an account
        await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
      }
    },
  },
});
