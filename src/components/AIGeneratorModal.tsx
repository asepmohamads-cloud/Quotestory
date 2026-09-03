import React, { useState } from "react";
import { QuoteContent } from "../types";
import {
  Sparkles,
  X,
  Wand2,
  RefreshCw,
  Check,
  Tag,
  MessageSquareQuote,
  Feather,
  Layers,
  Plus,
} from "lucide-react";

interface AIGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyQuote: (quote: Partial<QuoteContent>) => void;
  currentQuoteText: string;
}

const AI_CATEGORIES = [
  "Renungan Kehidupan",
  "Motivasi Kerja & Sukses",
  "Stoikisme & Filosofi",
  "Healing & Ketenangan",
  "Cinta & Hubungan Dewasa",
  "Senja & Puisi Malam",
  "Spiritual & Rasa Syukur",
];

const MOODS = [
  "Tenang & Reflektif",
  "Bersemangat & Tegas",
  "Puitis & Sastra",
  "Hangat & Lembut",
  "Mendalam & Stoik",
  "Nostalgia & Melankolis",
];

const FORMATS = [
  "Kutipan 2-4 Baris Puitis",
  "Punchline Tajam & Singkat 1 Baris",
  "Cerita Refleksi / Micro-Essay",
  "Sajak Rima Estetis",
];

