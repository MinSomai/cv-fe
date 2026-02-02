import { TranscriptionMessage } from "@/app/[locale]/(main)/(withoutNavbar)/interview/[id]/Interview";
import { endInterview } from "@/services/backend/interview.service";

export async function POST(request: Request,
  { params }: { params: Promise<{ interviewId: string }> }
) {
  try {
    const body = await request.json();
    const { status, transcription, interviewDuration } = body;
    const param = await params

    await endInterview(param.interviewId, {
      status: status,
      transcription: transcription,
      interviewDuration
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: "Success",
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
