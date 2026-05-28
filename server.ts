import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import * as dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for travel plan
  app.post("/api/travelPlan", async (req, res) => {
    try {
      const { festival } = req.body;
      
      if (!festival || !festival.MAIN_TITLE) {
        return res.status(400).json({ error: "Festival information is required" });
      }

      const { GoogleGenAI } = await import("@google/genai");

      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `
당신은 부산 전문 여행 플래너입니다. 사용자가 다음 부산 축제에 참여하려고 합니다:
축제이름: ${festival.MAIN_TITLE}
기간: ${festival.USAGE_DAY_WEEK_AND_TIME || festival.USAGE_DAY}
장소: ${festival.MAIN_PLACE || festival.PLACE}

이 축제를 중심으로 즐길 수 있는 추천 당일치기 또는 1박 2일 여행 계획을 세워주세요.
축제의 장소 주변 관광지와 맛집을 포함해서 시간대별로 간단하게 마크다운 형식으로 작성해주세요.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
      });

      return res.status(200).json({ plan: response.text });
    } catch (error) {
      console.error("Error generating travel plan:", error);
      return res.status(500).json({ error: "여행 계획 생성에 실패했습니다." });
    }
  });

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
