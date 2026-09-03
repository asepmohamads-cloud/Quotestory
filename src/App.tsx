import React, { useState, useRef, useEffect } from "react";
import {
  AspectRatioType,
  BackgroundConfig,
  LayoutStyleType,
  PresetTheme,
  QuoteContent,
  SavedDraft,
  TypographyConfig,
} from "./types";
import { PRESET_THEMES } from "./data/presetThemes";
import { PRESET_QUOTES } from "./data/presetQuotes";
import { Header } from "./components/Header";
import { CanvasPreview } from "./components/CanvasPreview";
import { TextContentEditor } from "./components/TextContentEditor";
import { ThemeSelector } from "./components/ThemeSelector";
import { BackgroundControls } from "./components/BackgroundControls";
import { TypographyControls } from "./components/TypographyControls";
import { LayoutCardControls } from "./components/LayoutCardControls";
import { AIGeneratorModal } from "./components/AIGeneratorModal";
import { QuoteBankModal } from "./components/QuoteBankModal";
import { ExportModal } from "./components/ExportModal";
import { SavedDraftsModal } from "./components/SavedDraftsModal";
import {
  Type,
  Palette,
  Image as ImageIcon,
  Sliders,
  Layout,
  BookmarkCheck,
  Sparkles,
  Shuffle,
  Volume2,
  VolumeX,
} from "lucide-react";

