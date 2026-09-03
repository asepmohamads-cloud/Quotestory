import React, { useState } from "react";
import { TypographyConfig, FontFamily } from "../types";
import {
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Italic,
  Quote,
  Palette,
  Search,
  Sliders,
  Sparkles,
  Layers,
} from "lucide-react";

interface TypographyControlsProps {
  typography: TypographyConfig;
  onChangeTypography: (updated: Partial<TypographyConfig>) => void;
}

export interface FontOptionItem {
  id: FontFamily;
  label: string;
  category: "serif" | "sans" | "script" | "mono" | "display";
  vibe: string;
  sampleText?: string;
}

export const FONT_OPTIONS: FontOptionItem[] = [
  // SERIF & SASTRA
  { id: "Playfair Display", label: "Playfair Display", category: "serif", vibe: "Klasik & Editorial Elegan" },
  { id: "Cormorant Garamond", label: "Cormorant Garamond", category: "serif", vibe: "Stoik, Tenang & Sastra" },
  { id: "DM Serif Display", label: "DM Serif Display", category: "serif", vibe: "Luxury Editorial Magazine" },
  { id: "Cinzel", label: "Cinzel Roman", category: "serif", vibe: "Megah & Monumental" },
  { id: "Bodoni Moda", label: "Bodoni Moda", category: "serif", vibe: "High-Fashion & Glamour" },
  { id: "Prata", label: "Prata Serif", category: "serif", vibe: "Lembut, Anggun & Puitis" },
  { id: "Italiana", label: "Italiana", category: "serif", vibe: "Desain Arsitektural Italia" },
  { id: "Lora", label: "Lora", category: "serif", vibe: "Buku Cerita & Esai Mendalam" },
  { id: "Merriweather", label: "Merriweather", category: "serif", vibe: "Jurnalistik & Nyaman Dibaca" },
  { id: "EB Garamond", label: "EB Garamond", category: "serif", vibe: "Naskah Kuno & Filosofis" },
  { id: "Newsreader", label: "Newsreader", category: "serif", vibe: "Jurnal Sastra Kontemporer" },
  { id: "Playfair Display SC", label: "Playfair Small Caps", category: "serif", vibe: "Small Caps Eksklusif" },

  // SANS MODERN
  { id: "Plus Jakarta Sans", label: "Plus Jakarta Sans", category: "sans", vibe: "Modern, Bersih & Luwes" },
  { id: "Montserrat", label: "Montserrat", category: "sans", vibe: "Elegan & Universal" },
  { id: "Outfit", label: "Outfit Sans", category: "sans", vibe: "Futuristik & Minimalis" },
  { id: "Syne", label: "Syne Display", category: "sans", vibe: "Artistik & Bold" },
  { id: "Inter", label: "Inter UI", category: "sans", vibe: "Netral & Super Jelas" },
  { id: "Poppins", label: "Poppins", category: "sans", vibe: "Geometris & Bersahabat" },
  { id: "Raleway", label: "Raleway", category: "sans", vibe: "Tipis & Berkelas" },
  { id: "Space Grotesk", label: "Space Grotesk", category: "sans", vibe: "Tech Brutalism" },
  { id: "Manrope", label: "Manrope", category: "sans", vibe: "Semi-geometris Rapi" },

  // TULIS TANGAN & KALIGRAFI
  { id: "Caveat", label: "Caveat", category: "script", vibe: "Catatan Harian / Diary" },
  { id: "Dancing Script", label: "Dancing Script", category: "script", vibe: "Puitis & Mengalir" },
  { id: "Kalam", label: "Kalam", category: "script", vibe: "Goresan Spidol Kasual" },
  { id: "Satisfy", label: "Satisfy Script", category: "script", vibe: "Elegan & Manis" },
  { id: "Sacramento", label: "Sacramento", category: "script", vibe: "Garis Halus Monoline" },
  { id: "Alex Brush", label: "Alex Brush", category: "script", vibe: "Kaligrafi Klasik Mewah" },
  { id: "Great Vibes", label: "Great Vibes", category: "script", vibe: "Romansa Sastra Abadi" },
  { id: "Marck Script", label: "Marck Script", category: "script", vibe: "Tinta Halus & Hangat" },

  // MESIN TIK & MONOSPACE
  { id: "Space Mono", label: "Space Mono", category: "mono", vibe: "Mesin Tik Sci-Fi & Retro" },
  { id: "Special Elite", label: "Special Elite", category: "mono", vibe: "Mesin Tik Tua Bertekstur" },
  { id: "Courier Prime", label: "Courier Prime", category: "mono", vibe: "Naskah Skenario Klasik" },
  { id: "VT323", label: "VT323 Pixel", category: "mono", vibe: "Pixel Art Nostalgia" },

  // DISPLAY & IMPACTFUL
  { id: "Bebas Neue", label: "Bebas Neue", category: "display", vibe: "Tegas & Impactful" },
  { id: "Oswald", label: "Oswald", category: "display", vibe: "Kompak & Kuat" },
  { id: "Anton", label: "Anton Bold", category: "display", vibe: "Ultra Bold & Bertenaga" },
  { id: "Abril Fatface", label: "Abril Fatface", category: "display", vibe: "Display Kontras Tinggi" },
  { id: "Cinzel Decorative", label: "Cinzel Decorative", category: "display", vibe: "Ornamen Eksklusif" },
];

