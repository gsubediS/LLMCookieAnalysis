import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

const prompt = `
Explain these website cookies in simple layman's terms.
Tell the user what each cookie likely does and whether it may affect privacy.
Keep the explanation clear and easy to understand.
`;

app.post("/analyze-cookies", async (req, res) => {
  const { cookies, website } = req.body;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_API_MODEL,
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: `Website: ${website}\nCookies: ${JSON.stringify(cookies)}`,
      },
    ],
  });

  res.json({
    explanation: response.choices[0].message.content,
  });
});

app.listen(3000, () => {
  console.log("Backend running at http://localhost:3000");
});