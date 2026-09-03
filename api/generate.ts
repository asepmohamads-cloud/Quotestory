import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key Gemini belum terpasang di Environment Variables Vercel.' });
  }

  try {
    const body = req.body || {};
    const category = body.category || 'Renungan Kehidupan';
    const mood = body.mood || 'Tenang & Reflektif';
    const format = body.format || 'Kutipan 2-4 Baris Puitis';
    const customTopic = body.customTopic ? ` Topik khusus: ${body.customTopic}.` : '';

    const promptText = `Kamu adalah sastrawan. Buatkan 3 variasi kutipan estetis/sastra Indonesia berdasarkan:
Kategori: ${category}
Suasana Hati: ${mood}
Format: ${format}${customTopic}

Kembalikan persis dalam format array JSON dari string, contoh: ["Kutipan satu", "Kutipan dua", "Kutipan tiga"]`;

    // Menggunakan generationConfig response_mime_type application/json
    const geminiPayload = {
      contents: [{ parts: [{ text: promptText }] }],
      generationConfig: {
        response_mime_type: "application/json"
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || data.error || 'Terjadi kesalahan pada Gemini API';
      return res.status(response.status || 500).json({ error: String(errorMsg) });
    }

    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';

    // Jika frontend menerima array JSON langsung
    try {
      const parsed = JSON.parse(rawText);
      return res.status(200).json(parsed);
    } catch {
      return res.status(200).json({ text: rawText, candidates: data.candidates });
    }

  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
