import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ success: false, error: 'API Key Gemini belum terpasang di Environment Variables Vercel.' });
  }

  try {
    const { category = 'Renungan Kehidupan', mood = 'Tenang & Reflektif', format = 'Kutipan 2-4 Baris Puitis', customTopic = '' } = req.body || {};
    const extraTopic = customTopic ? ` Topik khusus: ${customTopic}.` : '';

    const promptText = `Kamu adalah seorang sastrawan. Buatkan 3 variasi kutipan estetis/sastra Indonesia.
Kategori: ${category}
Suasana Hati: ${mood}
Format: ${format}${extraTopic}

Kembalikan WAJIB dalam format JSON Array murni yang berisi 3 objek dengan skema berikut:
[
  {
    "headerTag": "NAMA KATEGORI SINGKAT",
    "vibeTag": "Kata Mood Singkat",
    "quoteText": "Teks kutipan estetis utama",
    "subtext": "Satu kalimat refleksi tambahan (opsional)",
    "author": "Nama Penulis atau Anonim"
  }
]`;

    // Menggunakan model aktif terbaru: gemini-2.5-flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedQuotes = JSON.parse(rawText);

    return res.status(200).json({
      success: true,
      data: parsedQuotes
    });

  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
}
