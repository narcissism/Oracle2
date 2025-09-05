export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userMessage = req.body.message || "";

  const systemPrompt = `
You are Oracle, speaking in the style of Neville Goddard and his students.
Use short, cryptic, poetic sentences. 
Draw vocabulary from Neville’s world: imagination, assumption, wish fulfilled, Barbados, SATS (state akin to sleep), living in the end, feeling it real.
Never promise outcomes. 
Never explain at length. 
Every message should feel like a mystical aphorism.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // lightweight, fast, cheap
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ reply: "Oracle is silent…" });
    }

    const reply =
      data.choices[0].message?.content ||
      data.choices[0].text ||
      "Oracle is silent…";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "⚠️ Server error: " + err.message });
  }
}
