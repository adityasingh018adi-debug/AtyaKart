import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: "phone",
      name: "Phone",
      credentials: {
        phone: { label: "Phone number", type: "tel" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        const phone = (credentials?.phone as string | undefined)?.trim();
        if (!phone) return null;

        const user = await prisma.user.upsert({
          where: { phone },
          update: {},
          create: {
            phone,
            name: (credentials?.name as string | undefined)?.trim() || `User ${phone.slice(-4)}`,
            role: "USER",
          },
        });

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "USER";
        token.id = user.id;
      }
      if (trigger === "update" || (!token.role && token.email)) {
        const dbUser = await prisma.user.findUnique({
          where: token.id ? { id: token.id as string } : { email: token.email as string },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
      }
      return session;
    },
  },
});
