import express from 'express';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // serve static files e.g: css

// POST /chat
app.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({
      message: "prompt harus diisi dan berupa string!",
      data: null,
      success: false,
    });
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // console.log(aiResponse)

    const output = aiResponse?.candidates?.[0]?.content?.parts?.[0]?.text; // <<-- safest way

    res.status(200).json({
      success: true,
      data: output,
      message: "Berhasil ditanggapi oleh Google Gemini Flash!",
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      success: false,
      data: null,
      message: e.message || "Ada masalah di server nih!",
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(3000, () => {
  console.log("I LOVE YOU 3000");
});
