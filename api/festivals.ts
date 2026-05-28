export default async function handler(req: any, res: any) {
  try {
    const apiKey = process.env.BUSAN_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API key is missing in environment variables" });
    }

    const { pageNo = 1, numOfRows = 100 } = req.query;
    const url = `https://apis.data.go.kr/6260000/FestivalService/getFestivalKr?serviceKey=${apiKey}&pageNo=${pageNo}&numOfRows=${numOfRows}&resultType=json`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Busan festival data:", error);
    return res.status(500).json({ error: "Failed to fetch festival data" });
  }
}
