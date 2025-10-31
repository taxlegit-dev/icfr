import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { questionText, inputType, options, isRequired } = body;

    // Validation
    if (
      !questionText ||
      typeof questionText !== "string" ||
      questionText.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Question text is required and must be a non-empty string" },
        { status: 400 }
      );
    }

    const validInputTypes = [
      "text",
      "number",
      "file",
      "dropdown",
      "radio",
      "checkbox",
    ];
    if (!inputType || !validInputTypes.includes(inputType)) {
      return NextResponse.json(
        { error: "Invalid input type" },
        { status: 400 }
      );
    }

    // Check if options are required and provided
    const requiresOptions = ["dropdown", "radio", "checkbox"].includes(
      inputType
    );
    if (requiresOptions) {
      if (!options || !Array.isArray(options) || options.length === 0) {
        return NextResponse.json(
          {
            error:
              "Options are required for dropdown, radio, and checkbox types",
          },
          { status: 400 }
        );
      }
      // Validate each option is a non-empty string
      if (
        options.some(
          (opt) => typeof opt !== "string" || opt.trim().length === 0
        )
      ) {
        return NextResponse.json(
          { error: "All options must be non-empty strings" },
          { status: 400 }
        );
      }
    }

    if (typeof isRequired !== "boolean") {
      return NextResponse.json(
        { error: "isRequired must be a boolean" },
        { status: 400 }
      );
    }

    // Create the question in database
    const question = await prisma.question.create({
      data: {
        questionText: questionText.trim(),
        inputType,
        options: requiresOptions ? options : null,
        isRequired,
      },
    });

    return NextResponse.json(
      {
        message: "Question created successfully",
        question,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all questions
    const questions = await prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Question ID is required" },
        { status: 400 }
      );
    }

    // Check if question exists
    const question = await prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    // Delete the question
    await prisma.question.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Question deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