const COLOR_PRESETS = [
  { label: "Putih Murni", hex: "#ffffff" },
  { label: "Krem Gading", hex: "#f8f6f0" },
  { label: "Kuning Emas", hex: "#fbbf24" },
  { label: "Oranye Senja", hex: "#f97316" },
  { label: "Hijau Emerald", hex: "#34d399" },
  { label: "Biru Langit", hex: "#38bdf8" },
  { label: "Merah Mawar", hex: "#f43f5e" },
  { label: "Ungu Lavender", hex: "#c084fc" },
  { label: "Abu-abu Terang", hex: "#e4e4e7" },
  { label: "Hitam Arang", hex: "#18181b" },
];

export const TypographyControls: React.FC<TypographyControlsProps> = ({
  typography,
  onChangeTypography,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [targetFontPart, setTargetFontPart] = useState<"main" | "header">("main");

  const filteredFonts = FONT_OPTIONS.filter((font) => {
    const matchCat = selectedCategory === "all" || font.category === selectedCategory;
    const matchSearch =
      searchQuery === "" ||
      font.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.vibe.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const activeFontId =
    targetFontPart === "main" ? typography.fontFamily : typography.headerFontFamily;

  return (
    <div className="space-y-6">
      {/* Target Selector: Main Quote vs Header Label */}
      <div className="flex rounded-xl border border-zinc-800 bg-zinc-900/80 p-1">
        <button
          type="button"
          onClick={() => setTargetFontPart("main")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
            targetFontPart === "main"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Type className="h-3.5 w-3.5" />
          <span>Font Kutipan Utama ({typography.fontFamily})</span>
        </button>
        <button
          type="button"
          onClick={() => setTargetFontPart("header")}
          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all ${
            targetFontPart === "header"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Font Header / Tag ({typography.headerFontFamily})</span>
        </button>
      </div>

      {/* 1. Font Family Selector & Filters */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Type className="h-3.5 w-3.5 text-indigo-400" />
            <span>Pilihan Font ({filteredFonts.length} Tersedia)</span>
          </label>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama font atau gaya estetis..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "Semua" },
            { id: "serif", label: "Sastra & Serif" },
            { id: "sans", label: "Modern Sans" },
            { id: "script", label: "Tulis Tangan" },
            { id: "mono", label: "Mesin Tik / Retro" },
            { id: "display", label: "Bold & Display" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white font-semibold shadow-sm"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Font List Grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 max-h-64 overflow-y-auto pr-1 no-scrollbar">
          {filteredFonts.map((font) => {
            const isSelected = activeFontId === font.id;
            return (
              <div
                key={font.id}
                onClick={() => {
                  if (targetFontPart === "main") {
                    onChangeTypography({ fontFamily: font.id });
                  } else {
                    onChangeTypography({ headerFontFamily: font.id });
                  }
                }}
                className={`cursor-pointer rounded-xl border p-2.5 transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/40"
                    : "border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    style={{ fontFamily: font.id }}
                    className="text-base font-medium truncate"
                  >
                    {font.label}
                  </div>
                  {isSelected && (
                    <span className="rounded bg-indigo-500/30 px-1.5 py-0.5 text-[9px] font-bold text-indigo-300">
                      AKTIF
                    </span>
                  )}
                </div>
                <div
                  style={{ fontFamily: font.id }}
                  className="mt-1 text-xs text-zinc-400 truncate opacity-90"
                >
                  Abc 123 "Indah & Puitis"
                </div>
                <div className="mt-1 text-[10px] text-zinc-500 font-sans">
                  {font.vibe}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Sizing, Line Height & Letter Spacing Sliders */}
      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        {/* Font Size */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Ukuran Teks (Font Size)</span>
            <span className="font-mono text-indigo-400">{typography.fontSize}px</span>
          </div>
          <input
            type="range"
            min="16"
            max="48"
            step="1"
            value={typography.fontSize}
            onChange={(e) =>
              onChangeTypography({ fontSize: Number(e.target.value) })
            }
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Line Height (Jarak Baris) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Jarak Antar Baris (Line Height)</span>
            <span className="font-mono text-indigo-400">{typography.lineHeight}x</span>
          </div>
          <input
            type="range"
            min="1.2"
            max="2.2"
            step="0.1"
            value={typography.lineHeight}
            onChange={(e) =>
              onChangeTypography({ lineHeight: Number(e.target.value) })
            }
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>

        {/* Letter Spacing (Jarak Huruf) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-400">Kerning / Jarak Huruf</span>
            <span className="font-mono text-indigo-400">
              {typography.letterSpacing}px
            </span>
          </div>
          <input
            type="range"
            min="-1"
            max="4"
            step="0.5"
            value={typography.letterSpacing}
            onChange={(e) =>
              onChangeTypography({ letterSpacing: Number(e.target.value) })
            }
            className="w-full accent-indigo-500 cursor-pointer"
          />
        </div>
      </div>

      {/* 3. Text Alignment & Styling Pills */}
      <div className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <label className="text-xs font-bold uppercase tracking-wider text-zinc-300">
          Format & Posisi Paragraf
        </label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "left", label: "Kiri", icon: AlignLeft },
            { id: "center", label: "Tengah", icon: AlignCenter },
            { id: "right", label: "Kanan", icon: AlignRight },
            { id: "justify", label: "Rata", icon: AlignJustify },
          ].map((align) => {
            const Icon = align.icon;
            const isSelected = typography.textAlign === align.id;
            return (
              <button
                key={align.id}
                type="button"
                onClick={() =>
                  onChangeTypography({
                    textAlign: align.id as any,
                  })
                }
                className={`flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 font-semibold"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{align.label}</span>
              </button>
            );
          })}
        </div>

        {/* Uppercase and Italic Toggles */}
        <div className="pt-2 border-t border-zinc-800/80">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                onChangeTypography({ isUppercase: !typography.isUppercase })
              }
              className={`flex-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                typography.isUppercase
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              AA (KAPITAL)
            </button>
            <button
              type="button"
              onClick={() =>
                onChangeTypography({ isItalic: !typography.isItalic })
              }
              className={`flex-1 flex items-center justify-center gap-1 rounded-xl border py-2 text-xs font-medium transition-all ${
                typography.isItalic
                  ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Italic className="h-3.5 w-3.5" />
              <span>Miring</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Text Color Customization & RGB Picker */}
      <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-300">
            <Palette className="h-3.5 w-3.5 text-indigo-400" />
            <span>Kustomisasi Warna Teks & RGB</span>
          </label>
        </div>

        {/* Color Target Selector */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "main", label: "Teks Utama", color: typography.textColor },
            { id: "header", label: "Header", color: typography.headerColor || typography.textColor },
            { id: "sub", label: "Subteks", color: typography.subtextColor || typography.textColor },
            { id: "author", label: "Penulis", color: typography.authorColor || typography.textColor },
            { id: "highlight", label: "Highlight", color: typography.highlightColor || "#fbbf24" },
          ].map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => (window as any).__activeColorTarget = target.id}
              className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs transition-all ${
                ((window as any).__activeColorTarget || "main") === target.id
                  ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 font-semibold"
                  : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <span className="h-3 w-3 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: target.color }} />
              <span className="truncate">{target.label}</span>
            </button>
          ))}
        </div>

        {/* Active Color Controls */}
        {(() => {
          const activeTarget = (window as any).__activeColorTarget || "main";
          const currentColor =
            activeTarget === "main" ? typography.textColor :
            activeTarget === "header" ? (typography.headerColor || typography.textColor) :
            activeTarget === "sub" ? (typography.subtextColor || typography.textColor) :
            activeTarget === "author" ? (typography.authorColor || typography.textColor) :
            (typography.highlightColor || "#fbbf24");

          const updateActiveColor = (newCol: string) => {
            if (activeTarget === "main") onChangeTypography({ textColor: newCol });
            else if (activeTarget === "header") onChangeTypography({ headerColor: newCol });
            else if (activeTarget === "sub") onChangeTypography({ subtextColor: newCol });
            else if (activeTarget === "author") onChangeTypography({ authorColor: newCol });
            else onChangeTypography({ highlightColor: newCol });
          };

          return (
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Pilih Warna / Picker RGB</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs uppercase text-indigo-300">{currentColor}</span>
                  <input
                    type="color"
                    value={currentColor.startsWith("#") ? currentColor : "#ffffff"}
                    onChange={(e) => updateActiveColor(e.target.value)}
                    className="h-7 w-7 rounded-lg border border-zinc-700 bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              {/* Color Presets */}
              <div className="flex flex-wrap gap-1.5">
                {COLOR_PRESETS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    title={col.label}
                    onClick={() => updateActiveColor(col.hex)}
                    style={{ backgroundColor: col.hex }}
                    className={`h-6 w-6 rounded-full border transition-transform ${
                      currentColor === col.hex
                        ? "border-indigo-400 scale-110 shadow-md ring-2 ring-indigo-500/40"
                        : "border-zinc-700 opacity-80 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>

              {/* Hex / Custom RGB Input */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-500 shrink-0">Hex / RGB Code:</span>
                <input
                  type="text"
                  value={currentColor}
                  onChange={(e) => updateActiveColor(e.target.value)}
                  placeholder="#ffffff atau rgba(...)"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-xs text-zinc-100 font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          );
        })()}
      </div>

      {/* 5. Quote Mark Style */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Quote className="h-3.5 w-3.5 text-indigo-400" />
            <span>Ikon Tanda Petik (Quote Marks)</span>
          </label>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: "classic", label: "Klasik “ ”" },
            { id: "modern", label: "Modern “" },
            { id: "japanese", label: "｢ ｣ Sudut" },
            { id: "none", label: "Tanpa Petik" },
          ].map((style) => {
            const isSelected =
              typography.showQuoteMarks &&
              typography.quoteMarkStyle === style.id;
            const isNone = style.id === "none" && !typography.showQuoteMarks;
            return (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  if (style.id === "none") {
                    onChangeTypography({ showQuoteMarks: false });
                  } else {
                    onChangeTypography({
                      showQuoteMarks: true,
                      quoteMarkStyle: style.id as any,
                    });
                  }
                }}
                className={`rounded-xl border p-2 text-center text-xs font-medium transition-all ${
                  isSelected || isNone
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 font-semibold"
                    : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {style.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
