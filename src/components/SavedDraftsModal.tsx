import React from "react";
import { SavedDraft } from "../types";
import { Bookmark, Trash2, X, RotateCcw, Plus } from "lucide-react";

interface SavedDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: SavedDraft[];
  onLoadDraft: (draft: SavedDraft) => void;
  onDeleteDraft: (id: string) => void;
  onSaveCurrentDraft: () => void;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  isOpen,
  onClose,
  drafts,
  onLoadDraft,
  onDeleteDraft,
  onSaveCurrentDraft,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                Koleksi Draft Tersimpan
              </h3>
              <p className="text-xs text-zinc-400">
                {drafts.length} karya disimpan di penyimpanan lokal browser
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

        {/* Action Toolbar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/30 px-6 py-3">
          <button
            onClick={() => {
              onSaveCurrentDraft();
            }}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Simpan Desain Saat Ini</span>
          </button>
        </div>

        {/* Drafts List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 no-scrollbar">
          {drafts.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              Belum ada desain yang disimpan. Klik tombol "Simpan Desain Saat Ini" untuk menyimpan karya favoritmu.
            </div>
          ) : (
            drafts.map((draft) => (
              <div
                key={draft.id}
                className="group flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all"
              >
                <div className="flex-1 pr-4 overflow-hidden">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      {draft.content.headerTag || "DRAFT KUTIPAN"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(draft.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <p className="truncate text-xs font-medium text-zinc-200">
                    "{draft.content.mainQuote}"
                  </p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    — {draft.content.author} · {draft.layout} · {draft.aspectRatio}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onLoadDraft(draft);
                      onClose();
                    }}
                    className="flex items-center gap-1 rounded-xl bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-indigo-600 hover:text-white transition-all"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Buka</span>
                  </button>

                  <button
                    onClick={() => onDeleteDraft(draft.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-zinc-800 text-zinc-400 hover:bg-rose-950 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
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
