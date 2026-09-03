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
    let promptText = '';

    if (body.category || body.prompt || body.customTopic) {
      const category = body.category || 'Umum';
      const mood = body.mood || 'Netral';
      const format = body.format || 'Kutipan Singkat';
      const customTopic = body.customTopic ? ` Topik khusus: ${body.customTopic}.` : '';

      promptText = `Buatkan 3 variasi kutipan estetis/sastra Indonesia. Kategori: ${category}, Suasana Hati: ${mood}, Format: ${format}.${customTopic}`;
    } else {
      promptText = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const geminiPayload = {
      contents: [
        {
          parts: [{ text: promptText }]
        }
      ]
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

    // Ambil teks mentah hasil olahan Gemini
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Kembalikan dalam beberapa opsi struktur agar kompatibel dengan frontend kamu
    return res.status(200).json({
      text: rawText,
      result: rawText,
      quotes: [rawText],
      candidates: data.candidates
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
