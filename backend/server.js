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
You are explaining website cookies to a regular internet user.

Use simple, clear language. Avoid technical jargon.

First at the top format it like this
Summary:
Give a short but detailed summary of the cookies used by the page.

Overall Risk Assessment: 
Give a scale from 1-10, where 1-3 is low risk, 4-7 is moderate risk and 8-10 is high risk.
Do this based on the overall security and privacy risk of each cookie, and overall summary. 
Additionally, use the context of the website, and known information of the website as well.
Do not explain anything just give a number, with risk assessment. Also, give 1 number, not a range. 
Format is "#, Risk Level".

Format the response exactly like this for each cookie:

1. Cookie Name:

What it does:
Explain what this cookie likely does in plain English. Explain concisely but thoroughly.

Security risk:
Choose one: Low, Moderate, or High. Then give an explanation as to why.

Privacy concern:
Explain whether this cookie may track the user, identify their browser, support ads, store preferences, or collect analytics or any other applicable security concern. 

Necessary or optional:
Say whether the cookie seems necessary, optional, or unclear.

Rules:
- Do not use markdown tables.
- After the Cookie Name, in parenthesis add the full version or definition of the cookie name if applicable
- Do not use raw HTML like <br>.
- Do not include long cookie values.
- Do not overstate certainty. If unsure, say "This is an educated guess based on the cookie name and domain."
- Keep each cookie explanation short and readable but well-detailed.
- Do not use technical and legal jargon without explaining it.
- Do not wrap cookie names in underscores, asterisks, quotes, or backticks.
- Write out the full definition of a cookie abbreviation next to it in parenthesis
- In between each cookie definition separate it by --
`;

const cookieInfoPrompt = `
You are explaining what website cookies are to a regular internet user.

Use simple, clear language. Avoid technical jargon.

Format the response exactly like this:

What is a cookie?
Explain what a website cookie is in simple terms.

Why websites use cookies:
Explain the common reasons websites use cookies, such as keeping users logged in, remembering preferences, saving shopping carts, analytics, and security.

Privacy concern:
Explain how some cookies can be used to track activity, remember a browser, support advertising, or collect information about how someone uses a site.

Simple takeaway:
Explain that cookies are not always bad, but users should understand what they are accepting.

Rules:
- Do not use markdown tables.
- Do not use raw HTML like <br>.
- Keep the explanation short, clear, and readable.
- Do not use technical and legal jargon without explaining it.
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

app.post("/explain-cookie", async (req, res) => {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_API_MODEL,
    messages: [
      {
        role: "system",
        content: cookieInfoPrompt,
      },
      {
        role: "user",
        content: "Explain what a website cookie is.",
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