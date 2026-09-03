import React from "react";
import { LayoutStyleType } from "../types";
import {
  Layout,
  Music2,
  Twitter,
  Image,
  BookOpen,
  SplitSquareVertical,
  Terminal,
  Megaphone,
  Compass,
  Layers,
  Cpu,
  FileText,
  Sparkles,
  Scroll,
  Check,
} from "lucide-react";

interface LayoutCardControlsProps {
  layout: LayoutStyleType;
  onChangeLayout: (layout: LayoutStyleType) => void;
}

const LAYOUT_OPTIONS: {
  id: LayoutStyleType;
  name: string;
  desc: string;
  icon: any;
  badge: string;
}[] = [
  {
    id: "editorial-minimal",
    name: "Editorial Minimalis",
    desc: "Desain majalah sastra bersih dengan garis pemisah tipis dan aksen chapter.",
    icon: BookOpen,
    badge: "Populer",
  },
  {
    id: "card-glassmorphism",
    name: "Frosted Glassmorphism",
    desc: "Kartu kaca buram melayang dengan sudut membulat dan pencahayaan lembut.",
    icon: Layout,
    badge: "Modern",
  },
  {
    id: "spotify-music-player",
    name: "Spotify Player & Lirik",
    desc: "Tampilan pemutar musik lengkap dengan bar durasi dan tombol pemutar lagu.",
    icon: Music2,
    badge: "Viral",
  },
  {
    id: "twitter-tweet-card",
    name: "Viral Tweet / X Post",
    desc: "Format postingan media sosial dengan avatar akun, centang biru, dan statistik interaksi.",
    icon: Twitter,
    badge: "Trending",
  },
  {
    id: "polaroid-vintage",
    name: "Polaroid Vintage Photo",
    desc: "Bingkai foto polaroid klasik dengan tulisan tangan personal di bagian bawah.",
    icon: Image,
    badge: "Aesthetic",
  },
  {
    id: "split-frame-quote",
    name: "Split Frame Accent",
    desc: "Kutipan dengan garis aksen vertikal tebal dan penataan yang terstruktur rapi.",
    icon: SplitSquareVertical,
    badge: "Clean",
  },
  {
    id: "poetry-typewriter",
    name: "Mesin Tik Klasik",
    desc: "Gaya ketikan mesin tik vintage berstempel tanggal untuk puisi dan sajak harian.",
    icon: Terminal,
    badge: "Retro",
  },
  {
    id: "modern-statement",
    name: "Bold Statement Headline",
    desc: "Tipografi display raksasa dengan dampak visual tinggi untuk kata-kata penegas.",
    icon: Megaphone,
    badge: "Impactful",
  },
  {
    id: "minimalist-zen-frame",
    name: "Bingkai Zen Minimalis",
    desc: "Tata letak meditasi dengan titik fokus tengah, ruang negatif luas, dan estetika Zen.",
    icon: Compass,
    badge: "Zen",
  },
  {
    id: "neumorphic-soft-card",
    name: "Soft Neumorphism 3D",
    desc: "Gaya kartu soft-ui dengan bayangan timbul dan cekung bertekstur halus.",
    icon: Layers,
    badge: "Soft UI",
  },
  {
    id: "cyberpunk-hologram",
    name: "Cyberpunk Terminal Sci-Fi",
    desc: "Tampilan matriks digital futuristik dengan border neon dan kode status sistem.",
    icon: Cpu,
    badge: "Futuristic",
  },
  {
    id: "magazine-cover-headline",
    name: "Cover Majalah Mode",
    desc: "Tata letak sampul majalah eksklusif lengkap dengan nomor edisi dan header box.",
    icon: FileText,
    badge: "Magazine",
  },
  {
    id: "instagram-story-sticker",
    name: "Stiker Stories Estetik",
    desc: "Gaya stiker kartu sembulan mengambang khas Instagram Story & Reels.",
    icon: Sparkles,
    badge: "Stories",
  },
  {
    id: "classic-parchment-scroll",
    name: "Naskah Kuno / Perkamen",
    desc: "Nuansa kertas pustaka kuno nusantara dengan ornamen klasik penjelajah waktu.",
    icon: Scroll,
    badge: "Classic",
  },
];

export const LayoutCardControls: React.FC<LayoutCardControlsProps> = ({
  layout,
  onChangeLayout,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300 flex items-center gap-1.5">
          <Layout className="h-4 w-4 text-indigo-400" />
          <span>Format & Tata Letak Kartu (Layout)</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Pilih struktur visual yang paling cocok untuk media sosial targetmu
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {LAYOUT_OPTIONS.map((item) => {
          const Icon = item.icon;
          const isSelected = layout === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onChangeLayout(item.id)}
              className={`group relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/15 ring-1 ring-indigo-500/50"
                  : "border-zinc-800/80 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors ${
                      isSelected
                        ? "bg-indigo-600 text-white font-bold"
                        : "bg-zinc-800 text-zinc-400 group-hover:text-indigo-300"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-100 group-hover:text-indigo-300">
                      {item.name}
                    </h4>
                    <span className="inline-block rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-[9px] font-semibold text-indigo-400 mt-0.5 uppercase">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white font-bold"
                      : "border border-zinc-700 bg-zinc-800 text-transparent"
                  }`}
                >
                  <Check className="h-3 w-3" />
                </div>
              </div>

              <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
