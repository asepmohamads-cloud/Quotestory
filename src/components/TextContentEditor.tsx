import React, { useState } from "react";
import { QuoteContent, TypographyConfig, LayoutStyleType } from "../types";
import {
  Type,
  Sparkles,
  Star,
  Flame,
  Heart,
  Feather,
  Compass,
  Crown,
  Leaf,
  Music,
  BookOpen,
  Sun,
  Moon,
  Zap,
  Coffee,
  Calendar,
  AtSign,
  User,
  Tag,
  Highlighter,
  Wand2,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

interface TextContentEditorProps {
  content: QuoteContent;
  onChangeContent: (updated: Partial<QuoteContent>) => void;
  typography: TypographyConfig;
  onChangeTypography: (updated: Partial<TypographyConfig>) => void;
  layout: LayoutStyleType;
  onOpenAIModal: () => void;
  onQuickRewrite: (style: string) => Promise<void>;
  isRewriting: boolean;
}

const HEADER_TAG_PRESETS = [
  "01 // RENUNGAN HARI INI",
  "✨ DAILY REMINDER",
  "CATATAN KECIL",
  "23:45 WIB // SUARA MALAM",
  "STOIKISME // AMOR FATI",
  "SELF HEALING",
  "SENJA & KOPI",
  "FOKUS & DISIPLIN",
];

const REWRITE_STYLES = [
  { id: "poetic", label: "Lebih Puitis & Indah", prompt: "Buat lebih puitis, kaya metafora sastra yang indah dan menggetarkan hati" },
  { id: "punchy", label: "Lebih Ringkas & Menohok", prompt: "Buat lebih singkat, padat, dan menohok sebagai punchline yang tajam" },
  { id: "stoic", label: "Gaya Stoikisme & Bijak", prompt: "Ubah ke nada filsafat Stoik yang tenang, rasional, dan mendalam" },
  { id: "healing", label: "Lembut & Menenangkan (Healing)", prompt: "Buat nadanya sangat hangat, penuh kasih, dan menenangkan jiwa yang lelah" },
  { id: "rhyme", label: "Berima Sastra Estetis", prompt: "Susun dengan rima kalimat yang anggun dan ritmis saat dibaca" },
];

export const TextContentEditor: React.FC<TextContentEditorProps> = ({
  content,
  onChangeContent,
  typography,
  onChangeTypography,
  layout,
  onOpenAIModal,
  onQuickRewrite,
  isRewriting,
}) => {
  const [selectedRewriteStyle, setSelectedRewriteStyle] = useState(REWRITE_STYLES[0].prompt);
  const [showRewriteDropdown, setShowRewriteDropdown] = useState(false);

  const handleSetTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const dateStr = today.toLocaleDateString("id-ID", options);
    onChangeContent({ dateStamp: dateStr });
  };

  return (
    <div className="space-y-6">
      {/* AI Quick Polish Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/15 via-indigo-500/5 to-transparent p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-zinc-100 uppercase tracking-wider">
              Asisten AI Kata & Cerita
            </h4>
            <p className="text-[11px] text-zinc-400">
              Buat kutipan baru atau poles tulisanmu secara instan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={onOpenAIModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-all shadow-md shadow-indigo-600/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Generate Kata Baru</span>
          </button>
        </div>
      </div>

      {/* 1. Header Tag / Chapter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Tag className="h-3.5 w-3.5 text-indigo-400" />
            <span>Label / Header Kutipan</span>
          </label>
        </div>

        <input
          id="input-header-tag"
          type="text"
          value={content.headerTag}
          onChange={(e) => onChangeContent({ headerTag: e.target.value })}
          placeholder="Contoh: 01 // RENUNGAN PAGI"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
        />

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {HEADER_TAG_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChangeContent({ headerTag: preset })}
              className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-[11px] text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Header Icon / Logo Selector */}
        <div className="pt-3 space-y-1.5">
          <label className="text-[11px] font-medium text-zinc-400 flex items-center justify-between">
            <span>Ikon / Logo Header (Bisa Custom)</span>
            <span className="text-[10px] text-indigo-400">Pilih atau ketik emoji/symbol</span>
          </label>
          <div className="flex flex-wrap gap-1.5 items-center">
            {[
              { id: "sparkles", label: "Sparkles", icon: Sparkles },
              { id: "star", label: "Star", icon: Star },
              { id: "flame", label: "Flame", icon: Flame },
              { id: "heart", label: "Heart", icon: Heart },
              { id: "feather", label: "Feather", icon: Feather },
              { id: "compass", label: "Compass", icon: Compass },
              { id: "crown", label: "Crown", icon: Crown },
              { id: "leaf", label: "Leaf", icon: Leaf },
              { id: "music", label: "Music", icon: Music },
              { id: "book", label: "Book", icon: BookOpen },
              { id: "sun", label: "Sun", icon: Sun },
              { id: "moon", label: "Moon", icon: Moon },
              { id: "zap", label: "Zap", icon: Zap },
              { id: "coffee", label: "Coffee", icon: Coffee },
              { id: "none", label: "Tanpa Ikon", icon: null },
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = (content.headerIcon || "sparkles") === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeContent({ headerIcon: item.id })}
                  className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 font-medium"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  {IconComp && <IconComp className="h-3 w-3" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-1">
            <input
              type="text"
              value={["sparkles", "star", "flame", "heart", "feather", "compass", "crown", "leaf", "music", "book", "sun", "moon", "zap", "coffee", "none"].includes(content.headerIcon || "sparkles") ? "" : (content.headerIcon || "")}
              onChange={(e) => onChangeContent({ headerIcon: e.target.value })}
              placeholder="Atau ketik emoji / symbol custom (mis: 💎, ✦, ⚡, 🔥)..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Quote Text */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Type className="h-3.5 w-3.5 text-indigo-400" />
            <span>Isi Kutipan / Cerita Utama</span>
          </label>
          <span className="text-[11px] font-mono text-zinc-500">
            {content.mainQuote.length} karakter
          </span>
        </div>

        <div className="relative">
          <textarea
            id="input-main-quote"
            rows={5}
            value={content.mainQuote}
            onChange={(e) => onChangeContent({ mainQuote: e.target.value })}
            placeholder="Tuliskan kata motivasi, kisah inspiratif, atau renungan hidupmu di sini..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 p-3.5 text-sm leading-relaxed text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
          />
        </div>

        {/* AI Quick Polish Toolbar */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
            <Wand2 className="h-3 w-3 text-indigo-400" /> Poles Cepat AI:
          </span>
          {REWRITE_STYLES.map((style) => (
            <button
              key={style.id}
              disabled={isRewriting || !content.mainQuote.trim()}
              onClick={() => onQuickRewrite(style.prompt)}
              className="flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-medium text-indigo-300 hover:bg-indigo-500/25 hover:border-indigo-500/40 disabled:opacity-50 transition-all"
            >
              {isRewriting ? (
                <RefreshCw className="h-2.5 w-2.5 animate-spin" />
              ) : null}
              <span>{style.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Subtext / Reflection Commentary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
            Subteks / Catatan Refleksi (Opsional)
          </label>
        </div>
        <input
          id="input-subtext"
          type="text"
          value={content.subtext}
          onChange={(e) => onChangeContent({ subtext: e.target.value })}
          placeholder="Contoh: Belajar menerima apa yang tak bisa diubah, merawat apa yang ada."
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
        />
      </div>

      {/* 4. Highlight Word Feature */}
      <div className="space-y-2 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
            <Highlighter className="h-3.5 w-3.5 text-indigo-400" />
            <span>Sorot Kata Kunci (Highlight Accent)</span>
          </label>
        </div>
        <div className="flex gap-2">
          <input
            id="input-highlight-word"
            type="text"
            value={typography.highlightWord || ""}
            onChange={(e) => onChangeTypography({ highlightWord: e.target.value })}
            placeholder="Ketik kata dari kutipan untuk disorot (misal: 'prosesmu')"
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5">
            {["#fbbf24", "#f43f5e", "#38bdf8", "#34d399", "#818cf8"].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChangeTypography({ highlightColor: color })}
                style={{ backgroundColor: color }}
                className={`h-6 w-6 rounded-full border-2 transition-transform ${
                  typography.highlightColor === color
                    ? "border-white scale-110 shadow-md"
                    : "border-transparent opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 5. Author, Watermark & Date Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Author / Pen Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <User className="h-3.5 w-3.5 text-zinc-400" />
            <span>Penulis / Atribusi</span>
          </label>
          <input
            id="input-author"
            type="text"
            value={content.author}
            onChange={(e) => onChangeContent({ author: e.target.value })}
            placeholder="Contoh: Marcus Aurelius / Catatan Hati"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        {/* Watermark / IG Handle */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <AtSign className="h-3.5 w-3.5 text-zinc-400" />
            <span>Watermark / Akun Sosmed</span>
          </label>
          <input
            id="input-watermark"
            type="text"
            value={content.watermark}
            onChange={(e) => onChangeContent({ watermark: e.target.value })}
            placeholder="Contoh: @katacerita.id"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 6. Date Stamp */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            <span>Tanggal / Waktu</span>
          </label>
          <button
            type="button"
            onClick={handleSetTodayDate}
            className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Set Hari Ini
          </button>
        </div>
        <input
          id="input-date-stamp"
          type="text"
          value={content.dateStamp}
          onChange={(e) => onChangeContent({ dateStamp: e.target.value })}
          placeholder="Contoh: 03 September 2026"
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* 7. Spotify / Twitter Specific Fields (Conditional) */}
      {layout === "spotify-music-player" && (
        <div className="space-y-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
            Pengaturan Pemutar Musik Spotify
          </h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-[11px] text-zinc-300 font-medium">
                Judul Lagu
              </label>
              <input
                type="text"
                value={content.spotifySong || ""}
                onChange={(e) => onChangeContent({ spotifySong: e.target.value })}
                placeholder="Contoh: Runtuh (Acoustic Reflection)"
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100"
              />
            </div>
            <div>
              <label className="text-[11px] text-zinc-300 font-medium">
                Artis / Penyanyi
              </label>
              <input
                type="text"
                value={content.spotifyArtist || ""}
                onChange={(e) => onChangeContent({ spotifyArtist: e.target.value })}
                placeholder="Contoh: Feby Putri, Fiersa Besari"
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100"
              />
            </div>
          </div>
        </div>
      )}

      {layout === "twitter-tweet-card" && (
        <div className="space-y-3 rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
          <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Pengaturan Postingan Twitter / X
          </h4>
          <div>
            <label className="text-[11px] text-zinc-300 font-medium">
              Jumlah Like (Interaksi)
            </label>
            <input
              type="text"
              value={content.likesCount || "24.5K"}
              onChange={(e) => onChangeContent({ likesCount: e.target.value })}
              placeholder="Contoh: 24.5K atau 18,230"
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};
