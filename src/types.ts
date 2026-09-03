export type AspectRatioType = "9:16" | "1:1" | "4:5" | "16:9" | "3:2";

export type LayoutStyleType =
  | "editorial-minimal"
  | "card-glassmorphism"
  | "spotify-music-player"
  | "twitter-tweet-card"
  | "polaroid-vintage"
  | "split-frame-quote"
  | "poetry-typewriter"
  | "modern-statement"
  | "minimalist-zen-frame"
  | "neumorphic-soft-card"
  | "cyberpunk-hologram"
  | "magazine-cover-headline"
  | "instagram-story-sticker"
  | "classic-parchment-scroll";

export type BackgroundCategory =
  | "curated-photo"
  | "gradient"
  | "texture-paper"
  | "custom-image"
  | "ai-generated"
  | "3d-animated";

export type ThreeDThemeType =
  | "liquid-waves"
  | "cosmic-starfield"
  | "floating-gems"
  | "aurora-ribbon"
  | "particle-sphere"
  | "cyber-grid"
  | "dna-helix"
  | "minimalist-torus"
  | "golden-dust"
  | "quantum-matrix"
  | "hypercube-tesseract"
  | "solar-system-orbit"
  | "neon-tunnel"
  | "firefly-swarm"
  | "crystal-lattice"
  | "rain-effect"
  | "snow-fall"
  | "floating-bubbles"
  | "star-field";

export interface BackgroundConfig {
  type: BackgroundCategory;
  value: string; // URL or CSS gradient or solid color or base64 data
  overlayColor: string; // e.g. "rgba(0,0,0,0.4)"
  overlayOpacity: number; // 0 to 1
  blur: number; // 0 to 20 px
  hasGrain: boolean;
  hasVignette: boolean;
  aiPrompt?: string;
  threeDTheme?: ThreeDThemeType;
  threeDSpeed?: number; // 0.2 to 2.5
  threeDColorPreset?: string; // e.g. "indigo-violet", "golden-hour", "cyber-neon", "emerald-zen", "monochrome-dark"
  threeDInteractive?: boolean;
  characterEnabled?: boolean;
  characterType?: string;
  characterUrl?: string;
  characterName?: string;
  characterAnimation?: "float" | "bounce" | "pulse" | "spin";
}

export type FontFamily =
  | "Plus Jakarta Sans"
  | "Playfair Display"
  | "Cormorant Garamond"
  | "Syne"
  | "Caveat"
  | "Cinzel"
  | "Bebas Neue"
  | "Space Mono"
  | "Outfit"
  | "Montserrat"
  | "Dancing Script"
  | "DM Serif Display"
  | "Prata"
  | "Bodoni Moda"
  | "Italiana"
  | "Lora"
  | "Merriweather"
  | "EB Garamond"
  | "Newsreader"
  | "Inter"
  | "Poppins"
  | "Raleway"
  | "Space Grotesk"
  | "Manrope"
  | "Kalam"
  | "Satisfy"
  | "Sacramento"
  | "Alex Brush"
  | "Great Vibes"
  | "Marck Script"
  | "Special Elite"
  | "Courier Prime"
  | "Oswald"
  | "Anton"
  | "VT323"
  | "Cinzel Decorative"
  | "Abril Fatface"
  | "Playfair Display SC";

export interface TypographyConfig {
  fontFamily: FontFamily;
  headerFontFamily: FontFamily;
  fontSize: number; // base size
  lineHeight: number; // 1.2 to 2.0
  letterSpacing: number; // -1 to 5 px
  textAlign: "left" | "center" | "right" | "justify";
  isUppercase: boolean;
  isItalic: boolean;
  fontWeight: "normal" | "medium" | "semibold" | "bold" | "black";
  textColor: string;
  headerColor: string;
  subtextColor: string;
  authorColor: string;
  highlightColor: string;
  highlightWord?: string;
  showQuoteMarks: boolean;
  quoteMarkStyle: "classic" | "modern" | "japanese" | "none";
}

export interface QuoteContent {
  headerTag: string; // e.g., "01 // RENUNGAN PAGI" or "CATATAN DIRI"
  headerIcon?: string; // icon name or custom emoji/symbol
  mainQuote: string;
  subtext: string;
  author: string;
  watermark: string; // e.g., "@katacerita.id"
  dateStamp: string; // e.g. "03 September 2026"
  badgeText?: string; // e.g. "✨ DAILY REMINDER"
  spotifySong?: string; // for spotify theme
  spotifyArtist?: string;
  verifiedBadge?: boolean; // for tweet theme
  likesCount?: string;
}

export interface PresetTheme {
  id: string;
  name: string;
  description: string;
  layout: LayoutStyleType;
  background: BackgroundConfig;
  typography: TypographyConfig;
  aspectRatio: AspectRatioType;
  sampleQuote?: Partial<QuoteContent>;
  tags: string[];
}

export interface CuratedQuote {
  id: string;
  category: string;
  headerTag: string;
  mainQuote: string;
  subtext: string;
  author: string;
  moodTag: string;
}

export interface SavedDraft {
  id: string;
  createdAt: number;
  previewThumbnail?: string;
  content: QuoteContent;
  background: BackgroundConfig;
  typography: TypographyConfig;
  layout: LayoutStyleType;
  aspectRatio: AspectRatioType;
}
