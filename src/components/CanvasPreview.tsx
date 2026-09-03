import React, { forwardRef } from "react";
import {
  AspectRatioType,
  BackgroundConfig,
  LayoutStyleType,
  QuoteContent,
  TypographyConfig,
} from "../types";
import { ThreeDBackgroundCanvas } from "./ThreeDBackgroundCanvas";
import {
  Quote,
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
  Share2,
  Bookmark,
  CheckCircle2,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Shuffle,
  Music2,
} from "lucide-react";

const renderHeaderIcon = (iconKey?: string) => {
  if (!iconKey || iconKey === "none") return null;
  const key = iconKey.toLowerCase();
  switch (key) {
    case "sparkles": return <Sparkles className="h-3 w-3 inline" />;
    case "star": return <Star className="h-3 w-3 inline" />;
    case "flame": return <Flame className="h-3 w-3 inline" />;
    case "heart": return <Heart className="h-3 w-3 inline" />;
    case "feather": return <Feather className="h-3 w-3 inline" />;
    case "compass": return <Compass className="h-3 w-3 inline" />;
    case "crown": return <Crown className="h-3 w-3 inline" />;
    case "leaf": return <Leaf className="h-3 w-3 inline" />;
    case "music": return <Music className="h-3 w-3 inline" />;
    case "book": return <BookOpen className="h-3 w-3 inline" />;
    case "sun": return <Sun className="h-3 w-3 inline" />;
    case "moon": return <Moon className="h-3 w-3 inline" />;
    case "zap": return <Zap className="h-3 w-3 inline" />;
    case "coffee": return <Coffee className="h-3 w-3 inline" />;
    default:
      return <span className="inline-block text-xs">{iconKey}</span>;
  }
};

interface CanvasPreviewProps {
  content: QuoteContent;
  background: BackgroundConfig;
  typography: TypographyConfig;
  layout: LayoutStyleType;
  aspectRatio: AspectRatioType;
  onChangeAspectRatio: (ratio: AspectRatioType) => void;
  isExporting?: boolean;
}

