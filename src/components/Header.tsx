import React from "react";
import {
  Sparkles,
  Shuffle,
  BookOpen,
  Bookmark,
  Download,
  Share2,
  Sliders,
  Type,
  Image as ImageIcon,
  Palette,
  Layout,
} from "lucide-react";

interface HeaderProps {
  onOpenAIModal: () => void;
  onOpenQuoteBank: () => void;
  onOpenDrafts: () => void;
  onOpenExport: () => void;
  onRandomize: () => void;
  savedDraftsCount: number;
  activeTab: "content" | "theme" | "background" | "typography" | "layout";
  setActiveTab: (tab: "content" | "theme" | "background" | "typography" | "layout") => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAIModal,
  onOpenQuoteBank,
  onOpenDrafts,
  onOpenExport,
  onRandomize,
  savedDraftsCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="QuoteStory Studio Logo" 
            className="h-12 sm:h-14 w-auto object-contain drop-shadow-md"
            onError={(e) => {
              // Fallback jika gambar belum diunggah
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallbackText = document.createElement('h1');
                fallbackText.className = "font-['Playfair_Display'] text-lg font-bold tracking-tight text-zinc-100 sm:text-xl";
                fallbackText.innerHTML = 'QuoteStory <span className="text-indigo-400 font-mono text-[11px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">Studio</span>';
                parent.appendChild(fallbackText);
              }
            }}
          />
        </div>

        {/* Center: Action Shortcuts */}
        <div className="hidden md:flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 p-1 shadow-inner">
          <button
            id="btn-ai-generator-header"
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600/30 to-violet-600/30 px-3.5 py-1.5 text-xs font-medium text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 hover:text-white transition-all duration-200 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Tulis dengan AI</span>
          </button>

          <button
            id="btn-quote-bank-header"
            onClick={onOpenQuoteBank}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-400" />
            <span>Bank Kutipan</span>
          </button>

          <button
            id="btn-randomize-header"
            onClick={onRandomize}
            title="Kombinasi tema & kata acak"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all"
          >
            <Shuffle className="h-3.5 w-3.5 text-zinc-400" />
            <span>Inspirasi Acak</span>
          </button>
        </div>

        {/* Right: Actions & Export */}
        <div className="flex items-center gap-2">
          <button
            id="btn-saved-drafts-header"
            onClick={onOpenDrafts}
            className="relative flex items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/80 p-2.5 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-all"
            title="Koleksi Tersimpan"
          >
            <Bookmark className="h-4 w-4" />
            {savedDraftsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white shadow-sm">
                {savedDraftsCount}
              </span>
            )}
          </button>

          <button
            id="btn-open-export-modal"
            onClick={onOpenExport}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/35 transition-all duration-200"
          >
            <Download className="h-4 w-4" />
            <span className="font-semibold">Unduh Estetis</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Subnav Tabs */}
      <div className="flex items-center justify-between border-t border-zinc-800/60 px-4 py-2 sm:hidden overflow-x-auto no-scrollbar gap-2 bg-zinc-950/60">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeTab === "content"
              ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Type className="h-3.5 w-3.5" />
          <span>Teks</span>
        </button>
        <button
          onClick={() => setActiveTab("theme")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeTab === "theme"
              ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>Tema</span>
        </button>
        <button
          onClick={() => setActiveTab("background")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeTab === "background"
              ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5" />
          <span>Background</span>
        </button>
        <button
          onClick={() => setActiveTab("typography")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeTab === "typography"
              ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Tipografi</span>
        </button>
        <button
          onClick={() => setActiveTab("layout")}
          className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium ${
            activeTab === "layout"
              ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          <Layout className="h-3.5 w-3.5" />
          <span>Tata Letak</span>
        </button>
      </div>
    </header>
  );
};
