import React, { useState } from "react";
import { CuratedQuote, QuoteContent } from "../types";
import { CATEGORIES, PRESET_QUOTES } from "../data/presetQuotes";
import { BookOpen, X, Search, Check, Tag } from "lucide-react";

interface QuoteBankModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuote: (quote: Partial<QuoteContent>) => void;
}

export const QuoteBankModal: React.FC<QuoteBankModalProps> = ({
  isOpen,
  onClose,
  onSelectQuote,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredQuotes = PRESET_QUOTES.filter((q) => {
    const matchCategory =
      selectedCategory === "Semua" || q.category === selectedCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      q.mainQuote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.subtext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.headerTag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Bank Kutipan & Inspirasi Sastra
              </h3>
              <p className="text-xs text-zinc-400">
                Koleksi kurasi kata motivasi, stoikisme, dan renungan kehidupan
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

        {/* Search Bar & Category Filter */}
        <div className="border-b border-zinc-800/80 bg-zinc-900/30 p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kutipan berdasarkan kata kunci, topik, atau penulis..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/90 pl-10 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 no-scrollbar max-h-20 overflow-y-auto">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white font-semibold shadow-sm"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Quotes List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {filteredQuotes.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              Tidak ada kutipan yang cocok dengan pencarian Anda.
            </div>
          ) : (
            filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-indigo-400 tracking-wider uppercase">
                    {q.headerTag}
                  </span>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400">
                    {q.moodTag}
                  </span>
                </div>

                <p className="text-sm font-medium text-zinc-100 leading-relaxed italic">
                  "{q.mainQuote}"
                </p>

                {q.subtext && (
                  <p className="mt-2 text-xs text-zinc-400 font-sans">
                    {q.subtext}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-zinc-800/60 pt-2 text-xs">
                  <span className="text-zinc-400 font-medium">
                    — {q.author}
                  </span>
                  <button
                    onClick={() => {
                      onSelectQuote({
                        headerTag: q.headerTag,
                        mainQuote: q.mainQuote,
                        subtext: q.subtext,
                        author: q.author,
                      });
                      onClose();
                    }}
                    className="flex items-center gap-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-3 py-1 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <Check className="h-3 w-3" />
                    <span>Gunakan</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