export const CanvasPreview = forwardRef<HTMLDivElement, CanvasPreviewProps>(
  (
    {
      content,
      background,
      typography,
      layout,
      aspectRatio,
      onChangeAspectRatio,
      isExporting = false,
    },
    ref
  ) => {
    // Aspect Ratio Dimension Helpers
    const getAspectRatioClass = () => {
      switch (aspectRatio) {
        case "9:16":
          return "aspect-[9/16] max-w-[380px] sm:max-w-[420px]";
        case "1:1":
          return "aspect-square max-w-[480px]";
        case "4:5":
          return "aspect-[4/5] max-w-[440px]";
        case "16:9":
          return "aspect-[16/9] max-w-[620px]";
        case "3:2":
          return "aspect-[3/2] max-w-[560px]";
        default:
          return "aspect-[9/16] max-w-[420px]";
      }
    };

    // Helper to render text with optional highlighted words
    const renderStyledText = (text: string) => {
      if (!typography.highlightWord || typography.highlightWord.trim() === "") {
        return text;
      }
      const word = typography.highlightWord.trim();
      const parts = text.split(new RegExp(`(${word})`, "gi"));
      return (
        <span>
          {parts.map((part, i) =>
            part.toLowerCase() === word.toLowerCase() ? (
              <span
                key={i}
                style={{
                  color: typography.highlightColor || "#fbbf24",
                  textDecoration: "underline",
                  textDecorationColor: typography.highlightColor || "#fbbf24",
                  textUnderlineOffset: "6px",
                  fontWeight: "bold",
                }}
              >
                {part}
              </span>
            ) : (
              part
            )
          )}
        </span>
      );
    };

    // Background Style calculation
    const getBackgroundStyle = (): React.CSSProperties => {
      if (background.type === "3d-animated") {
        return {
          backgroundColor: "#09090b",
        };
      }
      if (background.type === "gradient") {
        return {
          background: background.value,
        };
      }
      if (background.type === "texture-paper") {
        return {
          backgroundColor: background.value,
        };
      }
      return {
        backgroundImage: `url(${background.value})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    };

    // Quote Marks Icon Rendering
    const renderQuoteIcon = () => {
      if (!typography.showQuoteMarks) return null;
      if (typography.quoteMarkStyle === "classic") {
        return (
          <Quote
            className="mb-4 h-8 w-8 opacity-40 inline-block"
            style={{ color: typography.headerColor }}
          />
        );
      }
      if (typography.quoteMarkStyle === "modern") {
        return (
          <div
            className="mb-3 text-3xl font-serif leading-none opacity-50"
            style={{ color: typography.headerColor }}
          >
            “
          </div>
        );
      }
      if (typography.quoteMarkStyle === "japanese") {
        return (
          <div
            className="mb-2 text-xl font-mono opacity-60"
            style={{ color: typography.headerColor }}
          >
            ｢ ｣
          </div>
        );
      }
      return null;
    };

    return (
      <div className="flex flex-col items-center justify-center w-full">
        {/* Aspect Ratio Selector Pills */}
        <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 p-1 shadow-lg backdrop-blur-md">
          <span className="px-2.5 text-[11px] font-semibold text-zinc-400">Rasio:</span>
          {(
            [
              { id: "9:16", label: "Story 9:16", desc: "TikTok/Reels" },
              { id: "4:5", label: "Feed 4:5", desc: "Instagram Post" },
              { id: "1:1", label: "Square 1:1", desc: "Postingan Persegi" },
              { id: "16:9", label: "Banner 16:9", desc: "Landscape/X" },
              { id: "3:2", label: "Card 3:2", desc: "Foto Klasik" },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeAspectRatio(item.id)}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all ${
                aspectRatio === item.id
                  ? "bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/25"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Outer Shadow Wrapper */}
        <div className="relative flex items-center justify-center w-full p-2 sm:p-4">
          {/* THE CAPTURE TARGET CANVAS */}
          <div
            id="quote-canvas-export-target"
            ref={ref}
            style={getBackgroundStyle()}
            className={`relative w-full ${getAspectRatioClass()} overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 flex flex-col justify-between select-none`}
          >
            {/* 0. 3D Animated Background Layer (if active) */}
            {background.type === "3d-animated" && (
              <ThreeDBackgroundCanvas
                theme={background.threeDTheme || "liquid-waves"}
                speed={background.threeDSpeed ?? 1.0}
                colorPreset={background.threeDColorPreset || "indigo-violet"}
                isInteractive={background.threeDInteractive ?? true}
              />
            )}

            {/* Animated Character / Anime Sticker Overlay */}
            {background.characterEnabled && background.characterUrl && (
              <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <style>{`
                  @keyframes charFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-16px) rotate(2deg); }
                  }
                  @keyframes charFly {
                    0% { transform: translate(-40px, 20px) rotate(-5deg); }
                    50% { transform: translate(40px, -20px) rotate(5deg); }
                    100% { transform: translate(-40px, 20px) rotate(-5deg); }
                  }
                  @keyframes charSwing {
                    0%, 100% { transform: rotate(-8deg); }
                    50% { transform: rotate(8deg); }
                  }
                  .anim-float { animation: charFloat 4s ease-in-out infinite; }
                  .anim-fly { animation: charFly 6s ease-in-out infinite; }
                  .anim-swing { animation: charSwing 3s ease-in-out infinite; }
                `}</style>
                <div className={`relative w-36 h-36 sm:w-48 sm:h-48 opacity-100 ${
                  background.characterAnimation === "float" || !background.characterAnimation ? "anim-float" :
                  background.characterAnimation === "fly" ? "anim-fly" :
                  background.characterAnimation === "swing" ? "anim-swing" :
                  background.characterAnimation === "bounce" ? "animate-bounce" : "anim-float"
                }`}>
                  <img
                    src={background.characterUrl}
                    alt={background.characterName || "Anime Character"}
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)]"
                    crossOrigin="anonymous"
                  />
                </div>
              </div>
            )}

            {/* 1. Backdrop Blur Layer (if any) */}
            {background.blur > 0 && (
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backdropFilter: `blur(${background.blur}px)`,
                  WebkitBackdropFilter: `blur(${background.blur}px)`,
                }}
              />
            )}

            {/* 2. Color Overlay Layer */}
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundColor: background.overlayColor,
                opacity: background.overlayOpacity,
              }}
            />

            {/* 3. Vignette Shading Layer */}
            {background.hasVignette && (
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
                }}
              />
            )}

            {/* 4. Film Grain / Noise Overlay */}
            {background.hasGrain && (
              <div
                className="absolute inset-0 z-0 opacity-25 mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 0)`,
                  backgroundSize: "4px 4px",
                }}
              />
            )}

            {/* 5. Main Typography & Visual Content Layer */}
            <div
              id="quote-canvas-content-layer"
              className="relative z-10 flex h-full w-full flex-col justify-between"
            >
              {/* ================= LAYOUT 1: EDITORIAL MINIMAL ================= */}
              {layout === "editorial-minimal" && (
                <div className="relative flex h-full w-full flex-col justify-between p-7 sm:p-10">
                {/* Header Tag / Chapter */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div
                    style={{
                      fontFamily: typography.headerFontFamily,
                      color: typography.headerColor,
                    }}
                    className="text-xs tracking-widest uppercase font-semibold flex items-center gap-1.5"
                  >
                    {renderHeaderIcon(content.headerIcon)}
                    <span>{content.headerTag}</span>
                  </div>
                  <span
                    style={{ color: typography.subtextColor }}
                    className="text-[10px] tracking-wider uppercase font-mono opacity-80"
                  >
                    {content.dateStamp}
                  </span>
                </div>

                {/* Main Quote Body */}
                <div
                  className={`my-auto py-6 flex flex-col ${
                    typography.textAlign === "center"
                      ? "items-center text-center"
                      : typography.textAlign === "right"
                      ? "items-end text-right"
                      : "items-start text-left"
                  }`}
                >
                  {renderQuoteIcon()}

                  <p
                    style={{
                      fontFamily: typography.fontFamily,
                      fontSize: `${typography.fontSize}px`,
                      lineHeight: typography.lineHeight,
                      letterSpacing: `${typography.letterSpacing}px`,
                      color: typography.textColor,
                      textTransform: typography.isUppercase ? "uppercase" : "none",
                      fontStyle: typography.isItalic ? "italic" : "normal",
                      fontWeight:
                        typography.fontWeight === "bold"
                          ? 700
                          : typography.fontWeight === "semibold"
                          ? 600
                          : typography.fontWeight === "medium"
                          ? 500
                          : 400,
                    }}
                    className="font-normal transition-all"
                  >
                    {renderStyledText(content.mainQuote)}
                  </p>

                  {/* Subtext Reflection */}
                  {content.subtext && (
                    <div className="mt-5 flex items-center gap-2">
                      <div className="h-px w-6 bg-white/20" />
                      <p
                        style={{
                          fontFamily: typography.headerFontFamily,
                          color: typography.subtextColor,
                        }}
                        className="text-xs sm:text-sm font-light leading-relaxed opacity-90 max-w-sm"
                      >
                        {content.subtext}
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer Author & Watermark */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2">
                    <Feather
                      className="h-3.5 w-3.5"
                      style={{ color: typography.authorColor }}
                    />
                    <span
                      style={{
                        fontFamily: typography.headerFontFamily,
                        color: typography.authorColor,
                      }}
                      className="text-xs font-medium tracking-wide"
                    >
                      {content.author}
                    </span>
                  </div>

                  <span
                    style={{ color: typography.subtextColor }}
                    className="text-[10px] font-mono tracking-wider opacity-70"
                  >
                    {content.watermark}
                  </span>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 2: CARD GLASSMORPHISM ================= */}
            {layout === "card-glassmorphism" && (
              <div className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-8">
                <div className="flex w-full flex-col justify-between rounded-2xl border border-white/20 bg-neutral-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      style={{
                        fontFamily: typography.headerFontFamily,
                        color: typography.headerColor,
                      }}
                      className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                    >
                      {renderHeaderIcon(content.headerIcon)}
                      <span>{content.headerTag}</span>
                    </div>
                    <span
                      style={{ color: typography.subtextColor }}
                      className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono"
                    >
                      {content.dateStamp}
                    </span>
                  </div>

                  {/* Main Quote */}
                  <div
                    className={`my-4 ${
                      typography.textAlign === "center"
                        ? "text-center"
                        : typography.textAlign === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                  >
                    {renderQuoteIcon()}
                    <p
                      style={{
                        fontFamily: typography.fontFamily,
                        fontSize: `${typography.fontSize}px`,
                        lineHeight: typography.lineHeight,
                        letterSpacing: `${typography.letterSpacing}px`,
                        color: typography.textColor,
                        textTransform: typography.isUppercase ? "uppercase" : "none",
                        fontStyle: typography.isItalic ? "italic" : "normal",
                        fontWeight: typography.fontWeight === "bold" ? 700 : 500,
                      }}
                      className="font-normal"
                    >
                      {renderStyledText(content.mainQuote)}
                    </p>

                    {content.subtext && (
                      <p
                        style={{
                          fontFamily: typography.headerFontFamily,
                          color: typography.subtextColor,
                        }}
                        className="mt-4 text-xs sm:text-sm font-light leading-relaxed"
                      >
                        {content.subtext}
                      </p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span
                      style={{
                        fontFamily: typography.headerFontFamily,
                        color: typography.authorColor,
                      }}
                      className="text-xs font-semibold"
                    >
                      — {content.author}
                    </span>
                    <span
                      style={{ color: typography.subtextColor }}
                      className="text-[10px] opacity-70"
                    >
                      {content.watermark}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 3: SPOTIFY MUSIC PLAYER ================= */}
            {layout === "spotify-music-player" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-6 sm:p-8">
                {/* Top Nav */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium">
                    <Music2 className="h-4 w-4 text-[#1db954]" />
                    <span>Quote Playlist</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">
                    {content.dateStamp}
                  </span>
                </div>

                {/* Lyrics Quote Box */}
                <div className="my-auto py-4 rounded-xl bg-black/40 p-5 sm:p-6 backdrop-blur-md border border-white/10">
                  <div className="mb-2 text-[11px] uppercase font-bold tracking-wider text-[#1db954]">
                    LYRICS // {content.headerTag}
                  </div>
                  <p
                    style={{
                      fontFamily: typography.fontFamily,
                      fontSize: `${Math.max(typography.fontSize - 2, 18)}px`,
                      lineHeight: typography.lineHeight,
                      color: typography.textColor,
                      textTransform: typography.isUppercase ? "uppercase" : "none",
                      fontStyle: typography.isItalic ? "italic" : "normal",
                      fontWeight: 600,
                    }}
                    className="leading-snug"
                  >
                    {renderStyledText(content.mainQuote)}
                  </p>

                  {content.subtext && (
                    <p className="mt-3 text-xs text-neutral-400 font-normal">
                      {content.subtext}
                    </p>
                  )}
                </div>

                {/* Spotify Bottom Controller Widget */}
                <div className="rounded-xl bg-neutral-900/90 p-4 border border-white/10 shadow-xl backdrop-blur-lg">
                  {/* Song Title & Heart */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1db954] to-emerald-900 shadow-md">
                        <Music2 className="h-5 w-5 text-neutral-950" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="truncate text-xs sm:text-sm font-bold text-white">
                          {content.spotifySong || "Ketenangan Jiwa & Refleksi"}
                        </h4>
                        <p className="truncate text-[11px] text-neutral-400">
                          {content.spotifyArtist || content.author}
                        </p>
                      </div>
                    </div>
                    <Heart className="h-4 w-4 text-[#1db954] fill-[#1db954] shrink-0" />
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="relative h-1 w-full rounded-full bg-neutral-700 overflow-hidden">
                      <div className="h-full w-2/3 rounded-full bg-[#1db954]" />
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] font-mono text-neutral-400">
                      <span>2:14</span>
                      <span>3:45</span>
                    </div>
                  </div>

                  {/* Player Controls */}
                  <div className="flex items-center justify-between text-neutral-300 pt-1">
                    <Shuffle className="h-3.5 w-3.5 text-neutral-400" />
                    <SkipBack className="h-4 w-4" />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black shadow-md">
                      <Play className="h-3.5 w-3.5 fill-black ml-0.5" />
                    </div>
                    <SkipForward className="h-4 w-4" />
                    <Repeat className="h-3.5 w-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 4: TWITTER / X POST CARD ================= */}
            {layout === "twitter-tweet-card" && (
              <div className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-8">
                <div className="w-full rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
                  {/* Tweet Author Profile */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 font-bold text-white shadow-md">
                        {content.author.charAt(0) || "Q"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-neutral-100">
                            {content.author}
                          </span>
                          <CheckCircle2 className="h-4 w-4 text-sky-400 fill-sky-400/20" />
                        </div>
                        <span className="text-xs text-neutral-500 font-mono">
                          {content.watermark || "@katacerita"}
                        </span>
                      </div>
                    </div>

                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-neutral-400">
                      𝕏
                    </div>
                  </div>

                  {/* Tweet Content */}
                  <div className="my-3">
                    <p
                      style={{
                        fontFamily: typography.fontFamily,
                        fontSize: `${Math.max(typography.fontSize - 4, 17)}px`,
                        lineHeight: typography.lineHeight,
                        color: typography.textColor,
                        fontWeight: 400,
                      }}
                      className="whitespace-pre-line leading-relaxed"
                    >
                      {renderStyledText(content.mainQuote)}
                    </p>

                    {content.subtext && (
                      <p className="mt-3 text-xs text-neutral-400 italic">
                        {content.subtext}
                      </p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="border-t border-neutral-900 pt-3 text-[11px] text-neutral-500 font-mono">
                    <span>9:41 PM · {content.dateStamp} · </span>
                    <span className="text-sky-400">QuoteStory Studio</span>
                  </div>

                  {/* Engagement Metrics */}
                  <div className="mt-3 flex items-center justify-between border-t border-neutral-900 pt-3 text-xs text-neutral-400">
                    <div className="flex items-center gap-1.5 hover:text-rose-400 transition-colors">
                      <Heart className="h-3.5 w-3.5" />
                      <span>{content.likesCount || "24.5K"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-sky-400 transition-colors">
                      <Repeat className="h-3.5 w-3.5" />
                      <span>3,892</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                      <Bookmark className="h-3.5 w-3.5" />
                      <span>7,104</span>
                    </div>
                    <Share2 className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 5: POLAROID VINTAGE ================= */}
            {layout === "polaroid-vintage" && (
              <div className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-8">
                <div className="flex w-full flex-col rounded-sm bg-[#faf8f5] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-neutral-200/60 transform rotate-[-0.5deg]">
                  {/* Polaroid Photo Frame */}
                  <div
                    className="relative w-full aspect-[4/3] rounded-sm overflow-hidden mb-4 shadow-inner"
                    style={{
                      backgroundImage: `url(${
                        background.type === "curated-photo"
                          ? background.value
                          : "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                      })`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  >
                    <div className="absolute top-2 right-2 rounded bg-black/40 px-2 py-0.5 text-[9px] font-mono text-white backdrop-blur-sm">
                      {content.dateStamp}
                    </div>
                  </div>

                  {/* Handwritten Quote Area */}
                  <div className="px-2 py-2 text-center text-neutral-900">
                    <p
                      style={{
                        fontFamily: typography.fontFamily || "Caveat",
                        fontSize: `${Math.max(typography.fontSize, 24)}px`,
                        lineHeight: 1.3,
                        color: typography.textColor || "#1c1917",
                        fontWeight: 600,
                      }}
                    >
                      {renderStyledText(content.mainQuote)}
                    </p>

                    {content.subtext && (
                      <p className="mt-2 text-xs text-neutral-600 font-sans">
                        {content.subtext}
                      </p>
                    )}

                    <div className="mt-3 flex items-center justify-between border-t border-neutral-200/80 pt-2 text-[11px] font-mono text-neutral-500">
                      <span>— {content.author}</span>
                      <span>{content.watermark}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 6: SPLIT FRAME QUOTE ================= */}
            {layout === "split-frame-quote" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-7 sm:p-10">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-amber-400" />
                  <span
                    style={{
                      fontFamily: typography.headerFontFamily,
                      color: typography.headerColor,
                    }}
                    className="text-xs font-bold tracking-widest uppercase"
                  >
                    {content.headerTag}
                  </span>
                </div>

                <div className="my-auto pl-4 border-l-2 border-amber-400/80">
                  <p
                    style={{
                      fontFamily: typography.fontFamily,
                      fontSize: `${typography.fontSize}px`,
                      lineHeight: typography.lineHeight,
                      letterSpacing: `${typography.letterSpacing}px`,
                      color: typography.textColor,
                      fontStyle: typography.isItalic ? "italic" : "normal",
                      fontWeight: 600,
                    }}
                  >
                    {renderStyledText(content.mainQuote)}
                  </p>
                  {content.subtext && (
                    <p
                      style={{ color: typography.subtextColor }}
                      className="mt-4 text-xs sm:text-sm font-light leading-relaxed"
                    >
                      {content.subtext}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span
                    style={{ color: typography.authorColor }}
                    className="text-xs font-semibold tracking-wide"
                  >
                    {content.author}
                  </span>
                  <span
                    style={{ color: typography.subtextColor }}
                    className="text-[10px] font-mono opacity-70"
                  >
                    {content.watermark}
                  </span>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 7: POETRY TYPEWRITER ================= */}
            {layout === "poetry-typewriter" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-7 sm:p-10 font-mono text-neutral-900">
                {/* Stamp Date Top */}
                <div className="flex items-center justify-between border-b border-neutral-900/20 pb-3 text-xs">
                  <span className="font-bold tracking-wider uppercase">
                    [ {content.headerTag} ]
                  </span>
                  <span className="opacity-75">{content.dateStamp}</span>
                </div>

                {/* Typewriter Body */}
                <div className="my-auto py-6">
                  <p
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: `${Math.max(typography.fontSize - 4, 18)}px`,
                      lineHeight: typography.lineHeight,
                      color: typography.textColor || "#2b1810",
                    }}
                    className="leading-relaxed"
                  >
                    {renderStyledText(content.mainQuote)}
                  </p>

                  {content.subtext && (
                    <div className="mt-5 border-t border-neutral-900/10 pt-3">
                      <p className="text-xs opacity-80 leading-relaxed">
                        catatan: {content.subtext}
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Signature */}
                <div className="flex items-center justify-between border-t border-neutral-900/20 pt-3 text-xs">
                  <span className="font-bold">✍ {content.author}</span>
                  <span className="opacity-60">{content.watermark}</span>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 8: MODERN STATEMENT ================= */}
            {layout === "modern-statement" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-7 sm:p-10">
                <div className="flex items-center justify-between">
                  <span
                    style={{
                      fontFamily: typography.headerFontFamily,
                      color: typography.headerColor,
                    }}
                    className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold tracking-wider uppercase border border-white/10"
                  >
                    {content.headerTag}
                  </span>
                  <span className="text-[10px] font-mono text-white/70">
                    {content.dateStamp}
                  </span>
                </div>

                <div className="my-auto text-center">
                  <h2
                    style={{
                      fontFamily: typography.fontFamily,
                      fontSize: `${Math.max(typography.fontSize + 4, 28)}px`,
                      lineHeight: 1.2,
                      letterSpacing: "-0.5px",
                      color: typography.textColor,
                      textTransform: "uppercase",
                      fontWeight: 800,
                    }}
                    className="drop-shadow-lg"
                  >
                    {renderStyledText(content.mainQuote)}
                  </h2>

                  {content.subtext && (
                    <p
                      style={{ color: typography.subtextColor }}
                      className="mt-5 text-sm font-medium tracking-wide uppercase opacity-90 max-w-xs mx-auto"
                    >
                      {content.subtext}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-white/15 pt-4 text-xs font-semibold text-white">
                  <span>{content.author}</span>
                  <span className="font-mono text-[10px] opacity-70">
                    {content.watermark}
                  </span>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 9: MINIMALIST ZEN FRAME ================= */}
            {layout === "minimalist-zen-frame" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 sm:p-12 text-center">
                <div className="mx-auto flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-indigo-400 mb-3 animate-pulse" />
                  <span
                    style={{
                      fontFamily: typography.headerFontFamily,
                      color: typography.headerColor,
                    }}
                    className="text-[10px] uppercase tracking-[0.3em] font-medium"
                  >
                    {content.headerTag}
                  </span>
                </div>

                <div className="my-auto py-4">
                  <p
                    style={{
                      fontFamily: typography.fontFamily,
                      fontSize: `${typography.fontSize}px`,
                      lineHeight: typography.lineHeight,
                      letterSpacing: `${typography.letterSpacing + 1}px`,
                      color: typography.textColor,
                      fontWeight: 400,
                      fontStyle: typography.isItalic ? "italic" : "normal",
                    }}
                    className="max-w-md mx-auto"
                  >
                    {renderStyledText(content.mainQuote)}
                  </p>

                  {content.subtext && (
                    <p
                      style={{ color: typography.subtextColor }}
                      className="mt-6 text-xs font-light tracking-wide opacity-80"
                    >
                      {content.subtext}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-center gap-1">
                  <span
                    style={{ color: typography.authorColor }}
                    className="text-xs font-semibold tracking-widest uppercase"
                  >
                    {content.author}
                  </span>
                  <span className="text-[9px] font-mono opacity-50">{content.watermark}</span>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 10: NEUMORPHIC SOFT CARD ================= */}
            {layout === "neumorphic-soft-card" && (
              <div className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-8">
                <div className="w-full flex flex-col justify-between rounded-3xl bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      style={{ color: typography.headerColor }}
                      className="text-xs font-bold tracking-wider uppercase flex items-center gap-1.5"
                    >
                      {renderHeaderIcon(content.headerIcon)}
                      <span>{content.headerTag}</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-60">{content.dateStamp}</span>
                  </div>

                  <div className="my-auto py-3">
                    <p
                      style={{
                        fontFamily: typography.fontFamily,
                        fontSize: `${typography.fontSize}px`,
                        lineHeight: typography.lineHeight,
                        color: typography.textColor,
                        fontWeight: 600,
                      }}
                    >
                      {renderStyledText(content.mainQuote)}
                    </p>
                    {content.subtext && (
                      <p
                        style={{ color: typography.subtextColor }}
                        className="mt-4 text-xs font-normal opacity-90"
                      >
                        {content.subtext}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-xs font-bold" style={{ color: typography.authorColor }}>
                      — {content.author}
                    </span>
                    <span className="text-[10px] font-mono opacity-60">{content.watermark}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 11: CYBERPUNK HOLOGRAM ================= */}
            {layout === "cyberpunk-hologram" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-6 sm:p-8 font-mono text-cyan-300">
                <div className="flex items-center justify-between border-b border-cyan-500/40 pb-3 text-[11px]">
                  <span className="text-cyan-400 font-bold tracking-widest flex items-center gap-1">
                    <span>⚡ [SYS.SEC]</span>
                    <span>{content.headerTag}</span>
                  </span>
                  <span className="text-cyan-500/70">{content.dateStamp}</span>
                </div>

                <div className="my-auto py-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 p-5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                  <p
                    style={{
                      fontFamily: "Space Mono, monospace",
                      fontSize: `${Math.max(typography.fontSize - 2, 16)}px`,
                      lineHeight: typography.lineHeight,
                      color: typography.textColor || "#22d3ee",
                    }}
                    className="font-semibold"
                  >
                    {renderStyledText(content.mainQuote)}
                  </p>

                  {content.subtext && (
                    <p className="mt-3 text-xs text-cyan-400/80">
                      &gt; {content.subtext}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-cyan-500/40 pt-3 text-[11px]">
                  <span className="text-cyan-300 font-bold">USER // {content.author}</span>
                  <span className="text-cyan-500/60">{content.watermark}</span>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 12: MAGAZINE COVER HEADLINE ================= */}
            {layout === "magazine-cover-headline" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-7 sm:p-10">
                <div className="flex items-center justify-between border-b-2 border-black/80 dark:border-white/80 pb-3">
                  <div className="text-xs font-black tracking-widest uppercase">
                    VOGUE // ISSUE 09
                  </div>
                  <div className="text-xs font-mono font-bold tracking-wider">
                    {content.headerTag}
                  </div>
                </div>

                <div className="my-auto py-4">
                  <h1
                    style={{
                      fontFamily: typography.fontFamily,
                      fontSize: `${Math.max(typography.fontSize + 6, 32)}px`,
                      lineHeight: 1.1,
                      color: typography.textColor,
                      fontWeight: 900,
                    }}
                    className="tracking-tight uppercase"
                  >
                    {renderStyledText(content.mainQuote)}
                  </h1>

                  {content.subtext && (
                    <p
                      style={{ color: typography.subtextColor }}
                      className="mt-4 text-xs tracking-widest uppercase font-semibold opacity-90"
                    >
                      {content.subtext}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-black/20 dark:border-white/20 pt-3 text-xs font-bold">
                  <span>FEATURED: {content.author}</span>
                  <span className="font-mono">{content.watermark}</span>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 13: INSTAGRAM STORY STICKER ================= */}
            {layout === "instagram-story-sticker" && (
              <div className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-8">
                <div className="w-full max-w-sm rounded-3xl bg-white/90 dark:bg-zinc-950/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl border border-white/40 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transform rotate-1">
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                      {content.headerTag}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">{content.dateStamp}</span>
                  </div>

                  <div className="my-3">
                    <p
                      style={{
                        fontFamily: typography.fontFamily,
                        fontSize: `${Math.max(typography.fontSize - 2, 17)}px`,
                        lineHeight: typography.lineHeight,
                        color: typography.textColor,
                        fontWeight: 600,
                      }}
                    >
                      {renderStyledText(content.mainQuote)}
                    </p>

                    {content.subtext && (
                      <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                        ✨ {content.subtext}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800 pt-3 text-xs">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      @{content.author.toLowerCase().replace(/\s+/g, "")}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">{content.watermark}</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= LAYOUT 14: CLASSIC PARCHMENT SCROLL ================= */}
            {layout === "classic-parchment-scroll" && (
              <div className="relative z-10 flex h-full w-full flex-col justify-between p-8 sm:p-12 text-[#2c1d0c] bg-[#fefae0]/95 border-8 border-[#dda15e]/40 rounded-xl shadow-inner">
                <div className="text-center border-b-2 border-[#dda15e]/60 pb-3">
                  <span className="font-serif text-xs font-bold tracking-[0.2em] uppercase text-[#bc6c25]">
                    ✦ {content.headerTag} ✦
                  </span>
                </div>

                <div className="my-auto py-6 text-center">
                  <p
                    style={{
                      fontFamily: typography.fontFamily || "Cormorant Garamond, serif",
                      fontSize: `${typography.fontSize}px`,
                      lineHeight: typography.lineHeight,
                      color: typography.textColor || "#38220f",
                      fontStyle: "italic",
                      fontWeight: 600,
                    }}
                  >
                    "{renderStyledText(content.mainQuote)}"
                  </p>

                  {content.subtext && (
                    <p className="mt-5 text-xs font-serif text-[#7f4f24] tracking-wide">
                      {content.subtext}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between border-t-2 border-[#dda15e]/60 pt-3 font-serif text-xs font-bold text-[#bc6c25]">
                  <span>— {content.author}</span>
                  <span className="text-[10px] font-mono">{content.watermark}</span>
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CanvasPreview.displayName = "CanvasPreview";
