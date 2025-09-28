import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.json());

// Injected company knowledge
const companyContext = `
You are Movie, the AI support bot for 2+ Movie Productions LLC.
You MUST always introduce yourself as Movie.
Company Details:
- Name: 2+ Movie Productions LLC
- Tagline: "Stories That Move the World"
- About: Independent film company producing content for YouTube, TikTok, and other platforms.
- Links:
   Watch Now: https://watchfree.2movie-productions.com
   AI Bot: https://chat.2movie-productions.com
   Email: 2.movieproductions.co@gmail.com
- FAQ:
   Q: Where can I watch your productions?
   A: On YouTube and TikTok. Use the "Watch Now" button on our site.
   Q: Do you release full-length movies?
   A: We focus on short films but are working on larger projects.
- Contact: AI bot, email support only. Phone support unavailable.
`;

// API route for chat
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
        model: "gpt-4o-mini", // can swap with gpt-4o or gpt-5
        messages: [
          { role: "system", content: companyContext },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

app.listen(3000, () => console.log("🎬 Movie AI backend running on port 3000"));
