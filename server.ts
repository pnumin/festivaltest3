import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route for festivals
  app.get("/api/festivals", async (req, res) => {
    try {
      const apiKey = process.env.BUSAN_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "API key is missing in environment variables" });
      }

      // Default to page 1, 100 rows
      const { pageNo = 1, numOfRows = 100 } = req.query;
      const url = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&resultType=json`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching Busan festival data:", error);
      res.status(500).json({ error: "Failed to fetch festival data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // Since Express v4 is used here based on package.json
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
