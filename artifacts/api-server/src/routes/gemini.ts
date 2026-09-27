import { Router, type IRouter } from "express";

const router: IRouter = Router();

type ScanBody = {
  room?: string;
  homeType?: string;
  items?: string[];
  imageBase64?: string;
  mimeType?: string;
};

const fallbackScan = (room: string, homeType: string, items: string[]) => ({
  summary: `${room} is easiest to settle when the clear walking path comes first. Because this home is ${homeType.toLowerCase()}, leave room around existing pieces and unpack the items you use in the first hour before decorative pieces.`,
  zones: [
    { name: "Arrival zone", items: ["keys", "shoes", "first-night bag"], tip: "Keep this zone close to the entry and free of box traffic." },
    { name: "Daily-use zone", items: items.slice(0, 3), tip: "Unpack these first so the room becomes useful quickly." },
    { name: "Keep-clear zone", items: ["walking path"], tip: "Protect a clear route from the entry to the main seating or work area." },
  ],
  layout: [
    { label: "Entry", x: 5, y: 8, width: 23, height: 22 },
    { label: "Clear path", x: 31, y: 12, width: 42, height: 18 },
    { label: items[0] ?? "Main piece", x: 10, y: 53, width: 38, height: 28 },
    { label: "Daily use", x: 56, y: 52, width: 34, height: 29 },
  ],
  nextSteps: ["Place the first-night box near the entry.", "Keep a 30-inch walking route clear.", "Photograph the room before the remaining boxes arrive."],
});

async function askGemini(prompt: string, imageBase64?: string, mimeType = "image/jpeg") {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured.");
  const parts: { text?: string; inlineData?: { mimeType: string; data: string } }[] = [{ text: prompt }];
  if (imageBase64) parts.push({ inlineData: { mimeType, data: imageBase64 } });
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: { responseMimeType: "application/json", maxOutputTokens: 8192 },
    }),
  });
  if (!response.ok) throw new Error(`Gemini request failed with status ${response.status}.`);
  const data = (await response.json()) as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned an empty response.");
  return text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
}

router.post("/room-scan", async (req, res) => {
  const body = req.body as ScanBody;
  const room = body.room?.trim() || "Living room";
  const homeType = body.homeType?.trim() || "Semi-furnished";
  const items = Array.isArray(body.items) ? body.items.slice(0, 30) : [];
  try {
    const text = await askGemini(
      `You are MoveSmart, a practical moving assistant. Analyze a ${room} in a ${homeType} home. Inventory items: ${items.join(", ") || "none listed"}. Return ONLY valid JSON with this exact shape: {"summary":"string","zones":[{"name":"string","items":["string"],"tip":"string"}],"layout":[{"label":"string","x":number,"y":number,"width":number,"height":number}],"nextSteps":["string"]}. Layout coordinates are percentages from 0 to 100. Mention duplicate furniture risks if the home is furnished or semi-furnished. Prioritize a clear walking route and a useful first-hour unpack order.`,
      body.imageBase64,
      body.mimeType,
    );
    res.json(JSON.parse(text));
  } catch (error) {
    const fallback = fallbackScan(room, homeType, items);
    res.status(502).json({ error: error instanceof Error ? error.message : "Gemini room scan failed.", fallback });
  }
});

router.post("/chat", async (req, res) => {
  const { message, context } = req.body as { message?: string; context?: Record<string, unknown> };
  if (!message?.trim()) {
    res.status(400).json({ error: "A message is required." });
    return;
  }
  try {
    const text = await askGemini(`You are MoveSmart, a warm but concise moving assistant. Ground your answer in this move context: ${JSON.stringify(context ?? {})}. Answer the user's question with specific next actions, and call out access, duplicate furniture, box status, or move-in protection risks when relevant. User asks: ${message.trim()}`, undefined);
    const parsed = JSON.parse(text) as { reply?: string };
    res.json({ reply: parsed.reply ?? text });
  } catch (error) {
    res.status(502).json({ error: error instanceof Error ? error.message : "Gemini assistant failed." });
  }
});

export default router;