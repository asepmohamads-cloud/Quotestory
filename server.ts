import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

// Lazy Gemini AI instance with telemetry header
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper for sleeping during retries
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Robust caller with retry, backoff, and fallback models
async function generateContentWithRetry(
  ai: GoogleGenAI,
  params: {
    systemInstruction: string;
    prompt: string;
    temperature?: number;
    responseSchema?: any;
  }
) {
  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of candidateModels) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.prompt,
          config: {
            systemInstruction: params.systemInstruction,
            temperature: params.temperature ?? 0.85,
            responseMimeType: "application/json",
            responseSchema: params.responseSchema,
          },
        });
        if (response.text) {
          return { text: response.text, modelUsed: model };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = (err?.message || "").toLowerCase();
        const errCode = err?.status || err?.code || 0;
        const isTransient =
          errCode === 503 ||
          errCode === 429 ||
          errCode === "UNAVAILABLE" ||
          errCode === "RESOURCE_EXHAUSTED" ||
          errMsg.includes("high demand") ||
          errMsg.includes("spikes in demand") ||
          errMsg.includes("temporarily unavailable") ||
          errMsg.includes("overloaded");

        if (isTransient) {
          const waitTime = 600 * (attempt + 1) + Math.random() * 200;
          await sleep(waitTime);
          continue; // retry same or next model
        } else {
          // If non-transient error, break to next model
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate response after model retries");
}

// Curated fallback generator if upstream AI service is completely unavailable
function getCuratedFallbackQuotes(category?: string, mood?: string, customTopic?: string) {
  const cat = (category || "Renungan").toLowerCase();
  
  if (cat.includes("motivasi") || cat.includes("kerja") || cat.includes("sukses")) {
    return [
      {
        headerTag: "01 // FOKUS & PROSES",
        quoteText: "Bukan tentang seberapa cepat kamu sampai, tetapi tentang seberapa konsisten langkahmu bertahan melewati ragu.",
        subtext: "Setiap usaha yang sunyi sedang membangun pondasi kemenanganmu kelak.",
        author: "Catatan Bertumbuh",
        vibeTag: "Minimalist Sharp",
      },
      {
        headerTag: "REMINDER // HARI INI",
        quoteText: "Lelah adalah sinyal untuk istirahat sejenak, bukan alasan untuk menghentikan impian yang sedang kau rajut.",
        subtext: "Tarik napas panjang, hargai proses kecilmu hari ini.",
        author: "Ruang Inspirasi",
        vibeTag: "Warm Earth",
      },
      {
        headerTag: "DISIPLIN DIRI",
        quoteText: "Ketika motivasi mulai memudar, biarkan komitmen dan disiplin yang mengambil alih kemudi langkahmu.",
        subtext: "Masa depan yang indah dirajut oleh ketekunan saat ini.",
        author: "Renungan Jiwa",
        vibeTag: "Dark Stoic",
      },
    ];
  } else if (cat.includes("stoik") || cat.includes("filosofi")) {
    return [
      {
        headerTag: "01 // DIKOTOMI KENDALI",
        quoteText: "Kamu tidak bisa mengatur arah angin dan ombak lautan, tapi kamu selalu bisa mengarahkan layar kapalmu sendiri.",
        subtext: "Fokuskan energimu hanya pada hal yang berada dalam kendalimu.",
        author: "Prinsip Stoik",
        vibeTag: "Dark Stoic",
      },
      {
        headerTag: "AMOR FATI",
        quoteText: "Jangan hanya menoleransi apa yang terjadi, cintailah setiap alur takdir yang mendewasakan jiwamu.",
        subtext: "Ketenangan batin lahir saat kita berhenti melawan kenyataan.",
        author: "Marcus Aurelius Reflection",
        vibeTag: "Minimalist Zen",
      },
      {
        headerTag: "RUANG HENING",
        quoteText: "Bukan peristiwa di luar yang menyakitimu, melainkan cara pandang dan penghakimanmu atas peristiwa itu.",
        subtext: "Jaga ketenangan pikiranmu di tengah hiruk pikuk dunia.",
        author: "Epictetus Mindset",
        vibeTag: "Atmospheric",
      },
    ];
  } else if (cat.includes("cinta") || cat.includes("hubungan")) {
    return [
      {
        headerTag: "01 // TENTANG KITA",
        quoteText: "Cinta yang dewasa bukan tentang menemukan seseorang yang sempurna, melainkan saling merawat ketidaksempurnaan dengan tulus.",
        subtext: "Bersamamu, rumah bukan lagi sebuah tempat, melainkan rasa tenang.",
        author: "Sebuah Rasa",
        vibeTag: "Warm Coffee",
      },
      {
        headerTag: "CATATAN KASIH",
        quoteText: "Menemani di kala tenang itu mudah, namun bertahan mendengarkan di saat badai adalah bukti cinta yang sesungguhnya.",
        subtext: "Terima kasih telah menjadi pelabuhan paling aman untuk jiwaku.",
        author: "Ruang Hati",
        vibeTag: "Soft Vintage",
      },
      {
        headerTag: "KETULUSAN",
        quoteText: "Kita tidak perlu menjadi segalanya bagi semua orang, cukup menjadi berarti dan tulus bagi yang tepat.",
        subtext: "Cinta sejati selalu menghadirkan rasa damai, bukan cemas.",
        author: "Kisah Kita",
        vibeTag: "Pastel Glow",
      },
    ];
  } else {
    return [
      {
        headerTag: "01 // RENUNGAN HARI INI",
        quoteText: "Belajar menerima bahwa tidak semua hal harus dimengerti hari ini. Beberapa jawaban hanya bisa ditemukan lewat waktu dan keikhlasan.",
        subtext: "Biarkan hatimu beristirahat dari riuhnya praduga.",
        author: "Ruang Hening",
        vibeTag: "Moody Sunset",
      },
      {
        headerTag: "KETENANGAN JIWA",
        quoteText: "Hidup ini terlalu berharga untuk dihabiskan dengan membandingkan langkahmu dengan kecepatan orang lain.",
        subtext: "Setiap daun gugur pada waktunya, setiap bunga mekar pada musimnya.",
        author: "Catatan Senja",
        vibeTag: "Minimalist Zen",
      },
      {
        headerTag: "SYUKUR & HARAPAN",
        quoteText: "Di balik setiap hal yang belum terwujud, ada banyak hal sederhana hari ini yang patut kita syukuri dengan sepenuh hati.",
        subtext: "Tersenyumlah, kamu telah berjuang dengan sangat baik.",
        author: "Ruang Refleksi",
        vibeTag: "Warm Light",
      },
    ];
  }
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// API: Generate Quotes & Stories
app.post("/api/generate-quotes", async (req, res) => {
  const { category, mood, format, customTopic, language = "Indonesian" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    const fallbackQuotes = getCuratedFallbackQuotes(category, mood, customTopic);
    return res.json({
      success: true,
      data: fallbackQuotes,
      isFallback: true,
      notice: "Mode Kurasi Cepat Aktif",
    });
  }

  const systemInstruction = `Kamu adalah seorang kurator tulisan sastra, penulis kutipan motivasi, dan ahli renungan kehidupan yang sangat puitis, bijak, dan estetik.
Tugasmu adalah membuat 3 variasi kutipan / tulisan cerita yang menyentuh hati, indah secara tipografi, dan relevan untuk dibagikan di media sosial (Instagram Story/Feed, TikTok, Threads, Twitter).
Gunakan bahasa ${language}. Pastikan kata-katanya tidak klise, punya resonansi emosional yang mendalam, ritme kalimat yang enak dibaca, dan cocok dipasang di template grafis estetik.`;

  const userPrompt = `Buatkan 3 variasi kutipan / kata-kata bermakna:
Kategori: ${category || "Renungan Kehidupan"}
Suasana Hati (Mood): ${mood || "Tenang & Reflektif"}
Format / Gaya: ${format || "Kutipan 2-4 Baris Puitis"}
Topik / Detail Khusus: ${customTopic || "Perjalanan hidup, penerimaan diri, ketenangan, dan harapan baru"}

Berikan output dalam format JSON sesuai skema.`;

  try {
    const result = await generateContentWithRetry(ai, {
      systemInstruction,
      prompt: userPrompt,
      temperature: 0.85,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          quotes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                headerTag: {
                  type: Type.STRING,
                  description: "Judul singkat atau label kecil di atas kutipan (contoh: '01 // RENUNGAN PAGI', 'CATATAN HARI INI', 'SELALU INGAT')",
                },
                quoteText: {
                  type: Type.STRING,
                  description: "Teks kutipan utama atau cerita pendek yang puitis dan penuh arti",
                },
                subtext: {
                  type: Type.STRING,
                  description: "Penjelasan refleksi singkat atau pesan penutup 1 baris",
                },
                author: {
                  type: Type.STRING,
                  description: "Nama penulis/kreator atau atribusi (contoh: 'Catatan Hati', 'Marcus Aurelius', 'Anonim', 'Ruang Hening')",
                },
                vibeTag: {
                  type: Type.STRING,
                  description: "Karakter tema yang cocok (contoh: 'Moody Sunset', 'Minimalist Zen', 'Dark Stoic', 'Warm Coffee')",
                },
              },
              required: ["headerTag", "quoteText", "subtext", "author"],
            },
          },
        },
        required: ["quotes"],
      },
    });

    const parsed = JSON.parse(result.text || "{}");
    const quotes = parsed.quotes || [];
    if (quotes.length > 0) {
      return res.json({ success: true, data: quotes, modelUsed: result.modelUsed });
    }
    throw new Error("Empty quote array received");
  } catch (error: any) {
    console.warn("Gemini API generateContent temporarily unavailable, serving curated literary fallback:", error?.message || error);
    const fallbackQuotes = getCuratedFallbackQuotes(category, mood, customTopic);
    return res.json({
      success: true,
      data: fallbackQuotes,
      isFallback: true,
      notice: "Server AI sedang padat pengunjung. Menampilkan koleksi kurasi sastra berkualitas tinggi.",
    });
  }
});

