import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

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
          };
        } catch (error) {
          console.error("Auth error:", error);
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
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.phone = token.phone as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