export default function App() {
  // Canvas Target Ref for image exporting
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initial Content State
  const [content, setContent] = useState<QuoteContent>({
    headerTag: "01 // RENUNGAN HARI INI",
    headerIcon: "sparkles",
    mainQuote:
      "Jangan bandingkan prosesmu dengan orang lain. Bunga tidak mekar bersamaan, namun masing-masing tetap indah pada waktunya.",
    subtext: "Konsistensi kecil setiap hari akan melipatgandakan hasil di masa depan.",
    author: "Catatan Perjalanan",
    watermark: "@katacerita.id",
    dateStamp: "03 September 2026",
    spotifySong: "Runtuh (Acoustic Reflection)",
    spotifyArtist: "Feby Putri, Fiersa Besari",
    likesCount: "24.5K",
  });

  // Current Theme / Styling State (default to Dark Stoic)
  const [currentThemeId, setCurrentThemeId] = useState<string>("theme-dark-stoic");
  const [layout, setLayout] = useState<LayoutStyleType>("editorial-minimal");
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("9:16");

  const [background, setBackground] = useState<BackgroundConfig>({
    type: "gradient",
    value: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
    overlayColor: "rgba(0,0,0,0.3)",
    overlayOpacity: 0.3,
    blur: 0,
    hasGrain: true,
    hasVignette: true,
  });

  const [typography, setTypography] = useState<TypographyConfig>({
    fontFamily: "Cormorant Garamond",
    headerFontFamily: "Space Mono",
    fontSize: 28,
    lineHeight: 1.6,
    letterSpacing: 0.5,
    textAlign: "center",
    isUppercase: false,
    isItalic: false,
    fontWeight: "medium",
    textColor: "#f4f4f5",
    headerColor: "#fbbf24",
    subtextColor: "#a1a1aa",
    authorColor: "#e4e4e7",
    highlightColor: "#fbbf24",
    showQuoteMarks: true,
    quoteMarkStyle: "classic",
  });

  // Active Editor Tab on Desktop/Mobile
  const [activeTab, setActiveTab] = useState<
    "content" | "theme" | "background" | "typography" | "layout"
  >("content");

  // Modals
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isQuoteBankOpen, setIsQuoteBankOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isDraftsOpen, setIsDraftsOpen] = useState(false);

  // Quick Rewrite Loading
  const [isRewriting, setIsRewriting] = useState(false);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Saved Drafts Local Storage
  const [savedDrafts, setSavedDrafts] = useState<SavedDraft[]>(() => {
    try {
      const saved = localStorage.getItem("quotestory_drafts");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("quotestory_drafts", JSON.stringify(savedDrafts));
    } catch (e) {
      console.error("Failed to persist drafts:", e);
    }
  }, [savedDrafts]);

  // Apply a Preset Theme
  const handleSelectTheme = (theme: PresetTheme) => {
    setCurrentThemeId(theme.id);
    setLayout(theme.layout);
    setBackground(theme.background);
    setTypography(theme.typography);
    setAspectRatio(theme.aspectRatio);
    if (theme.sampleQuote) {
      setContent((prev) => ({ ...prev, ...theme.sampleQuote }));
    }
    showToast(`Tema "${theme.name}" berhasil diterapkan! ✨`);
  };

  // Randomize Theme and Quote
  const handleRandomize = () => {
    const randomTheme =
      PRESET_THEMES[Math.floor(Math.random() * PRESET_THEMES.length)];
    const randomQuote =
      PRESET_QUOTES[Math.floor(Math.random() * PRESET_QUOTES.length)];

    setCurrentThemeId(randomTheme.id);
    setLayout(randomTheme.layout);
    setBackground(randomTheme.background);
    setTypography(randomTheme.typography);
    setAspectRatio(randomTheme.aspectRatio);

    setContent((prev) => ({
      ...prev,
      headerTag: randomQuote.headerTag,
      mainQuote: randomQuote.mainQuote,
      subtext: randomQuote.subtext,
      author: randomQuote.author,
    }));

    showToast("Inspirasi acak baru siap dikreasikan! 🎲");
  };

  // Quick AI Rewrite
  const handleQuickRewrite = async (styleInstruction: string) => {
    if (!content.mainQuote.trim()) return;
    setIsRewriting(true);
    try {
      const response = await fetch("/api/rewrite-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentText: content.mainQuote,
          style: styleInstruction,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success && data.data?.rewrittenText) {
        setContent((prev) => ({ ...prev, mainQuote: data.data.rewrittenText }));
        showToast("Teks kutipan berhasil dipoles dengan AI! ✨");
      } else {
        throw new Error(data.error || "Gagal memoles teks.");
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Gagal memoles teks dengan AI.");
    } finally {
      setIsRewriting(false);
    }
  };

  // Save current design to local storage
  const handleSaveCurrentDraft = () => {
    const newDraft: SavedDraft = {
      id: `draft-${Date.now()}`,
      createdAt: Date.now(),
      content,
      background,
      typography,
      layout,
      aspectRatio,
    };
    setSavedDrafts((prev) => [newDraft, ...prev]);
    showToast("Desain berhasil disimpan ke koleksi! 🔖");
  };

  // Load draft
  const handleLoadDraft = (draft: SavedDraft) => {
    setContent(draft.content);
    setBackground(draft.background);
    setTypography(draft.typography);
    setLayout(draft.layout);
    setAspectRatio(draft.aspectRatio);
    showToast("Draft berhasil dimuat ke editor!");
  };

  // Delete draft
  const handleDeleteDraft = (id: string) => {
    setSavedDrafts((prev) => prev.filter((d) => d.id !== id));
    showToast("Draft dihapus dari koleksi.");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 bg-bento-dots">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-indigo-500/40 bg-zinc-900/95 px-4 py-3 text-xs font-semibold text-indigo-300 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5">
          <BookmarkCheck className="h-4 w-4 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* App Header Navigation */}
      <Header
        onOpenAIModal={() => setIsAIModalOpen(true)}
        onOpenQuoteBank={() => setIsQuoteBankOpen(true)}
        onOpenDrafts={() => setIsDraftsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onRandomize={handleRandomize}
        savedDraftsCount={savedDrafts.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Bento Grid Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
        {/* Bento Top Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-md flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">AI Generator</span>
              <span className="text-xs font-semibold text-zinc-200">Gemini 3.8 Flash</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-md flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Palette className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Preset Tema</span>
              <span className="text-xs font-semibold text-zinc-200">8 Format Estetis</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-md flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Type className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Tipografi</span>
              <span className="text-xs font-semibold text-zinc-200">12 Font Sastra</span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-3.5 backdrop-blur-md flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
              <BookmarkCheck className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block">Koleksi Draft</span>
              <span className="text-xs font-semibold text-zinc-200">{savedDrafts.length} Tersimpan</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          {/* LEFT BENTO CELL: Live Interactive Canvas Stage */}
          <section className="lg:col-span-6 xl:col-span-7 flex flex-col rounded-3xl border border-zinc-800/80 bg-zinc-900/30 p-5 sm:p-7 backdrop-blur-xl shadow-2xl lg:sticky lg:top-20">
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Pratinjau Kanvas (Live Bento Stage)
                </span>
              </div>
              <button
                onClick={handleSaveCurrentDraft}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-700 hover:text-zinc-100 transition-colors shadow-sm"
              >
                <BookmarkCheck className="h-3.5 w-3.5 text-indigo-400" />
                <span>Simpan Draft</span>
              </button>
            </div>

            {/* The Canvas Component */}
            <CanvasPreview
              ref={canvasRef}
              content={content}
              background={background}
              typography={typography}
              layout={layout}
              aspectRatio={aspectRatio}
              onChangeAspectRatio={setAspectRatio}
            />

            {/* Canvas Bottom Helper Tips */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-zinc-500 font-medium pt-3 border-t border-zinc-800/60">
              <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-indigo-400" /> Resolusi Tinggi Ultra HD</span>
              <span>•</span>
              <span>📱 Siap TikTok, IG & Reels</span>
              <span>•</span>
              <span>🎨 Font Google & Warna Asli</span>
            </div>
          </section>

          {/* RIGHT BENTO CELL: Controls & Tools Suite */}
          <section className="lg:col-span-6 xl:col-span-5 flex flex-col space-y-4">
            {/* Desktop Bento Segmented Navigation Tabs */}
            <div className="hidden sm:flex rounded-2xl border border-zinc-800 bg-zinc-900/90 p-1.5 shadow-md">
              {[
                { id: "content", label: "Teks & Cerita", icon: Type },
                { id: "theme", label: "Pilihan Tema", icon: Palette },
                { id: "background", label: "Background", icon: ImageIcon },
                { id: "typography", label: "Tipografi", icon: Sliders },
                { id: "layout", label: "Tata Letak", icon: Layout },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-xl py-2 px-1 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/25"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Panels Bento Container */}
            <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-xl shadow-xl">
              {/* TAB 1: TEXT CONTENT */}
              {activeTab === "content" && (
                <TextContentEditor
                  content={content}
                  onChangeContent={(updated) =>
                    setContent((prev) => ({ ...prev, ...updated }))
                  }
                  typography={typography}
                  onChangeTypography={(updated) =>
                    setTypography((prev) => ({ ...prev, ...updated }))
                  }
                  layout={layout}
                  onOpenAIModal={() => setIsAIModalOpen(true)}
                  onQuickRewrite={handleQuickRewrite}
                  isRewriting={isRewriting}
                />
              )}

              {/* TAB 2: THEME PRESETS */}
              {activeTab === "theme" && (
                <ThemeSelector
                  currentThemeId={currentThemeId}
                  onSelectTheme={handleSelectTheme}
                />
              )}

              {/* TAB 3: BACKGROUND & OVERLAYS */}
              {activeTab === "background" && (
                <BackgroundControls
                  background={background}
                  onChangeBackground={(updated) =>
                    setBackground((prev) => ({ ...prev, ...updated }))
                  }
                />
              )}

              {/* TAB 4: TYPOGRAPHY CONTROLS */}
              {activeTab === "typography" && (
                <TypographyControls
                  typography={typography}
                  onChangeTypography={(updated) =>
                    setTypography((prev) => ({ ...prev, ...updated }))
                  }
                />
              )}

              {/* TAB 5: LAYOUT CONTROLS */}
              {activeTab === "layout" && (
                <LayoutCardControls
                  layout={layout}
                  onChangeLayout={(newLayout) => {
                    setLayout(newLayout);
                    showToast(`Tata letak diubah ke "${newLayout}"`);
                  }}
                />
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="w-full border-t border-zinc-800/80 bg-zinc-950/80 py-4 text-center text-xs text-zinc-400">
        Copyright © asepmohamads
      </footer>

      {/* Interactive Modals */}
      <AIGeneratorModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onApplyQuote={(quote) => {
          setContent((prev) => ({ ...prev, ...quote }));
          showToast("Kutipan dari AI berhasil dipasang di kanvas! ✨");
        }}
        currentQuoteText={content.mainQuote}
      />

      <QuoteBankModal
        isOpen={isQuoteBankOpen}
        onClose={() => setIsQuoteBankOpen(false)}
        onSelectQuote={(quote) => {
          setContent((prev) => ({ ...prev, ...quote }));
          showToast("Kutipan berhasil diterapkan ke editor! 📖");
        }}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        content={content}
        canvasRef={canvasRef}
        background={background}
      />

      <SavedDraftsModal
        isOpen={isDraftsOpen}
        onClose={() => setIsDraftsOpen(false)}
        drafts={savedDrafts}
        onLoadDraft={handleLoadDraft}
        onDeleteDraft={handleDeleteDraft}
        onSaveCurrentDraft={handleSaveCurrentDraft}
      />
    </div>
  );
}