// API: Rewrite / Enhance Quote
app.post("/api/rewrite-quote", async (req, res) => {
  const { currentText, style, language = "Indonesian" } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      success: true,
      data: {
        rewrittenText: currentText ? `"${currentText.trim()}" — Disempurnakan dengan keheningan rasa.` : "Hening adalah cara jiwa berbicara.",
        explanation: "Polesan estetis lokal.",
      },
      isFallback: true,
    });
  }

  const systemInstruction = `Kamu adalah editor sastra dan copywriter puitis yang ahli mengubah kalimat biasa menjadi karya kata-kata yang mendalam, estetis, dan menggugah jiwa.`;

  const userPrompt = `Tulis ulang / sempurnakan kutipan berikut:
Teks asli: "${currentText}"
Gaya perubahan yang diinginkan: ${style || "Buat lebih puitis, mendalam, dan memiliki rima estetis"}
Bahasa: ${language}

Kembalikan dalam format JSON dengan teks yang diperbaiki dan catatan singkat.`;

  try {
    const result = await generateContentWithRetry(ai, {
      systemInstruction,
      prompt: userPrompt,
      temperature: 0.8,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rewrittenText: {
            type: Type.STRING,
            description: "Teks kutipan hasil penulisan ulang yang telah dipercantik",
          },
          explanation: {
            type: Type.STRING,
            description: "Alasan perubahan atau nuansa yang ditekankan",
          },
        },
        required: ["rewrittenText"],
      },
    });

    const parsed = JSON.parse(result.text || "{}");
    return res.json({ success: true, data: parsed, modelUsed: result.modelUsed });
  } catch (error: any) {
    console.warn("Gemini API rewrite temporarily unavailable, using literary transformation:", error?.message || error);
    
    // Poetic fallback transformation
    const clean = (currentText || "").trim();
    const rewritten = clean.length > 0
      ? `${clean}\n\nDi balik setiap kata yang terucap, ada jiwa yang belajar menjadi lebih tabah.`
      : "Ketenangan bukan tentang ketiadaan badai, melainkan kedamaian di dalam hati.";

    return res.json({
      success: true,
      data: {
        rewrittenText: rewritten,
        explanation: "Dipoles dengan sentuhan puitis dan perenungan mendalam.",
      },
      isFallback: true,
      notice: "Server AI sedang sibuk, menerapkan gaya sastra otomatis.",
    });
  }
});

