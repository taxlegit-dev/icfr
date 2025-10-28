import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp, firstName, lastName } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone and OTP are required" },
        { status: 400 }
      );
    }

    // Find the OTP record
    const otpRecord = await prisma.oTP.findUnique({
      where: { phone },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "OTP not found" }, { status: 400 });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await prisma.oTP.delete({ where: { phone } });
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // Check if user exists for login or signup
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    let user;
    let message;

    if (existingUser) {
      // Login: User exists
      user = existingUser;
      message = "Login successful";
    } else {
      // Signup: Create new user
      if (!firstName || !lastName) {
        return NextResponse.json(
          { error: "First name and last name are required for signup" },
          { status: 400 }
        );
      }
      user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          phone,
        },
      });
      message = "Signup successful";
    }

    // Delete OTP after successful verification
    await prisma.oTP.delete({ where: { phone } });

    return NextResponse.json({ message, user });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
