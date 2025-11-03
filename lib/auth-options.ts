import { AuthOptions, Session } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./db";
import User from "./models/user";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      try {
        await connectDB();
        const existing = await User.findOne({ email: user.email });

        if (!existing) {
          await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
            balance: 10000,
          });
        }
        return true;
      } catch (err) {
        console.error("Error in signIn callback:", err);
        return false;
      }
    },

    async session({ session }: { session: Session }) {
      try {
        await connectDB();
        const dbUser = await User.findOne({ email: session.user?.email });

        if (dbUser) {
          session.user = {
            name: dbUser.name,
            email: dbUser.email,
            image: dbUser.image,
            balance: dbUser.balance,
            _id: dbUser._id.toString(),
          };
        }
      } catch (err) {
        console.error("Session callback error:", err);
      }
      return session;
    },
  },
};
