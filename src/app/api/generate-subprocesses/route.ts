export const runtime = "nodejs";
import "dotenv/config";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { process: processName } = body;

    if (!processName || typeof processName !== "string") {
      return NextResponse.json(
        { error: "Process name is required" },
        { status: 400 }
      );
    }

    const prompt = `You are a business process expert trained to identify subprocesses for business operations.

For the business process "${processName}", suggest relevant subprocesses that should have defined SOPs or internal controls.

Return your answer in this JSON format only:
{
  "process": "${processName}",
  "subprocesses": ["Subprocess 1", "Subprocess 2", "Subprocess 3", ...]
}

Example:
If Process = Recruitment → return subprocesses like Job Posting, Screening, Interviewing, Offer, Onboarding.
If Process = Production → return subprocesses like Raw Material Procurement, Manufacturing, Quality Control, Packaging, Shipping.`;

    console.log("Prompt sent to OpenAI for subprocesses:", prompt);

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
        { error: "Failed to generate subprocesses" },
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
    } catch {
      console.error("Failed to parse AI response:", aiResponse);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }

    if (
      !parsedResponse.subprocesses ||
      !Array.isArray(parsedResponse.subprocesses)
    ) {
      return NextResponse.json(
        { error: "Invalid subprocesses format" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      process: parsedResponse.process || processName,
      subprocesses: parsedResponse.subprocesses,
    });
  } catch (error) {
    console.error("Error generating subprocesses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