export const AIGeneratorModal: React.FC<AIGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApplyQuote,
  currentQuoteText,
}) => {
  const [activeTab, setActiveTab] = useState<"generate" | "rewrite">("generate");
  const [categories, setCategories] = useState<string[]>(AI_CATEGORIES);
  const [category, setCategory] = useState(AI_CATEGORIES[0]);
  const [customCategoryInput, setCustomCategoryInput] = useState<string>("");
  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(false);

  const handleAddCustomCategory = () => {
    const trimmed = customCategoryInput.trim();
    if (!trimmed) return;
    if (!categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
    }
    setCategory(trimmed);
    setCustomCategoryInput("");
    setIsAddingCategory(false);
  };
  const [mood, setMood] = useState(MOODS[0]);
  const [format, setFormat] = useState(FORMATS[0]);
  const [customTopic, setCustomTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedQuotes, setGeneratedQuotes] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeNotice, setActiveNotice] = useState<string | null>(null);

  // Rewrite Tab State
  const [rewriteText, setRewriteText] = useState(currentQuoteText || "");
  const [rewriteStyle, setRewriteStyle] = useState("Buat lebih mendalam, puitis, dan memiliki resonansi sastra yang kuat");
  const [rewriteResult, setRewriteResult] = useState<any | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setActiveNotice(null);
    try {
      const response = await fetch("/api/generate-quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          mood,
          format,
          customTopic,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menghasilkan kutipan dari AI.");
      }
      setGeneratedQuotes(data.data || []);
      if (data.notice) {
        setActiveNotice(data.notice);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Terjadi kendala sementara pada koneksi AI. Silakan coba sesaat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRewrite = async () => {
    if (!rewriteText.trim()) return;
    setIsRewriting(true);
    setErrorMessage(null);
    setActiveNotice(null);
    try {
      const response = await fetch("/api/rewrite-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentText: rewriteText,
          style: rewriteStyle,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menulis ulang dengan AI.");
      }
      setRewriteResult(data.data);
      if (data.notice) {
        setActiveNotice(data.notice);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Terjadi kendala saat memoles teks. Silakan coba lagi.");
    } finally {
      setIsRewriting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                AI Kata & Cerita Sastra
              </h3>
              <p className="text-xs text-zinc-400">
                Didukung oleh Google Gemini 3.8 Flash
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800/80 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Subtabs */}
        <div className="flex border-b border-zinc-800/80 bg-zinc-900/30 px-6 pt-3">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex items-center gap-2 border-b-2 px-4 pb-3 text-xs font-semibold transition-all ${
              activeTab === "generate"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Buat Kutipan Baru</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("rewrite");
              if (!rewriteText && currentQuoteText) {
                setRewriteText(currentQuoteText);
              }
            }}
            className={`flex items-center gap-2 border-b-2 px-4 pb-3 text-xs font-semibold transition-all ${
              activeTab === "rewrite"
                ? "border-indigo-500 text-indigo-300"
                : "border-transparent text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Wand2 className="h-3.5 w-3.5" />
            <span>Poles & Tulis Ulang Teks</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 no-scrollbar">
          {errorMessage && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3.5 text-xs text-rose-300">
              {errorMessage}
            </div>
          )}

          {activeTab === "generate" && (
            <div className="space-y-4">
              {/* Category Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Pilih Kategori (Bisa Custom)
                  </label>
                  {!isAddingCategory ? (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(true)}
                      className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Tambah Kategori Custom</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="text-[11px] font-medium text-zinc-400 hover:text-zinc-200"
                    >
                      Batal
                    </button>
                  )}
                </div>

                {isAddingCategory && (
                  <div className="flex gap-2 rounded-xl border border-indigo-500/30 bg-zinc-900 p-2">
                    <input
                      type="text"
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddCustomCategory();
                        }
                      }}
                      placeholder="Ketik nama kategori custom baru (mis: Eksistensialisme Malam)..."
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomCategory}
                      disabled={!customCategoryInput.trim()}
                      className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-50 transition-all"
                    >
                      Tambah
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                        category === cat
                          ? "bg-indigo-600 text-white font-semibold shadow-sm"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mood & Format Row */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Suasana Hati (Mood)
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {MOODS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Format / Struktur
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  >
                    {FORMATS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Custom Prompt Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Ide / Topik Khusus (Opsional)
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Misal: 'Tentang seseorang yang lelah bekerja tapi tetap berusaha demi keluarga'"
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Generate CTA Button */}
              <button
                id="btn-generate-ai-action"
                onClick={handleGenerate}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Gemini AI Sedang Meracik Kata-Kata Indah...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate 3 Variasi Kutipan Estetis</span>
                  </>
                )}
              </button>

              {/* Notice Banner */}
              {activeNotice && (
                <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2.5 text-xs text-indigo-200">
                  <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span>{activeNotice}</span>
                </div>
              )}

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                  <span>{errorMessage}</span>
                  <button
                    onClick={handleGenerate}
                    className="shrink-0 rounded-lg bg-rose-500/20 px-2.5 py-1 font-semibold text-rose-300 hover:bg-rose-500/30"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {/* Results Display */}
              {generatedQuotes.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Feather className="h-3.5 w-3.5" />
                    <span>Hasil Kutipan AI (Pilih untuk Diterapkan):</span>
                  </h4>

                  <div className="space-y-3">
                    {generatedQuotes.map((q, idx) => (
                      <div
                        key={idx}
                        className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">
                            {q.headerTag}
                          </span>
                          <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                            {q.vibeTag || "Aesthetic"}
                          </span>
                        </div>

                        <p className="text-sm font-medium text-zinc-100 leading-relaxed italic">
                          "{q.quoteText}"
                        </p>

                        {q.subtext && (
                          <p className="mt-2 text-xs text-zinc-400">
                            {q.subtext}
                          </p>
                        )}

                        <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-2 text-xs">
                          <span className="text-zinc-400 font-medium">
                            — {q.author}
                          </span>
                          <button
                            onClick={() => {
                              onApplyQuote({
                                headerTag: q.headerTag,
                                mainQuote: q.quoteText,
                                subtext: q.subtext,
                                author: q.author,
                              });
                              onClose();
                            }}
                            className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Terapkan</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "rewrite" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Teks yang Ingin Dipoles / Ditulis Ulang
                </label>
                <textarea
                  rows={4}
                  value={rewriteText}
                  onChange={(e) => setRewriteText(e.target.value)}
                  placeholder="Ketik atau tempel teks kutipan di sini..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-xs leading-relaxed text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Arah Poles Sastra (Gaya)
                </label>
                <input
                  type="text"
                  value={rewriteStyle}
                  onChange={(e) => setRewriteStyle(e.target.value)}
                  placeholder="Contoh: Buat lebih puitis, ringkas, atau gaya stoik..."
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleRewrite}
                disabled={isRewriting || !rewriteText.trim()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 transition-all"
              >
                {isRewriting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Gemini AI Sedang Menulis Ulang...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    <span>Poles dengan AI</span>
                  </>
                )}
              </button>

              {/* Rewrite Notice Banner */}
              {activeNotice && (
                <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2.5 text-xs text-indigo-200">
                  <Sparkles className="h-4 w-4 shrink-0 text-indigo-400" />
                  <span>{activeNotice}</span>
                </div>
              )}

              {/* Rewrite Error Alert */}
              {errorMessage && (
                <div className="flex items-center justify-between gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-200">
                  <span>{errorMessage}</span>
                  <button
                    onClick={handleRewrite}
                    className="shrink-0 rounded-lg bg-rose-500/20 px-2.5 py-1 font-semibold text-rose-300 hover:bg-rose-500/30"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {rewriteResult && (
                <div className="rounded-2xl border border-indigo-500/40 bg-indigo-500/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400">
                      Hasil Poles AI:
                    </span>
                  </div>

                  <p className="text-sm font-medium text-zinc-100 leading-relaxed italic">
                    "{rewriteResult.rewrittenText}"
                  </p>

                  {rewriteResult.explanation && (
                    <p className="text-xs text-zinc-400">
                      Catatan: {rewriteResult.explanation}
                    </p>
                  )}

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => {
                        onApplyQuote({ mainQuote: rewriteResult.rewrittenText });
                        onClose();
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>Gunakan Teks Ini</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
