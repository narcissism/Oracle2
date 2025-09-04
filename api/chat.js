export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // make sure your key is correct
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // check your model name
        messages: [
          { role: "system", content: "You are Oracle, a mystical psychic. Speak in short, cryptic, poetic messages." },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await r.json();

    // Log the full response for debugging
    console.log("OpenAI response:", data);

    // Check if data.choices exists
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: "No response from AI", raw: data });
    }

    const reply = data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
}
