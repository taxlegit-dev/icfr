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
    };
  }

  interface User {
    id: string;
    phone: string;
    firstName: string;
    lastName: string;
    email?: string | null;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    phone: string;
    firstName: string;
    lastName: string;
  }
}
