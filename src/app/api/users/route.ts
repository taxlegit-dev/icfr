import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // your NextAuth config
import { prisma } from "@/lib/prisma"; // assuming you're using Prisma

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Optional: check role (only allow admin)
        if (session.user.role?.toLowerCase() !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch users from DB
        const users = await prisma.user.findMany({
            where: {
                role: 'USER'
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                role: true,
                emailVerified: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
