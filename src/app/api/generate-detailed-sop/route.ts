export const runtime = "nodejs";
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
    const { process: businessProcess, subprocess } = body;

    if (
      !businessProcess ||
      !subprocess ||
      typeof businessProcess !== "string" ||
      typeof subprocess !== "string"
    ) {
      return NextResponse.json(
        { error: "Process and subprocess are required" },
        { status: 400 }
      );
    }

    const prompt = `You are a compliance SOP generator.
Respond ONLY in JSON with fields: process, subprocess, tasks[].
Each task has task, steps[]. Each step has step_no, action, risk, mitigation.
Always return exactly 4–5 tasks per subprocess and 3–4 steps per task.
No prose, no explanations, no extra keys.

Process: ${businessProcess}
Subprocess: ${subprocess}`;

    console.log("Prompt sent to OpenAI for detailed SOP:", prompt);

    // Call OpenAI API
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const modelId =
      process.env.MODEL_ID || "ft:gpt-4o-mini-2024-07-18:taxlegit:sop:CCIXALNO";

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
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate detailed SOP" },
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

    // Validate structure
    if (
      !parsedResponse.process ||
      !parsedResponse.subprocess ||
      !Array.isArray(parsedResponse.tasks)
    ) {
      return NextResponse.json(
        { error: "Invalid SOP format" },
        { status: 500 }
      );
    }

    return NextResponse.json(parsedResponse);
  } catch (error) {
    console.error("Error generating detailed SOP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
