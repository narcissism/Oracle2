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
        model: "gpt-4o-mini", // <-- make sure this is a real model on your account
        messages: [
          { role: "system", content: "You are Oracle, a mystical psychic. Speak in short, cryptic, poetic messages." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json(); 

    // Log everything to Vercel logs
    console.log("DEBUG status:", response.status);
    console.log("DEBUG headers:", Object.fromEntries(response.headers.entries()));
    console.log("DEBUG body:", data);

    // Show raw JSON back in browser for debugging
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ reply: "⚠️ RAW RESPONSE: " + JSON.stringify(data) });
    }

    const reply = data.choices[0].message?.content || data.choices[0].text || "Oracle is silent...";
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ reply: "⚠️ Server error: " + err.message });
  }
}