// Curated high-resolution aesthetic background fallback library
const CURATED_AI_FALLBACKS = [
  {
    vibe: "sunset",
    keywords: ["sunset", "senja", "golden", "dusk", "pantai", "langit"],
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    name: "Golden Hour Ocean Sunset",
  },
  {
    vibe: "moody",
    keywords: ["moody", "rain", "hujan", "dark", "gelap", "shadow", "bayangan", "kabut", "forest", "hutan"],
    url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
    name: "Moody Rain Drops on Window",
  },
  {
    vibe: "coffee",
    keywords: ["coffee", "kopi", "cafe", "buku", "book", "cozy", "hangat", "vintage"],
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    name: "Aesthetic Coffee & Open Book",
  },
  {
    vibe: "zen",
    keywords: ["zen", "minimal", "minimalis", "stoic", "marble", "patung", "arsitektur", "clean", "putih"],
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    name: "Minimalist Architectural Geometry",
  },
  {
    vibe: "cosmic",
    keywords: ["night", "malam", "stars", "bintang", "galaxy", "galaxy", "aurora", "bulan", "moon"],
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    name: "Starry Night Cosmic Galaxy",
  },
  {
    vibe: "nature",
    keywords: ["nature", "alam", "gunung", "mountain", "danau", "lake", "laut", "sea"],
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    name: "Majestic Foggy Mountain Peaks",
  },
];

