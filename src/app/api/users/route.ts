import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Optional: protect route
    const session = await getServerSession(authOptions);
    console.log(session);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    console.log(users);

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
