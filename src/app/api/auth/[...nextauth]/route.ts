import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { AuthOptions } from "next-auth";

// Extend NextAuth types to include 'id' on session user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 1. Validate that credentials and email/password exist
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter an email and password");
        }

        // 2. Connect to the database
        await dbConnect();

        // 3. Find the user in the database by their email
        const user = await User.findOne({ email: credentials.email });

        // If no user is found, authentication fails
        if (!user) {
          throw new Error("No user found with this email");
        }

        // 4. Compare the provided password with the stored hashed password
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        // If passwords don't match, authentication fails
        if (!isPasswordCorrect) {
          throw new Error("Incorrect password");
        }

        // 5. If everything is correct, return the user object
        // This object will be encoded in the JWT.
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login", // Our custom login page
    error: "/login", // Redirect to login page on error
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // This callback is called whenever a JWT is created or updated.
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // This callback is called whenever a session is checked.
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