// API: Generate AI 3D Scene Configuration
app.post("/api/generate-3d-scene", async (req, res) => {
  const { prompt } = req.body;
  const ai = getGeminiClient();

  const themesList = [
    "liquid-waves",
    "cosmic-starfield",
    "floating-gems",
    "aurora-ribbon",
    "particle-sphere",
    "cyber-grid",
    "dna-helix",
    "minimalist-torus",
    "golden-dust",
    "quantum-matrix",
    "hypercube-tesseract",
    "solar-system-orbit",
    "neon-tunnel",
    "firefly-swarm",
    "crystal-lattice"
  ];

  if (!ai) {
    const p = (prompt || "").toLowerCase();
    let theme = "liquid-waves";
    let colorPreset = "indigo-violet";
    let speed = 1.2;

    if (p.includes("kosmic") || p.includes("bintang") || p.includes("galaksi") || p.includes("space") || p.includes("astronot")) {
      theme = "cosmic-starfield";
      colorPreset = "cyber-neon";
    } else if (p.includes("kristal") || p.includes("gem") || p.includes("permata") || p.includes("berlian") || p.includes("prisma")) {
      theme = "floating-gems";
      colorPreset = "ruby-rose";
    } else if (p.includes("aurora") || p.includes("pita") || p.includes("pelangi") || p.includes("cahaya")) {
      theme = "aurora-ribbon";
      colorPreset = "pastel-dream";
    } else if (p.includes("atom") || p.includes("bola") || p.includes("sphere") || p.includes("orbit")) {
      theme = "particle-sphere";
      colorPreset = "emerald-zen";
    } else if (p.includes("cyber") || p.includes("grid") || p.includes("neon") || p.includes("synthwave") || p.includes("retro")) {
      theme = "cyber-grid";
      colorPreset = "cyber-neon";
    } else if (p.includes("dna") || p.includes("spiral") || p.includes("helix") || p.includes("biologi")) {
      theme = "dna-helix";
      colorPreset = "emerald-zen";
    } else if (p.includes("torus") || p.includes("cincin") || p.includes("kaca") || p.includes("chrome")) {
      theme = "minimalist-torus";
      colorPreset = "golden-hour";
    } else if (p.includes("emas") || p.includes("debu") || p.includes("bokeh") || p.includes("mewah")) {
      theme = "golden-dust";
      colorPreset = "golden-hour";
    } else if (p.includes("matrix") || p.includes("quantum") || p.includes("kubus") || p.includes("digital")) {
      theme = "quantum-matrix";
      colorPreset = "cyber-neon";
    } else if (p.includes("tesseract") || p.includes("hypercube") || p.includes("4d")) {
      theme = "hypercube-tesseract";
      colorPreset = "indigo-violet";
    } else if (p.includes("tata surya") || p.includes("planet") || p.includes("matahari")) {
      theme = "solar-system-orbit";
      colorPreset = "golden-hour";
    } else if (p.includes("terowongan") || p.includes("tunnel") || p.includes("hyperspace") || p.includes("kecepatan")) {
      theme = "neon-tunnel";
      colorPreset = "cyber-neon";
    } else if (p.includes("kunang") || p.includes("firefly") || p.includes("kelap-kelip")) {
      theme = "firefly-swarm";
      colorPreset = "golden-hour";
    } else if (p.includes("kisi") || p.includes("lattice") || p.includes("kristal kuantum")) {
      theme = "crystal-lattice";
      colorPreset = "emerald-zen";
    }

    return res.json({
      success: true,
      data: {
        theme,
        colorPreset,
        speed,
        interactive: true,
        description: `AI Kurasi Tema 3D: Disesuaikan dengan kata kunci "${prompt || "Estetik"}".`,
      },
      isFallback: true,
    });
  }

  const systemInstruction = `Kamu adalah ahli desainer grafis 3D dan Three.js interaktif.
Tugasmu adalah membaca deskripsi natural language dari user untuk tema background 3D, lalu memilih dari 15 animasi 3D berikut:
1. theme: harus salah satu dari ["liquid-waves", "cosmic-starfield", "floating-gems", "aurora-ribbon", "particle-sphere", "cyber-grid", "dna-helix", "minimalist-torus", "golden-dust", "quantum-matrix", "hypercube-tesseract", "solar-system-orbit", "neon-tunnel", "firefly-swarm", "crystal-lattice"]
2. colorPreset: harus salah satu dari ["indigo-violet", "golden-hour", "cyber-neon", "emerald-zen", "monochrome-dark", "pastel-dream", "ruby-rose"]
3. speed: angka antara 0.3 dan 2.2 (kecepatan animasi 3D)
4. interactive: boolean (true/false untuk respons mouse parallax)
5. description: penjelasan kreatif singkat dalam Bahasa Indonesia.`;

  const userPrompt = `Deskripsi user untuk scene 3D: "${prompt}"`;

  try {
    const result = await generateContentWithRetry(ai, {
      systemInstruction,
      prompt: userPrompt,
      temperature: 0.9,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          theme: { type: Type.STRING },
          colorPreset: { type: Type.STRING },
          speed: { type: Type.NUMBER },
          interactive: { type: Type.BOOLEAN },
          description: { type: Type.STRING },
        },
        required: ["theme", "colorPreset", "speed", "interactive", "description"],
      },
    });

    const parsed = JSON.parse(result.text || "{}");
    if (!themesList.includes(parsed.theme)) {
      parsed.theme = "liquid-waves";
    }
    return res.json({ success: true, data: parsed, modelUsed: result.modelUsed });
  } catch (err: any) {
    console.warn("AI 3D generation error, falling back:", err?.message || err);
    return res.json({
      success: true,
      data: {
        theme: "liquid-waves",
        colorPreset: "indigo-violet",
        speed: 1.0,
        interactive: true,
        description: "Dihasilkan otomatis dengan kurasi tema 3D harmonis.",
      },
      isFallback: true,
    });
  }
});

