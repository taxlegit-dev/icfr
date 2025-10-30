import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Custom adapter to handle Google OAuth user creation with firstName/lastName
const customPrismaAdapter = {
  ...PrismaAdapter(prisma),
  createUser: async (data: {
    id?: string;
    email: string;
    emailVerified?: Date | null;
    name?: string | null;
    image?: string | null;
  }) => {
    // For Google OAuth, split name into firstName and lastName
    let firstName = "";
    let lastName = "";

    if (data.name) {
      const nameParts = data.name.trim().split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";
    }

    return prisma.user.create({
      data: {
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        firstName,
        lastName,
        phone: "", // Google users don't have phone, so set empty string
      },
    });
  },
};

export const authOptions: NextAuthOptions = {
  adapter: customPrismaAdapter,
  // @ts-expect-error
  trustHost: true,
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    CredentialsProvider({
      name: "otp",
      credentials: {
        phone: { label: "Phone", type: "tel" },
        otp: { label: "OTP", type: "text" },
        firstName: { label: "First Name", type: "text" },
        lastName: { label: "Last Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null;
        }

        try {
          // Verify OTP through our existing API
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/verify-otp`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                phone: credentials.phone,
                otp: credentials.otp,
                firstName: credentials.firstName,
                lastName: credentials.lastName,
              }),
            }
          );

          if (!response.ok) {
            return null;
          }

          // const data = await response.json();

          // Find or create user
          let user = await prisma.user.findUnique({
            where: { phone: credentials.phone },
          });

          if (!user) {
            // This should have been created during signup, but just in case
            user = await prisma.user.create({
              data: {
                phone: credentials.phone,
                firstName: credentials.firstName || "",
                lastName: credentials.lastName || "",
              },
            });
          }

          return {
            id: user.id.toString(),
            phone: user.phone,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      name: "admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        if (!email || !credentials?.password) {
          console.log("Missing email or password");
          return null;
        }

        try {
          console.log("Admin login attempt for email:", email);
          // Find admin user in DB
          const adminUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!adminUser) {
            console.log("User not found for email:", email);
            return null;
          }

          if (!adminUser.password) {
            console.log("User has no password for email:", email);
            return null;
          }

          // Verify password
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            adminUser.password
          );

          if (!isValidPassword) {
            console.log("Password invalid for email:", email);
            return null;
          }

          console.log("Admin login successful for email:", email);
          return {
            id: adminUser.id.toString(),
            email: adminUser.email,
            firstName: adminUser.firstName,
            lastName: adminUser.lastName,
            phone: adminUser.phone,
            role: adminUser.role,
          };
        } catch (error) {
          console.error("Admin auth error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role; // Add role to token for admin
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.phone = token.phone as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.role = token.role as string; // Add role to session for admin
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
