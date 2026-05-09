import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" }),
    CredentialsProvider({
      name: "Email or phone",
      credentials: { identifier: { label: "Email or phone", type: "text" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) return null;
        await connectDB();
        const identifier = credentials.identifier.toLowerCase();
        const user = await User.findOne({ $or: [{ email: identifier }, { phone: credentials.identifier }] }).select("+password");
        if (!user?.password || user.isRestricted) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image, role: user.role, phone: user.phone, isRestricted: user.isRestricted };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "google" || !user.email) return true;
      await connectDB();
      const existingUser = await User.findOne({ email: user.email.toLowerCase() });
      if (existingUser?.isRestricted) return false;
      if (!existingUser) await User.create({ name: user.name || "Google user", email: user.email, image: user.image });
      return true;
    },
    async jwt({ token }) {
      if (token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() });
        if (dbUser) { token.id = dbUser._id.toString(); token.role = dbUser.role; token.phone = dbUser.phone; token.isRestricted = dbUser.isRestricted; token.picture = dbUser.image || token.picture; }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) { session.user.id = token.id; session.user.role = token.role || "customer"; session.user.phone = token.phone; session.user.isRestricted = token.isRestricted; }
      return session;
    },
  },
};