// API: Generate AI Background
app.post("/api/generate-background", async (req, res) => {
  const { prompt, vibe, aspectRatio = "9:16", style = "cinematic photorealistic" } = req.body;
  const ai = getGeminiClient();

  // Map requested aspect ratio to allowed nano-banana/imagen ratios
  let allowedRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "9:16";
  if (aspectRatio === "1:1") allowedRatio = "1:1";
  else if (aspectRatio === "4:5") allowedRatio = "3:4";
  else if (aspectRatio === "16:9") allowedRatio = "16:9";
  else if (aspectRatio === "3:2") allowedRatio = "4:3";

  const enrichedPrompt = `A stunning, high-aesthetic background wallpaper for a quote graphic: ${prompt || "Aesthetic minimalist serene background"}. Style: ${style}, ${vibe ? `mood: ${vibe},` : ""} warm atmospheric cinematic lighting, soft depth of field, high resolution, peaceful, no distracting text, clean composition with ample negative space for text overlay.`;

  if (!ai) {
    // Find closest curated fallback
    const matched = CURATED_AI_FALLBACKS.find(f => 
      (prompt || "").toLowerCase().includes(f.vibe) || (vibe || "").toLowerCase().includes(f.vibe)
    ) || CURATED_AI_FALLBACKS[0];
    return res.json({
      success: true,
      imageUrl: matched.url,
      prompt: enrichedPrompt,
      isFallback: true,
      notice: "Mode Kurasi Visual Aktif",
    });
  }

  const imageModels = ["gemini-3.1-flash-image", "gemini-2.5-flash-image"];
  let lastErr: any = null;

  for (const model of imageModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              text: enrichedPrompt,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: allowedRatio,
          },
        },
      });

      const candidates = response.candidates || [];
      for (const candidate of candidates) {
        const parts = candidate.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
            return res.json({
              success: true,
              imageUrl,
              modelUsed: model,
              prompt: enrichedPrompt,
            });
          }
        }
      }
    } catch (err: any) {
      lastErr = err;
      console.warn(`Model ${model} image generation attempt error:`, err?.message || err);
    }
  }

  // If models unavailable, serve an aesthetic curated photo match with high quality
  const pLower = (prompt || "").toLowerCase() + " " + (vibe || "").toLowerCase();
  const matched = CURATED_AI_FALLBACKS.find(f => 
    f.keywords.some(k => pLower.includes(k))
  ) || CURATED_AI_FALLBACKS[Math.floor(Math.random() * CURATED_AI_FALLBACKS.length)];

  return res.json({
    success: true,
    imageUrl: matched.url,
    prompt: enrichedPrompt,
    isFallback: true,
    notice: "Server visual AI sedang padat pengunjung. Menampilkan latar estetik alternatif berkualitas tinggi.",
  });
});

