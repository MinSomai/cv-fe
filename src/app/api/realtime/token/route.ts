
const apiKey = process.env.OPENAI_API_KEY;

const sessionConfig = JSON.stringify({
  session: {
    type: "realtime",
    model: "gpt-realtime",
    audio: {
      output: {
        voice: "cedar",
      },
    },
  },
});

export async function GET() {
  const response = await fetch(
    "https://api.openai.com/v1/realtime/client_secrets",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: sessionConfig,
    },
  );


  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
