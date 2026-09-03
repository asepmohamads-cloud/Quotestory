export interface CuratedPhotoItem {
  id: string;
  name: string;
  category: "sunset" | "moody" | "coffee" | "nature" | "minimal" | "night" | "abstract";
  url: string;
  previewUrl: string;
}

export const CURATED_PHOTOS: CuratedPhotoItem[] = [
  // Sunset & Golden Hour
  {
    id: "sunset-1",
    name: "Golden Hour Glow",
    category: "sunset",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "sunset-2",
    name: "Senja Jingga di Bukit",
    category: "sunset",
    url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "sunset-3",
    name: "Cahaya Sore Lembut",
    category: "sunset",
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=300&q=60",
  },

  // Moody & Dark Aesthetic
  {
    id: "moody-1",
    name: "Rainy Window Drops",
    category: "moody",
    url: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "moody-2",
    name: "Shadows on Concrete",
    category: "moody",
    url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "moody-3",
    name: "Foggy Forest Calm",
    category: "moody",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "moody-4",
    name: "Dark Minimal Architecture",
    category: "moody",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=60",
  },

  // Coffee & Books / Slow Living
  {
    id: "coffee-1",
    name: "Kopi Hangat & Buku",
    category: "coffee",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "coffee-2",
    name: "Vintage Diary & Pen",
    category: "coffee",
    url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "coffee-3",
    name: "Cozy Morning Table",
    category: "coffee",
    url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=300&q=60",
  },

  // Nature & Tranquility
  {
    id: "nature-1",
    name: "Ombak Laut Tenang",
    category: "nature",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "nature-2",
    name: "Pohon Pinus Berkabut",
    category: "nature",
    url: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "nature-3",
    name: "Rerumputan Senja",
    category: "nature",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=300&q=60",
  },

  // Minimal Architecture & Shadows
  {
    id: "minimal-1",
    name: "Arsitektur Minimalis Putih",
    category: "minimal",
    url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "minimal-2",
    name: "Bayangan Daun di Dinding",
    category: "minimal",
    url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&q=60",
  },

  // Night & Stars
  {
    id: "night-1",
    name: "Langit Bintang Malam",
    category: "night",
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=300&q=60",
  },
  {
    id: "night-2",
    name: "Lampu Kota di Kejauhan",
    category: "night",
    url: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
    previewUrl: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=300&q=60",
  },
];

export interface GradientItem {
  id: string;
  name: string;
  css: string;
  category: "dark" | "sunset" | "aura" | "pastel" | "emerald";
}

export const GRADIENT_PRESETS: GradientItem[] = [
  {
    id: "grad-midnight-stoic",
    name: "Midnight Stoic",
    category: "dark",
    css: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
  },
  {
    id: "grad-deep-space",
    name: "Deep Obsidian",
    category: "dark",
    css: "radial-gradient(circle at 50% 20%, #27272a 0%, #0f172a 50%, #020617 100%)",
  },
  {
    id: "grad-cyber-dusk",
    name: "Cyber Dusk",
    category: "dark",
    css: "linear-gradient(135deg, #1e1b4b 0%, #311042 50%, #0f172a 100%)",
  },
  {
    id: "grad-sunset-aura",
    name: "Sunset Aura",
    category: "sunset",
    css: "radial-gradient(circle at 70% 30%, #f97316 0%, #db2777 40%, #4c1d95 100%)",
  },
  {
    id: "grad-golden-horizon",
    name: "Golden Horizon",
    category: "sunset",
    css: "linear-gradient(160deg, #fdba74 0%, #ea580c 45%, #7c2d12 100%)",
  },
  {
    id: "grad-emerald-mist",
    name: "Emerald Forest",
    category: "emerald",
    css: "linear-gradient(145deg, #064e3b 0%, #022c22 60%, #051c14 100%)",
  },
  {
    id: "grad-lavender-dream",
    name: "Lavender Mist",
    category: "pastel",
    css: "linear-gradient(135deg, #e0e7ff 0%, #fae8ff 50%, #fce7f3 100%)",
  },
  {
    id: "grad-warm-oat",
    name: "Warm Oat & Latte",
    category: "pastel",
    css: "linear-gradient(135deg, #f5efe6 0%, #e8dfd8 50%, #dcd3cb 100%)",
  },
  {
    id: "grad-aura-glow",
    name: "Spiritual Aura Glow",
    category: "aura",
    css: "radial-gradient(ellipse at top left, #38bdf8 0%, #818cf8 35%, #c084fc 70%, #1e1b4b 100%)",
  },
  {
    id: "grad-monochrome-paper",
    name: "Editorial Off-White",
    category: "pastel",
    css: "linear-gradient(180deg, #fafafa 0%, #f4f4f5 50%, #e4e4e7 100%)",
  },
];

export interface TexturePaperItem {
  id: string;
  name: string;
  backgroundClass: string;
  colorHex: string;
}

export const TEXTURE_PAPERS: TexturePaperItem[] = [
  {
    id: "paper-ivory",
    name: "Clean Ivory Canvas",
    backgroundClass: "bg-[#f8f6f0] text-neutral-800",
    colorHex: "#f8f6f0",
  },
  {
    id: "paper-kraft",
    name: "Vintage Kraft Paper",
    backgroundClass: "bg-[#d8c3a5] text-amber-950",
    colorHex: "#d8c3a5",
  },
  {
    id: "paper-slate-dark",
    name: "Matte Charcoal Slate",
    backgroundClass: "bg-[#141416] text-neutral-100",
    colorHex: "#141416",
  },
  {
    id: "paper-espresso",
    name: "Dark Espresso",
    backgroundClass: "bg-[#1f1917] text-amber-100",
    colorHex: "#1f1917",
  },
  {
    id: "paper-emerald",
    name: "Dark Botanical Pine",
    backgroundClass: "bg-[#0b1713] text-emerald-100",
    colorHex: "#0b1713",
  },
  {
    id: "paper-newsprint",
    name: "Retro Newsprint Gray",
    backgroundClass: "bg-[#e2e0dc] text-neutral-900",
    colorHex: "#e2e0dc",
  },
];