// Curated Anime & Cartoon Sticker Fallbacks
const CURATED_ANIME_FALLBACKS = [
  {
    keywords: ["doraemon", "robot", "kucing biru", "buku"],
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
    name: "Doraemon Ceria",
  },
  {
    keywords: ["pikachu", "pokemon", "listrik", "kuning"],
    url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80",
    name: "Pikachu Elektrik",
  },
  {
    keywords: ["goku", "dragon", "ball", "super", "saiyan", "chibi", "api"],
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80",
    name: "Goku Super Chibi",
  },
  {
    keywords: ["astronaut", "ruang", "angkasa", "bintang", "roket"],
    url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=600&q=80",
    name: "Astronaut Chibi Bintang",
  },
  {
    keywords: ["neko", "kucing", "anime", "kawaii", "gadis"],
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
    name: "Kucing Neko Kawaii",
  },
];

// API: Generate AI Image / Character Sticker using Pollinations AI & Curated Fallbacks
app.post("/api/generate-image", async (req, res) => {
  const { prompt } = req.body;
  const userPrompt = prompt || "Cute anime mascot character";
  const enrichedPrompt = `clean flat vector character design, solid white background, sticker design, clean edge cutout, no background, no circular frames, no container, simple high quality illustration, ${userPrompt}`;

  try {
    // Generate dynamic AI image URL using Pollinations AI (free, unlimited, instant custom AI image generation)
    const encodedPrompt = encodeURIComponent(enrichedPrompt);
    const aiImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true&seed=${Math.floor(Math.random() * 1000000)}`;

    return res.json({
      success: true,
      imageUrl: aiImageUrl,
      prompt: enrichedPrompt,
      characterName: userPrompt,
      isAiGenerated: true,
    });
  } catch (err: any) {
    const pLower = userPrompt.toLowerCase();
    const matched = CURATED_ANIME_FALLBACKS.find(f => f.keywords.some(k => pLower.includes(k))) || CURATED_ANIME_FALLBACKS[0];
    return res.json({
      success: true,
      imageUrl: matched.url,
      prompt: enrichedPrompt,
      characterName: userPrompt,
      isFallback: true,
    });
  }
});

// Setup Vite development middleware or production static serving
async function startServer() {
  const PORT = process.env.PORT || 3000;
  
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`QuoteStory Studio server running on http://localhost:${PORT}`);
  });
}

startServer();
