import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(
      "https://api.openai.com/v1/realtime/sessions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "cedar",
          modalities: ["text", "audio"],
          instructions: `You are an AI interviewer. Greet the candidate warmly and ask them to introduce themselves. 

Important behavioral rules:
- If the candidate pauses briefly while thinking, wait silently without interrupting
- If they say "umm", "let me think", or pause longer, you may briefly acknowledge: "Take your time"
- Only ask follow-up questions after they've clearly finished their complete thought
- Never interrupt mid-sentence or during natural thinking pauses
- Be professional, thoughtful, and assess responses carefully`,
          input_audio_transcription: {
            model: "whisper-1",
          },
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
