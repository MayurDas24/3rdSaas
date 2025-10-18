import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "../../../../lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  providers: [
    // ✅ Google login (optional for later)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" },
      },
    }),

    // ✅ Credentials login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) return null;

        const valid = await compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          isPremium: user.isPremium,
        };
      },
    }),
  ],

  // ✅ JWT + Session Sync
  callbacks: {
    async jwt({ token, user, account }) {
      // For Google sign-ins, ensure DB user exists
      if (account?.provider === "google" && token.email) {
        let dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: token.email,
              name: token.name ?? "",
              image: token.picture as string | undefined,
              isPremium: false,
            },
          });
        }
        token.isPremium = dbUser.isPremium;
      }

      // Credentials sign-in
      if (user) token.isPremium = (user as any).isPremium ?? false;
      return token;
    },

    async session({ session, token }) {
      (session.user as any).isPremium = token.isPremium ?? false;
      return session;
    },

    async redirect({ url, baseUrl }) {
      // 👇 Redirect logic for your flow
      const nextUrl = new URL(url, baseUrl);

      // If login/signup triggers redirect
      if (nextUrl.pathname.startsWith("/api/auth")) {
        // Check user’s premium status
        try {
          const session = await prisma.session.findFirst({
            where: { sessionToken: nextUrl.searchParams.get("token") ?? undefined },
            include: { user: true },
          });

          if (session?.user?.isPremium) {
            return `${baseUrl}/dashboard`;
          } else {
            return `${baseUrl}/checkout`;
          }
        } catch {
          return `${baseUrl}/checkout`;
        }
      }

      // Default safe redirect
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
