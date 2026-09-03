import React, { useState } from "react";
import { BackgroundConfig, BackgroundCategory, ThreeDThemeType } from "../types";
import {
  CURATED_PHOTOS,
  GRADIENT_PRESETS,
  TEXTURE_PAPERS,
} from "../data/curatedBackgrounds";
import {
  Image as ImageIcon,
  Sliders,
  Upload,
  Sparkles,
  Layers,
  Eye,
  Check,
  Wand2,
  Loader2,
  RefreshCw,
  Compass,
  Box,
  Activity,
  Zap,
  Flame,
} from "lucide-react";

interface BackgroundControlsProps {
  background: BackgroundConfig;
  onChangeBackground: (updated: Partial<BackgroundConfig>) => void;
}

const THREE_D_THEMES: {
  id: ThreeDThemeType;
  name: string;
  desc: string;
  emoji: string;
  iconBg: string;
}[] = [
  {
    id: "liquid-waves",
    name: "Gelombang Liquid 3D",
    desc: "Jaring 3D undulasi dinamis dengan butiran partikel halus",
    emoji: "🌊",
    iconBg: "from-blue-500 to-indigo-600",
  },
  {
    id: "cosmic-starfield",
    name: "Galaksi Kosmik & Bintang",
    desc: "Warp 3D jutaan bintang dan nebula berputar di kedalaman angkasa",
    emoji: "🌌",
    iconBg: "from-indigo-600 to-purple-800",
  },
  {
    id: "floating-gems",
    name: "Kristal Geometris 3D",
    desc: "Prisma & polihedron melayang berputar dengan refleksi cahaya",
    emoji: "💎",
    iconBg: "from-cyan-500 to-blue-600",
  },
  {
    id: "aurora-ribbon",
    name: "Pita Aurora Holistik",
    desc: "Gelombang pita 3D berayun mengalir anggun dalam ruang estetik",
    emoji: "🌈",
    iconBg: "from-fuchsia-500 to-violet-600",
  },
  {
    id: "particle-sphere",
    name: "Orb Nebula Atom",
    desc: "Bola partikel berdenyut dengan cincin orbital kosmik",
    emoji: "⚛️",
    iconBg: "from-violet-500 to-pink-600",
  },
  {
    id: "cyber-grid",
    name: "Retro Synthwave Grid",
    desc: "Grid cakrawala 3D bergerak tak terbatas dengan matahari neon",
    emoji: "🕹️",
    iconBg: "from-cyan-500 to-fuchsia-600",
  },
  {
    id: "dna-helix",
    name: "Pusaran Helix Partikel",
    desc: "Struktur spiral ganda bioluminesens meliuk halus",
    emoji: "🧬",
    iconBg: "from-emerald-500 to-teal-600",
  },
  {
    id: "minimalist-torus",
    name: "Torus Kaca & Chrome",
    desc: "Cincin torus 3D saling mengunci berputar tenang dan elegan",
    emoji: "🪐",
    iconBg: "from-zinc-500 to-zinc-700",
  },
  {
    id: "golden-dust",
    name: "Debu Emas Melayang",
    desc: "Partikel bokeh emas hangat melayang lembut ke atas",
    emoji: "✨",
    iconBg: "from-amber-500 to-orange-600",
  },
  {
    id: "quantum-matrix",
    name: "Quantum Matrix 3D",
    desc: "Kubus neon di tengah medan titik kuantum berputar dinamis",
    emoji: "💠",
    iconBg: "from-blue-600 to-cyan-500",
  },
  {
    id: "hypercube-tesseract",
    name: "Hypercube Tesseract",
    desc: "Struktur tesseract 4D kerangka kawat berputar menakjubkan",
    emoji: "🧊",
    iconBg: "from-purple-600 to-indigo-500",
  },
  {
    id: "solar-system-orbit",
    name: "Orbit Tata Surya",
    desc: "Planet mengelilingi pusat bintang dengan rotasi orbital mulus",
    emoji: "🪐",
    iconBg: "from-amber-600 to-red-500",
  },
  {
    id: "neon-tunnel",
    name: "Terowongan Neon Hyperspace",
    desc: "Cincin cahaya neon tanpa batas melesat ke dimensi lain",
    emoji: "🌀",
    iconBg: "from-pink-600 to-rose-500",
  },
  {
    id: "firefly-swarm",
    name: "Gerombolan Kunang-Kunang",
    desc: "Ratusan titik cahaya hangat berkedip lembut dalam ruang malam",
    emoji: "💫",
    iconBg: "from-yellow-500 to-amber-600",
  },
  {
    id: "crystal-lattice",
    name: "Kisi Kristal Kuantum",
    desc: "Array struktur kisi kristal metalik merefleksikan cahaya",
    emoji: "🔮",
    iconBg: "from-emerald-600 to-teal-500",
  },
  {
    id: "rain-effect",
    name: "Hujan 3D",
    desc: "Efek butiran hujan 3D jatuh dengan efek kedalaman",
    emoji: "🌧️",
    iconBg: "from-gray-500 to-zinc-700",
  },
  {
    id: "snow-fall",
    name: "Salju 3D",
    desc: "Efek butiran salju turun",
    emoji: "❄️",
    iconBg: "from-blue-200 to-white",
  },
  {
    id: "floating-bubbles",
    name: "Gelembung",
    desc: "Gelembung melayang",
    emoji: "🫧",
    iconBg: "from-blue-400 to-blue-600",
  },
  {
    id: "star-field",
    name: "Galaksi",
    desc: "Bidang bintang luar angkasa",
    emoji: "✨",
    iconBg: "from-zinc-800 to-zinc-950",
  },
];

