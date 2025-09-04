export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are Oracle, a mystical psychic. Speak in short, cryptic, poetic messages." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenAI response:", data); // Keep this to debug

    // ✅ Check for proper structure
    const reply =
      data?.choices?.[0]?.message?.content ||
      data?.choices?.[0]?.text || // fallback for older endpoints
      "Oracle is silent...";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}

