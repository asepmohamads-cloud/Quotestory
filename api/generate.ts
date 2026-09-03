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
    // Memanggil API Gemini versi terbaru / 1.5 Flash
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      const errorMsg = data.error?.message || data.error || 'Terjadi kesalahan pada Gemini API';
      return res.status(response.status || 500).json({ error: String(errorMsg) });
    }

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