const THREE_D_COLOR_PALETTES = [
  { id: "indigo-violet", label: "Indigo & Violet", color: "#6366f1", sub: "#a855f7" },
  { id: "golden-hour", label: "Golden Sunset", color: "#f59e0b", sub: "#f43f5e" },
  { id: "cyber-neon", label: "Cyberpunk Neon", color: "#06b6d4", sub: "#ec4899" },
  { id: "emerald-zen", label: "Emerald Zen", color: "#10b981", sub: "#059669" },
  { id: "monochrome-dark", label: "Dark Obsidian", color: "#e4e4e7", sub: "#71717a" },
  { id: "pastel-dream", label: "Pastel Dream", color: "#f472b6", sub: "#c084fc" },
  { id: "ruby-rose", label: "Ruby Crimson", color: "#e11d48", sub: "#fb7185" },
];

const AI_PROMPT_PRESETS = [
  {
    label: "🌅 Senja Estetis & Ombak",
    prompt: "Aesthetic golden hour sunset over calm ocean waves with soft warm orange and violet horizon, minimalist cinematic photography, ample negative space",
    vibe: "sunset",
  },
  {
    label: "☕ Kafe Hujan & Buku",
    prompt: "Cozy warm aesthetic coffee shop window with raindrops outside, warm ambient lighting, blurred vintage books, quiet peaceful reflection",
    vibe: "coffee",
  },
  {
    label: "🏛️ Patung Stoik & Marmer",
    prompt: "Minimalist dark aesthetic Greek marble bust sculpture in dramatic moody lighting, shadow play, stoic philosophical atmosphere",
    vibe: "stoic",
  },
  {
    label: "🌌 Galaksi & Bintang Malam",
    prompt: "Starry cosmic night sky full of stars and soft purple milky way galaxy over a silhouette mountain lake, deep peaceful silence",
    vibe: "cosmic",
  },
  {
    label: "🌿 Zen Bambu & Kabut",
    prompt: "Serene Japanese zen garden with bamboo trees and soft morning fog, lush green natural harmony, minimalist calm atmosphere",
    vibe: "nature",
  },
  {
    label: "🏙️ Urban Moody & Lampu Kota",
    prompt: "Moody atmospheric night city street with soft bokeh rain reflections on asphalt, deep cinematic tones, lonely contemplation",
    vibe: "moody",
  },
  {
    label: "🏜️ Gurun Pasir Senja",
    prompt: "Minimalist smooth curved sand dunes at twilight with dramatic pastel sky gradient, clean lines and vast quiet space",
    vibe: "sunset",
  },
  {
    label: "✨ Gradasi 3D Liquid Aura",
    prompt: "Dreamy abstract 3D flowing liquid silk waves with holographic iridescent pastel gradients, ethereal glow and modern aesthetic",
    vibe: "abstract",
  },
];

