import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./utils/db";
import { accounts, users } from "./drizzle/schema";

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

  // events: {
  //   async linkAccount({ user }) {
  //     await prisma.user.update({
  //       where: {
  //         id: user.id,
  //       },
  //       data: {
  //         emailVerified: new Date(),
  //       },
  //     });
  //   },
  // },
  // callbacks: {
  //   async jwt({ token }) {
  //     if (!token.sub) return token;
  //     const user = await prisma.user.findUnique({
  //       where: {
  //         id: token.sub,
  //       },
  //     });
  //     if (!user) return token;
  //     const existingAccount = getAccount(user.id);
  //     token.isOAuth = !!existingAccount;
  //     token.email = user.email;
  //     token.name = user.name;
  //     token.role = user.role;
  //     token.isTwoFactorEnabled = user.isTwoFactorEnabled;
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token.sub && session.user) {
  //       session.user.id = token.sub;
  //     }
  //     if (token.role && session.user) {
  //       session.user.role = token.role as UserRole;
  //     }
  //     if (session.user) {
  //       session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
  //       session.user.email = token.email as string;
  //       session.user.name = token.name as string;
  //       session.user.isOAuth = token.isOAuth as boolean;
  //     }
  //     return session;
  //   },
  //   async signIn({ user, account }) {
  //     if (account?.provider !== "credentials") return true;
  //     console.log(user);
  //     const existingUser = await prisma.user.findUnique({
  //       where: {
  //         id: user.id,
  //       },
  //     });
  //     if (!existingUser?.emailVerified) return false;
  //     if (existingUser.isTwoFactorEnabled) {
  //       const twoFactorConfirmation = await getTwoFactorTokenConfirmation(existingUser.id);
  //       if (!twoFactorConfirmation) return false;
  //       await prisma.twoFactorConfirmation.delete({
  //         where: {
  //           userId: existingUser.id,
  //         },
  //       });
  //     }
  //     return true;
  //   },
  // },
});
