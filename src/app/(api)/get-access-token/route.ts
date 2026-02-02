const HEYGEN_API_KEY = process.env.HEYGEN_API_KEY;

export async function POST(req: Request) {
  try {
    if (!HEYGEN_API_KEY) {
      throw new Error("API key is missing from .env");
    }

    const {
      avatarId,
      voiceId,
      quality,
      knowledgeBase,
      language,
      disableIdleTimeout,
    } = await req.json();

    const res = await fetch(
      // "https://api.heygen.com/v1/streaming.create_token",
      "https://api.liveavatar.com/v1/sessions/token",
      {
        method: "POST",
        headers: {
          "X-API-KEY": HEYGEN_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "FULL",
          avatar_id: avatarId,
          avatar_persona: {
            voice_id: voiceId,
            // context_id: knowledgeBase,
            // Use Demo Context ID which is known to work
            context_id: "5b9dba8a-aa31-11f0-a6ee-066a7fa2e369",
            language: language || "en",
          },
        }),
      }
    );
    try {
      const data = await res.json();

      console.log({ data });

      if (data.error) {
        console.error("LiveAvatar API Error:", data.error);
        return new Response(JSON.stringify(data), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Match Demo: Return JSON object with session_token
      return new Response(
        JSON.stringify({
          session_token: data.data.session_token,
          session_id: data.data.session_id,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.log("Heygen error: ", error);
      console.log(res.body);
    }
  } catch (error) {
    console.error("Error retrieving access token:", error);

    return new Response("Failed to retrieve access token", {
      status: 500,
    });
  }
}
