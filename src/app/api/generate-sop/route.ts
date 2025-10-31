import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { answers } = body;

    if (!answers || typeof answers !== "object") {
      return NextResponse.json(
        { error: "Answers are required" },
        { status: 400 }
      );
    }

    // Fetch questions to map answers
    const questions = await prisma.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    // Construct company details from questions and answers
    let companyDetails = "";
    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== null && answer !== undefined && answer !== "") {
        companyDetails += `${question.questionText}: ${answer}\n`;
      }
    });

    const prompt = `You are a business process expert trained to identify core operational processes for organizations.

Based on the details provided below, suggest relevant business processes that should have defined SOPs or internal controls.

Return your answer in this JSON format only:
{
  "processes": ["Process 1", "Process 2", "Process 3", ...]
}

Company details:

${companyDetails}

Example:
If Industry = Manufacturing → return processes like Recruitment, Training, Production, Quality, Finance, Sales, HR.`;

    console.log("Prompt sent to OpenAI:", prompt);

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const modelId =
      process.env.MODEL_ID ||
      "ft:gpt-4.1-mini-2025-04-14:taxlegit:sop:CCIXALNO";

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate processes" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      return NextResponse.json(
        { error: "No response from AI" },
        { status: 500 }
      );
    }

    // Parse the JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }

    if (!parsedResponse.processes || !Array.isArray(parsedResponse.processes)) {
      return NextResponse.json(
        { error: "Invalid processes format" },
        { status: 500 }
      );
    }

    return NextResponse.json({ processes: parsedResponse.processes });
  } catch (error) {
    console.error("Error generating SOP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
