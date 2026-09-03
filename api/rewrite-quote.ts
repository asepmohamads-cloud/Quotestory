import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'API Key Gemini belum terpasang di Vercel.' });
  }

  try {
    const { currentText = '', style = '' } = req.body || {};

    if (!currentText.trim()) {
      return res.status(400).json({ success: false, error: 'Teks tidak boleh kosong' });
    }

    const promptText = `Tulis ulang dan poles teks kutipan berikut agar lebih menarik secara sastra.
Teks asli: "${currentText}"
Gaya/Arah polesan: ${style}

Kembalikan WAJIB dalam format JSON murni dengan skema:
{
  "rewrittenText": "Teks hasil polesan yang indah",
  "explanation": "Catatan singkat perubahan gaya"
}`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || data.error || 'Terjadi kesalahan pada Gemini API';
      return res.status(response.status || 500).json({ success: false, error: String(errorMsg) });
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedResult = JSON.parse(rawText);

    return res.status(200).json({
      success: true,
      data: parsedResult
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}
