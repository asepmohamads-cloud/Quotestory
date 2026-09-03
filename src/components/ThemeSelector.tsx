import React from "react";
import { PresetTheme } from "../types";
import { PRESET_THEMES } from "../data/presetThemes";
import { Check, Sparkles, Palette } from "lucide-react";

interface ThemeSelectorProps {
  currentThemeId?: string;
  onSelectTheme: (theme: PresetTheme) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentThemeId,
  onSelectTheme,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
            <Palette className="h-4 w-4 text-indigo-400" />
            <span>Pilihan Tema Estetis Siap Pakai</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Terapkan kombinasi font, background, dan tata letak dalam 1-klik
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PRESET_THEMES.map((theme) => {
          const isSelected = currentThemeId === theme.id;
          return (
            <div
              key={theme.id}
              onClick={() => onSelectTheme(theme)}
              className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500 bg-zinc-900/90 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500/50"
                  : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70"
              }`}
            >
              {/* Header & Checkmark */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                    {theme.name}
                  </h4>
                  <p className="mt-1 text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {theme.description}
                  </p>
                </div>

                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold shadow-sm"
                      : "border border-zinc-700 bg-zinc-800 text-transparent group-hover:border-zinc-500"
                  }`}
                >
                  <Check className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Tags & Badges */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-zinc-800/60">
                <span className="rounded-md bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 uppercase">
                  {theme.layout}
                </span>
                <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                  {theme.aspectRatio}
                </span>
                {theme.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-zinc-800/60 px-1.5 py-0.5 text-[10px] text-zinc-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
