import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";  // <--- ADD THIS

dotenv.config();
const app = express();

app.use(cors());          // <--- FIX: allow frontend to connect
app.use(bodyParser.json());

// Movie AI context
const companyContext = `
You are Movie, the AI support bot for 2+ Movie Productions LLC.
Always introduce yourself as Movie.
Company:
- Name: 2+ Movie Productions LLC
- Tagline: "Stories That Move the World"
- Links:
   Watch: https://watchfree.2movie-productions.com
   Chat: https://chat.2movie-productions.com
   Email: 2.movieproductions.co@gmail.com
- FAQ:
   Q: Where can I watch your productions?
   A: On YouTube and TikTok via the "Watch Now" button.
   Q: Do you release full-length movies?
   A: We focus on short films but are working on bigger projects.
- Contact: AI bot + email support. Phone not available.
`;

// Chat route
app.post("/chat", async (req, res) => {
  const { message } = req.body;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: companyContext },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices?.[0]?.message?.content || "⚠️ Movie is silent." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Movie failed to reply." });
  }
});

app.listen(3000, () => console.log("🎬 Movie AI backend running on port 3000"));
