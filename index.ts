import express from "express";
import path from "path";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.resolve();

// ✅ Allow Express to parse JSON in POST requests
app.use(express.json());

// Serve static frontend files (Vite build)
app.use(express.static(path.join(__dirname, "../client")));

// ✅ API route
app.post("/api/chat", async (req, res) => {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "Missing 'message' field" });
  }

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || "No reply";
    res.json({ reply });
  } catch (error: any) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to connect to OpenRouter" });
  }
});

// ✅ Handle frontend (Vite) routes
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client")));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/app.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.redirect("http://localhost:5173"); // Vite dev server
  });
}

app.listen(PORT, () => {
  console.log(`[server] running on http://localhost:${PORT}`);
});