const AI_STYLES = [
  { id: "cinematic photorealistic", label: "Sinematik & Realistik" },
  { id: "minimalist serene pastel", label: "Minimalis & Pastel" },
  { id: "moody 35mm film vintage", label: "Vintage 35mm Film" },
  { id: "dark dramatic editorial", label: "Dark Moody Editorial" },
  { id: "anime ghibli aesthetic", label: "Anime Ghibli Vibe" },
  { id: "oil painting classic", label: "Lukisan Sastra Klasik" },
];

const ANIME_CHARACTER_PRESETS = [
  {
    id: "doraemon",
    name: "Doraemon Ceria",
    desc: "Robot kucing biru tersenyum dengan lonceng ikonik",
    emoji: "🐱",
    url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "pikachu",
    name: "Pikachu Elektrik",
    desc: "Mascot kuning lucu dengan pipi bercahaya",
    emoji: "⚡",
    url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "goku-chibi",
    name: "Goku Super Chibi",
    desc: "Karakter pahlawan anime rambut runcing dengan aura",
    emoji: "🔥",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "astronaut",
    name: "Astronaut Chibi Bintang",
    desc: "Penjelajah ruang angkasa kecil menggemaskan",
    emoji: "🚀",
    url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "neko-cat",
    name: "Kucing Neko Kawaii",
    desc: "Gadis kucing anime imut dengan telinga lembut",
    emoji: "🌸",
    url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
  },
];

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  background,
  onChangeBackground,
}) => {
  const [activeTab, setActiveTab] = useState<BackgroundCategory | "ai-generator">(
    background.type === "ai-generated"
      ? "ai-generator"
      : background.type === "3d-animated"
      ? "3d-animated"
      : background.type || "curated-photo"
  );
  const [photoFilter, setPhotoFilter] = useState<string>("all");

  // AI Background Generation State
  const [aiPrompt, setAiPrompt] = useState<string>(
    background.aiPrompt || "Aesthetic minimalist sunset sky over serene horizon with soft cinematic lighting"
  );
  const [aiStyle, setAiStyle] = useState<string>("cinematic photorealistic");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiNotice, setAiNotice] = useState<string | null>(null);
  const [generatedGallery, setGeneratedGallery] = useState<
    { url: string; prompt: string; timestamp: number }[]
  >([]);

  // 3D AI Generator State
  const [threeAiPrompt, setThreeAiPrompt] = useState<string>("");
  const [isGenerating3D, setIsGenerating3D] = useState<boolean>(false);
  const [threeAiNotice, setThreeAiNotice] = useState<string | null>(null);
  const [threeAiError, setThreeAiError] = useState<string | null>(null);

  const handleGenerate3DWithAI = async () => {
    if (!threeAiPrompt.trim()) return;
    setIsGenerating3D(true);
    setThreeAiError(null);
    setThreeAiNotice(null);

    try {
      const res = await fetch("/api/generate-3d-scene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: threeAiPrompt }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.data) {
        throw new Error(data.error || "Gagal menghasilkan scene 3D dengan AI.");
      }

      const cfg = data.data;
      onChangeBackground({
        type: "3d-animated",
        threeDTheme: cfg.theme || "liquid-waves",
        threeDColorPreset: cfg.colorPreset || "indigo-violet",
        threeDSpeed: cfg.speed ?? 1.0,
        threeDInteractive: cfg.interactive ?? true,
      });

      if (cfg.description) {
        setThreeAiNotice(cfg.description);
      }
    } catch (err: any) {
      console.error(err);
      setThreeAiError(err.message || "Gagal membuat scene 3D dengan AI.");
    } finally {
      setIsGenerating3D(false);
    }
  };

  // Anime Character Generator State
  const [characterAiPrompt, setCharacterAiPrompt] = useState<string>("");
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState<boolean>(false);
  const [characterAiError, setCharacterAiError] = useState<string | null>(null);

  const handleGenerateCharacterWithAI = async () => {
    if (!characterAiPrompt.trim()) return;
    setIsGeneratingCharacter(true);
    setCharacterAiError(null);

    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Cute anime character chibi style, ${characterAiPrompt}, high quality vector sticker art` }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        onChangeBackground({
          characterEnabled: true,
          characterType: "custom",
          characterUrl: data.imageUrl,
          characterName: characterAiPrompt,
          characterAnimation: "bounce",
        });
      } else {
        const fallback = ANIME_CHARACTER_PRESETS[Math.floor(Math.random() * ANIME_CHARACTER_PRESETS.length)];
        onChangeBackground({
          characterEnabled: true,
          characterType: fallback.id,
          characterUrl: fallback.url,
          characterName: characterAiPrompt || fallback.name,
          characterAnimation: "bounce",
        });
      }
    } catch (err: any) {
      const fallback = ANIME_CHARACTER_PRESETS[Math.floor(Math.random() * ANIME_CHARACTER_PRESETS.length)];
      onChangeBackground({
        characterEnabled: true,
        characterType: fallback.id,
        characterUrl: fallback.url,
        characterName: characterAiPrompt || fallback.name,
        characterAnimation: "bounce",
      });
    } finally {
      setIsGeneratingCharacter(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChangeBackground({
            type: "custom-image",
            value: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAIBackground = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setAiError(null);
    setAiNotice(null);

    try {
      const res = await fetch("/api/generate-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          style: aiStyle,
          aspectRatio: "9:16",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.imageUrl) {
        throw new Error(data.error || "Gagal menghasilkan background AI.");
      }

      onChangeBackground({
        type: "ai-generated",
        value: data.imageUrl,
        aiPrompt,
      });

      setGeneratedGallery((prev) => [
        { url: data.imageUrl, prompt: aiPrompt, timestamp: Date.now() },
        ...prev.slice(0, 9),
      ]);

      if (data.notice) {
        setAiNotice(data.notice);
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Gagal membuat background AI. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredPhotos =
    photoFilter === "all"
      ? CURATED_PHOTOS
      : CURATED_PHOTOS.filter((p) => p.category === photoFilter);

  return (
    <div className="space-y-6">
      {/* Background Source Tabs */}
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-zinc-800 bg-zinc-900/80 p-1 sm:grid-cols-7">
        {[
          { id: "3d-animated", label: "3D Animasi", icon: Box, highlight: true },
          { id: "ai-generator", label: "AI Generator", icon: Wand2 },
          { id: "curated-photo", label: "Foto Estetis", icon: ImageIcon },
          { id: "gradient", label: "Gradasi", icon: Sparkles },
          { id: "texture-paper", label: "Kertas", icon: Layers },
          { id: "custom-image", label: "Upload", icon: Upload },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "3d-animated" && background.type !== "3d-animated") {
                  onChangeBackground({
                    type: "3d-animated",
                    threeDTheme: background.threeDTheme || "liquid-waves",
                    threeDColorPreset: background.threeDColorPreset || "indigo-violet",
                    threeDSpeed: background.threeDSpeed ?? 1.0,
                    threeDInteractive: background.threeDInteractive ?? true,
                    overlayOpacity: Math.min(background.overlayOpacity, 0.25),
                  });
                } else if (tab.id === "texture-paper" && background.type !== "texture-paper") {
                  onChangeBackground({
                    type: "texture-paper",
                    value: TEXTURE_PAPERS[0].colorHex,
                  });
                } else if (tab.id === "gradient" && background.type !== "gradient") {
                  onChangeBackground({
                    type: "gradient",
                    value: GRADIENT_PRESETS[0].css,
                  });
                } else if (tab.id === "curated-photo" && background.type !== "curated-photo") {
                  onChangeBackground({
                    type: "curated-photo",
                    value: CURATED_PHOTOS[0].url,
                  });
                }
              }}
              className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
                isActive
                  ? tab.highlight
                    ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                    : "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : tab.highlight
                  ? "text-indigo-300 hover:text-indigo-100 hover:bg-indigo-500/10"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>



      {/* 0. 3D ANIMATED BACKGROUND TAB */}
      {activeTab === "3d-animated" && (
        <div className="space-y-5 rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-500/10 via-zinc-900/70 to-zinc-900/90 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/30">
                <Box className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100 flex items-center gap-1.5">
                  <span>3D Animated Live Canvas</span>
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.2 text-[9px] font-bold text-indigo-300 border border-indigo-500/30">
                    WebGL 60 FPS
                  </span>
                </h4>
                <p className="text-[10px] text-zinc-400">
                  Background animasi 3D interaktif dengan efek kedalaman
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                const randomTheme = THREE_D_THEMES[Math.floor(Math.random() * THREE_D_THEMES.length)];
                const randomPalette = THREE_D_COLOR_PALETTES[Math.floor(Math.random() * THREE_D_COLOR_PALETTES.length)];
                onChangeBackground({
                  type: "3d-animated",
                  threeDTheme: randomTheme.id,
                  threeDColorPreset: randomPalette.id,
                });
              }}
              className="flex items-center gap-1 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-1 text-[10px] font-semibold text-indigo-300 hover:bg-indigo-500/25 transition-all"
            >
              <Sparkles className="h-3 w-3" />
              <span>Acak 3D</span>
            </button>
          </div>

          {/* AI 3D Scene Generator Box */}
          <div className="space-y-3 rounded-xl border border-indigo-500/30 bg-zinc-950/70 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/80 text-white">
                  <Wand2 className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold text-indigo-200">
                  Generate 3D ke AI (Gemini)
                </span>
              </div>
              <span className="text-[9px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                Custom Prompt
              </span>
            </div>

            <p className="text-[10px] text-zinc-400 leading-snug">
              Ketik deskripsi visual 3D impianmu, dan Gemini AI akan merancang konfigurasi tema, warna, serta kecepatan animasi secara otomatis.
            </p>

            <div className="space-y-2">
              <textarea
                rows={2}
                value={threeAiPrompt}
                onChange={(e) => setThreeAiPrompt(e.target.value)}
                placeholder="Contoh: Galaksi kosmik ungu misterius dengan bintang berkelap-kelip cepat..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
              />

              {/* Quick Prompt Ideas for 3D */}
              <div className="flex flex-wrap gap-1">
                {[
                  "✨ Galaksi kosmik ungu misterius",
                  "💎 Kristal ruby merah melayang",
                  "🌊 Gelombang liquid neon cyberpunk",
                  "🪐 Cincin torus emas berputar",
                  "🧬 Spiral DNA hijau zamrud",
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setThreeAiPrompt(idea.replace(/^[^\s]+\s/, ""))}
                    className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-1 text-[9px] text-zinc-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-200 transition-all"
                  >
                    {idea}
                  </button>
                ))}
              </div>

              {threeAiNotice && (
                <div className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-2 text-[10px] text-indigo-200">
                  <Sparkles className="h-3 w-3 text-indigo-400 shrink-0" />
                  <span>{threeAiNotice}</span>
                </div>
              )}

              {threeAiError && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-[10px] text-rose-200">
                  {threeAiError}
                </div>
              )}

              <button
                type="button"
                disabled={isGenerating3D || !threeAiPrompt.trim()}
                onClick={handleGenerate3DWithAI}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all"
              >
                {isGenerating3D ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Gemini Merancang Scene 3D...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Generate Scene 3D dengan AI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3D Theme Choice Grid */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
              <span>Pilih Tema 3D:</span>
              <span className="text-[10px] font-normal text-indigo-400">
                {THREE_D_THEMES.find((t) => t.id === (background.threeDTheme || "liquid-waves"))?.name}
              </span>
            </label>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {THREE_D_THEMES.map((themeItem) => {
                const isSelected = (background.threeDTheme || "liquid-waves") === themeItem.id;
                return (
                  <button
                    key={themeItem.id}
                    type="button"
                    onClick={() =>
                      onChangeBackground({
                        type: "3d-animated",
                        threeDTheme: themeItem.id,
                      })
                    }
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/20 ring-1 ring-indigo-500/50 shadow-md shadow-indigo-500/15"
                        : "border-zinc-800 bg-zinc-900/70 hover:border-zinc-700 hover:bg-zinc-800/60"
                    }`}
                  >
                    <div className="text-xl shrink-0 p-1 rounded-lg bg-zinc-950/60 border border-white/5">
                      {themeItem.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? "text-indigo-200" : "text-zinc-200"}`}>
                          {themeItem.name}
                        </span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-0.5 leading-snug">
                        {themeItem.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Palettes for 3D */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/70">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
              Palet Warna 3D Glow:
            </label>
            <div className="flex flex-wrap gap-2">
              {THREE_D_COLOR_PALETTES.map((pal) => {
                const isPalActive = (background.threeDColorPreset || "indigo-violet") === pal.id;
                return (
                  <button
                    key={pal.id}
                    type="button"
                    onClick={() =>
                      onChangeBackground({
                        threeDColorPreset: pal.id,
                      })
                    }
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-all ${
                      isPalActive
                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 font-bold"
                        : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div
                      className="h-3 w-3 rounded-full border border-white/20 shadow-sm"
                      style={{
                        background: `linear-gradient(135deg, ${pal.color}, ${pal.sub})`,
                      }}
                    />
                    <span>{pal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Speed & Interactive Controls */}
          <div className="grid grid-cols-1 gap-3 pt-2 border-t border-zinc-800/70 sm:grid-cols-2">
            {/* Animation Speed Slider */}
            <div className="space-y-1.5 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Kecepatan Animasi 3D</span>
                </span>
                <span className="font-mono text-indigo-400 font-bold">
                  {(background.threeDSpeed ?? 1.0).toFixed(1)}x
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={background.threeDSpeed ?? 1.0}
                onChange={(e) =>
                  onChangeBackground({
                    threeDSpeed: parseFloat(e.target.value),
                  })
                }
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Mouse Parallax Tilt Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-3">
              <div>
                <span className="text-xs text-zinc-300 font-medium flex items-center gap-1">
                  <Zap className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Parallax Mouse / Sentuhan</span>
                </span>
                <p className="text-[10px] text-zinc-500 mt-0.5">
                  Kamera 3D mengikuti kursor mouse
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChangeBackground({
                    threeDInteractive: !(background.threeDInteractive ?? true),
                  })
                }
                className={`h-6 w-11 rounded-full p-0.5 transition-colors ${
                  (background.threeDInteractive ?? true)
                    ? "bg-indigo-600"
                    : "bg-zinc-800"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    (background.threeDInteractive ?? true)
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 0. AI BACKGROUND GENERATOR TAB */}
      {activeTab === "ai-generator" && (
        <div className="space-y-4 rounded-2xl border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 via-zinc-900/60 to-zinc-900/80 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <Wand2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-100">AI Background Generator</h4>
                <p className="text-[10px] text-zinc-400">Buat visual wallpaper estetik dengan AI</p>
              </div>
            </div>
            <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[9px] font-semibold text-indigo-300 border border-indigo-500/30">
              Gemini & Imagen
            </span>
          </div>

          {/* Quick Preset Ideas */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              <Compass className="h-3 w-3 text-indigo-400" />
              <span>Inspirasi Tema Cepat (1-Klik):</span>
            </label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {AI_PROMPT_PRESETS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAiPrompt(preset.prompt)}
                  className="rounded-lg border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-[10px] text-zinc-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-200 transition-all text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Textarea */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">
              Deskripsi Prompt Visual:
            </label>
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Contoh: Senja jingga di tepi danau hening dengan pantulan cahaya matahari lembut..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
            />
          </div>

          {/* Style Vibes Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-medium text-zinc-400">
              Gaya Artistik (Art Style):
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {AI_STYLES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setAiStyle(st.id)}
                  className={`rounded-lg border p-2 text-left text-[10px] font-medium transition-all ${
                    aiStyle === st.id
                      ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 font-semibold"
                      : "border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notice & Error */}
          {aiNotice && (
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-2.5 text-[11px] text-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
              <span>{aiNotice}</span>
            </div>
          )}

          {aiError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2.5 text-[11px] text-rose-200">
              {aiError}
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            disabled={isGenerating || !aiPrompt.trim()}
            onClick={handleGenerateAIBackground}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 transition-all"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Sedang Meracik Background AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Generate AI Background Sekarang</span>
              </>
            )}
          </button>

          {/* Gallery of generated backgrounds in current session */}
          {generatedGallery.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-zinc-800/80">
              <label className="text-[11px] font-semibold text-zinc-300">
                Hasil Background Sesi Ini ({generatedGallery.length}):
              </label>
              <div className="grid grid-cols-4 gap-2">
                {generatedGallery.map((item, i) => {
                  const isCur = background.value === item.url;
                  return (
                    <div
                      key={i}
                      onClick={() =>
                        onChangeBackground({
                          type: "ai-generated",
                          value: item.url,
                          aiPrompt: item.prompt,
                        })
                      }
                      className={`group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl border transition-all ${
                        isCur
                          ? "border-indigo-500 ring-2 ring-indigo-500/50"
                          : "border-zinc-800 hover:border-zinc-600"
                      }`}
                    >
                      <img
                        src={item.url}
                        alt="AI Generated"
                        className="h-full w-full object-cover"
                      />
                      {isCur && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 1. CURATED PHOTOS TAB */}
      {activeTab === "curated-photo" && (
        <div className="space-y-3">
          {/* Photo Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: "Semua Foto" },
              { id: "sunset", label: "Senja" },
              { id: "moody", label: "Moody Dark" },
              { id: "coffee", label: "Kopi & Buku" },
              { id: "nature", label: "Alam & Laut" },
              { id: "minimal", label: "Minimalis" },
              { id: "night", label: "Malam" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPhotoFilter(cat.id)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  photoFilter === cat.id
                    ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1 no-scrollbar sm:grid-cols-4">
            {filteredPhotos.map((photo) => {
              const isSelected =
                background.type === "curated-photo" &&
                background.value === photo.url;
              return (
                <div
                  key={photo.id}
                  onClick={() =>
                    onChangeBackground({
                      type: "curated-photo",
                      value: photo.url,
                    })
                  }
                  className={`group relative aspect-square cursor-pointer overflow-hidden rounded-xl border transition-all ${
                    isSelected
                      ? "border-indigo-500 ring-2 ring-indigo-500/40"
                      : "border-zinc-800 hover:border-zinc-600"
                  }`}
                >
                  <img
                    src={photo.previewUrl}
                    alt={photo.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  )}
                  <span className="absolute bottom-1 left-1 right-1 truncate rounded bg-black/60 px-1 py-0.5 text-[9px] text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    {photo.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. GRADIENTS & AURA TAB */}
      {activeTab === "gradient" && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 max-h-56 overflow-y-auto pr-1 no-scrollbar">
          {GRADIENT_PRESETS.map((grad) => {
            const isSelected =
              background.type === "gradient" && background.value === grad.css;
            return (
              <div
                key={grad.id}
                onClick={() =>
                  onChangeBackground({
                    type: "gradient",
                    value: grad.css,
                  })
                }
                style={{ background: grad.css }}
                className={`relative flex h-20 cursor-pointer items-end justify-between rounded-xl p-2.5 border transition-all ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/50 shadow-md"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <span className="rounded bg-black/50 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {grad.name}
                </span>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 3. TEXTURE PAPERS TAB */}
      {activeTab === "texture-paper" && (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {TEXTURE_PAPERS.map((paper) => {
            const isSelected =
              background.type === "texture-paper" &&
              background.value === paper.colorHex;
            return (
              <div
                key={paper.id}
                onClick={() =>
                  onChangeBackground({
                    type: "texture-paper",
                    value: paper.colorHex,
                  })
                }
                style={{ backgroundColor: paper.colorHex }}
                className={`relative flex h-20 cursor-pointer items-end justify-between rounded-xl p-2.5 border transition-all ${
                  isSelected
                    ? "border-indigo-500 ring-2 ring-indigo-500/50 shadow-md"
                    : "border-zinc-700/60 hover:border-zinc-500"
                }`}
              >
                <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                  {paper.name}
                </span>
                {isSelected && (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 4. CUSTOM IMAGE UPLOAD TAB */}
      {activeTab === "custom-image" && (
        <div className="space-y-3">
          <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/40 p-6 text-center cursor-pointer hover:border-indigo-500 hover:bg-zinc-900/80 transition-all">
            <Upload className="h-8 w-8 text-indigo-400 mb-2" />
            <span className="text-xs font-semibold text-zinc-200">
              Pilih Foto dari Perangkat
            </span>
            <span className="text-[11px] text-zinc-500 mt-1">
              Mendukung JPG, PNG, WEBP
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      )}

      {/* BACKGROUND ADJUSTMENTS & FILTERS */}
      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
          <Sliders className="h-3.5 w-3.5 text-indigo-400" />
          <span>Pengaturan Filter & Efek Background</span>
        </h4>

        {/* Overlay Opacity */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Kegelapan Overlay (Tint)</span>
            <span className="font-mono text-indigo-400">
              {Math.round(background.overlayOpacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={background.overlayOpacity}
            onChange={(e) =>
              onChangeBackground({ overlayOpacity: parseFloat(e.target.value) })
            }
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Blur Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Efek Buram (Blur)</span>
            <span className="font-mono text-indigo-400">{background.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={background.blur}
            onChange={(e) =>
              onChangeBackground({ blur: parseInt(e.target.value, 10) })
            }
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Grain & Vignette Toggles */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800/80">
          <button
            type="button"
            onClick={() =>
              onChangeBackground({ hasGrain: !background.hasGrain })
            }
            className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-medium transition-all ${
              background.hasGrain
                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-400"
            }`}
          >
            <span>Film Grain / Noise</span>
            <div
              className={`h-4 w-4 rounded-full border ${
                background.hasGrain
                  ? "bg-indigo-600 border-indigo-400"
                  : "border-zinc-600 bg-zinc-800"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={() =>
              onChangeBackground({ hasVignette: !background.hasVignette })
            }
            className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-medium transition-all ${
              background.hasVignette
                ? "border-indigo-500/40 bg-indigo-500/10 text-indigo-300"
                : "border-zinc-800 bg-zinc-900 text-zinc-400"
            }`}
          >
            <span>Bayangan Vignette</span>
            <div
              className={`h-4 w-4 rounded-full border ${
                background.hasVignette
                  ? "bg-indigo-600 border-indigo-400"
                  : "border-zinc-600 bg-zinc-800"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
