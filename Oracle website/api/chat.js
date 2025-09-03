export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        { role: "system", content: "You are Oracle, a mystical, poetic psychic. Give short, enigmatic readings for entertainment only." },
        { role: "user", content: message }
      ]
    })
  });

  const data = await r.json();
  res.status(200).json({ reply: data.choices[0].message.content });
}
