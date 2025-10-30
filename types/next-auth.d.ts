import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone: string;
      firstName: string;
      lastName: string;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    image?: string | null;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    phone: string;
    firstName: string;
    lastName: string;
    role?: string;
  }
}
