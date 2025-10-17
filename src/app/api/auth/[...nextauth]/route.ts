import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../../../lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // After Google login we want to checkout
      authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" } },
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;
        const ok = await compare(credentials.password, user.password);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, image: user.image, isPremium: user.isPremium };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Ensure DB user exists for Google sign-in
      if (account?.provider === "google" && token.email) {
        let dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: { email: token.email, name: token.name ?? "", isPremium: false, image: token.picture as string | undefined },
          });
        }
        token.isPremium = dbUser.isPremium;
      }
      if (user) {
        token.isPremium = (user as any).isPremium ?? token.isPremium ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      (session.user as any).isPremium = token.isPremium ?? false;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If coming from Google, go to /checkout by default
      const u = new URL(url, baseUrl);
      if (u.pathname.startsWith("/api/auth") || u.pathname === "/") return `${baseUrl}/checkout`;
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
