import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { festival } = req.body;
    
    if (!festival || !festival.MAIN_TITLE) {
      return res.status(400).json({ error: "Festival information is required" });
    }

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

    const text = response.text;
    
    return res.status(200).json({ plan: text });
  } catch (error) {
    console.error("Error generating travel plan:", error);
    return res.status(500).json({ error: "여행 계획 생성에 실패했습니다." });
  }
}
