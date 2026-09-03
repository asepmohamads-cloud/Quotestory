import React, { useState, useRef, useEffect } from "react";
import * as THREE from "three";
import { QuoteContent, BackgroundConfig } from "../types";
import { toPng, toJpeg, toBlob } from "html-to-image";
import confetti from "canvas-confetti";
import { createThreeScene, COLOR_PALETTES } from "../utils/threeSceneEngine";
import {
  Download,
  Copy,
  Check,
  X,
  Share2,
  FileImage,
  Sparkles,
  RefreshCw,
  Video,
  Film,
  Play,
  Box,
  Zap,
  Clock,
  Sliders,
  Layers,
  StopCircle,
} from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: QuoteContent;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  background?: BackgroundConfig;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  content,
  canvasRef,
  background,
}) => {
  const is3DActive = background?.type === "3d-animated";

  const [activeExportMode, setActiveExportMode] = useState<"video" | "image">(
    is3DActive ? "video" : "image"
  );

  const [isExporting, setIsExporting] = useState(false);
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoStatusMessage, setVideoStatusMessage] = useState("");
  const [videoDuration, setVideoDuration] = useState<number>(5); // 3, 5, 8 seconds
  const [videoQuality, setVideoQuality] = useState<"1080p" | "720p">("1080p");
  const [videoFps, setVideoFps] = useState<number>(30); // 30 or 60 fps
  const isRecordingRef = useRef(false);
  const activeThreeCleanupRef = useRef<(() => void) | null>(null);

  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [scaleMultiplier, setScaleMultiplier] = useState<number>(2); // 2x for crisp 1080p/Retina
  const [exportError, setExportError] = useState<string | null>(null);

  // Sync default mode if background changes
  useEffect(() => {
    if (isOpen) {
      if (background?.type === "3d-animated") {
        setActiveExportMode("video");
      }
      setExportError(null);
      setIsRecordingVideo(false);
      isRecordingRef.current = false;
      if (activeThreeCleanupRef.current) {
        activeThreeCleanupRef.current();
        activeThreeCleanupRef.current = null;
      }
    }
  }, [isOpen, background?.type]);

  if (!isOpen) return null;

  // Generate Instagram / Social Media Caption
  const socialCaption = `${content.headerTag ? `[ ${content.headerTag} ]\n\n` : ""}"${content.mainQuote}"\n\n${
    content.subtext ? `${content.subtext}\n\n` : ""
  }— ${content.author}\n\n${content.watermark}\n.\n.\n#katamotivasi #quoteskehidupan #renunganhariini #selfhealing #filosofihidup #stoikisme #katabijak #literasi #quoteaesthetic`;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#818cf8", "#38bdf8", "#ec4899", "#ffffff"],
      });
    } catch (e) {
      // ignore
    }
  };

  const getExportOptions = () => ({
    pixelRatio: scaleMultiplier,
    cacheBust: true,
    fontEmbedCSS: "", // Prevents html-to-image from accessing document.styleSheets cross-origin cssRules
  });

  // Handle PNG Static Download
  const handleDownloadPng = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const dataUrl = await toPng(canvasRef.current, getExportOptions());
      const link = document.createElement("a");
      link.download = `quotestory-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      triggerConfetti();
    } catch (err: any) {
      console.error("Export PNG failed:", err);
      setExportError("Gagal mengunduh PNG. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle JPG Static Download
  const handleDownloadJpg = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const dataUrl = await toJpeg(canvasRef.current, {
        ...getExportOptions(),
        quality: 0.95,
      });
      const link = document.createElement("a");
      link.download = `quotestory-${Date.now()}.jpg`;
      link.href = dataUrl;
      link.click();
      triggerConfetti();
    } catch (err: any) {
      console.error("Export JPG failed:", err);
      setExportError("Gagal mengunduh JPG. Silakan coba kembali.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Copy Static Image to Clipboard
  const handleCopyImageToClipboard = async () => {
    if (!canvasRef.current) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await toBlob(canvasRef.current, {
        ...getExportOptions(),
        pixelRatio: 2,
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            "image/png": blob,
          }),
        ]);
        setCopiedImage(true);
        triggerConfetti();
        setTimeout(() => setCopiedImage(false), 3000);
      }
    } catch (err: any) {
      console.error("Copy image failed:", err);
      setExportError("Gagal menyalin gambar ke clipboard browser.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Video Animation Recording & Download
  const handleStartRecordVideo = async () => {
    if (!canvasRef.current) {
      setExportError("Target kanvas tidak ditemukan.");
      return;
    }

    if (typeof MediaRecorder === "undefined") {
      setExportError("Browser Anda tidak mendukung perekaman MediaRecorder API.");
      return;
    }

    setIsRecordingVideo(true);
    isRecordingRef.current = true;
    setVideoProgress(0);
    setVideoStatusMessage("Menyiapkan layer visual & tipografi...");
    setExportError(null);

    const targetEl = canvasRef.current;

    try {
      // Step 1: Render the transparent text overlay image
      const contentEl =
        (targetEl.querySelector("#quote-canvas-content-layer") as HTMLElement) ||
        targetEl;

      const overlayPixelRatio = videoQuality === "1080p" ? 2 : 1.5;

      let overlayDataUrl: string;
      if (contentEl.id === "quote-canvas-content-layer") {
        overlayDataUrl = await toPng(contentEl, {
          pixelRatio: overlayPixelRatio,
          cacheBust: true,
          fontEmbedCSS: "",
        });
      } else {
        const originalBg = targetEl.style.backgroundColor;
        targetEl.style.backgroundColor = "transparent";
        try {
          overlayDataUrl = await toPng(targetEl, {
            filter: (node) =>
              (node as HTMLElement).id !== "three-d-canvas-container" &&
              (node as HTMLElement).tagName !== "CANVAS",
            pixelRatio: overlayPixelRatio,
            fontEmbedCSS: "",
            cacheBust: true,
          });
        } finally {
          targetEl.style.backgroundColor = originalBg;
        }
      }

      // Step 2: Load overlay image into memory
      const overlayImg = new Image();
      overlayImg.crossOrigin = "anonymous";
      overlayImg.src = overlayDataUrl;
      await new Promise((resolve, reject) => {
        overlayImg.onload = resolve;
        overlayImg.onerror = reject;
      });

      if (!isRecordingRef.current) return;

      // Step 3: Create offscreen composite canvas
      const width = overlayImg.width || 1080;
      const height = overlayImg.height || 1920;
      const recordCanvas = document.createElement("canvas");
      recordCanvas.width = width;
      recordCanvas.height = height;
      const ctx = recordCanvas.getContext("2d", { alpha: false });

      if (!ctx) {
        throw new Error("Gagal membuat konteks render 2D kanvas");
      }

      // Step 4: If 3D background is active, set up dedicated offscreen Three.js WebGLRenderer
      const is3D = background?.type === "3d-animated";
      const palette =
        COLOR_PALETTES[background?.threeDColorPreset || "indigo-violet"] ||
        COLOR_PALETTES["indigo-violet"];

      let threeRenderer: THREE.WebGLRenderer | null = null;
      let threeSceneInstance: ReturnType<typeof createThreeScene> | null = null;

      if (is3D) {
        threeRenderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          preserveDrawingBuffer: true,
        });
        threeRenderer.setSize(width, height);
        threeRenderer.setPixelRatio(1);

        threeSceneInstance = createThreeScene(
          background?.threeDTheme || "liquid-waves",
          background?.threeDColorPreset || "indigo-violet",
          background?.threeDSpeed ?? 1.0,
          width,
          height
        );
      }

      // Preload background image if photo
      let bgImage: HTMLImageElement | null = null;
      if (
        (background?.type === "curated-photo" ||
          background?.type === "unsplash-custom" ||
          background?.type === "custom-upload") &&
        background.value
      ) {
        try {
          bgImage = new Image();
          bgImage.crossOrigin = "anonymous";
          bgImage.src = background.value;
          await new Promise((res) => {
            bgImage!.onload = res;
            bgImage!.onerror = () => res(null);
          });
        } catch (e) {}
      }

      const cleanupThree = () => {
        if (threeSceneInstance) {
          try {
            threeSceneInstance.dispose();
          } catch (e) {}
          threeSceneInstance = null;
        }
        if (threeRenderer) {
          try {
            threeRenderer.dispose();
          } catch (e) {}
          threeRenderer = null;
        }
      };
      activeThreeCleanupRef.current = cleanupThree;

      // Step 5: Detect best supported MIME type
      let chosenMime = "video/webm";
      let fileExt = "webm";

      const candidates = [
        { mime: "video/mp4;codecs=avc1.42E01E,mp4a.40.2", ext: "mp4" },
        { mime: "video/mp4", ext: "mp4" },
        { mime: "video/webm;codecs=vp9,opus", ext: "webm" },
        { mime: "video/webm;codecs=vp9", ext: "webm" },
        { mime: "video/webm;codecs=vp8", ext: "webm" },
        { mime: "video/webm", ext: "webm" },
      ];

      for (const c of candidates) {
        if (MediaRecorder.isTypeSupported(c.mime)) {
          chosenMime = c.mime;
          fileExt = c.ext;
          break;
        }
      }

      const stream = recordCanvas.captureStream(videoFps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: chosenMime,
        videoBitsPerSecond: videoQuality === "1080p" ? 9000000 : 5000000,
      });

      const recordedChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        cleanupThree();
        activeThreeCleanupRef.current = null;
        if (!isRecordingRef.current) {
          setIsRecordingVideo(false);
          return;
        }

        setVideoStatusMessage("Mengemas video animasi loop...");
        const blob = new Blob(recordedChunks, { type: chosenMime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const themeSlug = background?.threeDTheme || "animation";
        link.download = `quotestory-${themeSlug}-${Date.now()}.${fileExt}`;
        link.click();

        setTimeout(() => URL.revokeObjectURL(url), 6000);
        setIsRecordingVideo(false);
        isRecordingRef.current = false;
        setVideoProgress(100);
        setVideoStatusMessage("Selesai! Video animasi berhasil diunduh.");
        triggerConfetti();
      };

      // Step 6: Start live capture loop
      mediaRecorder.start(100);
      const totalDurationMs = videoDuration * 1000;
      const startTime = performance.now();
      let lastFrameTime = startTime;

      const renderFrame = () => {
        if (!isRecordingRef.current) {
          try {
            if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
          } catch (err) {}
          cleanupThree();
          return;
        }

        const now = performance.now();
        const elapsed = now - startTime;
        const elapsedSec = elapsed / 1000;
        const deltaSec = (now - lastFrameTime) / 1000;
        lastFrameTime = now;

        const progress = Math.min(
          Math.round((elapsed / totalDurationMs) * 100),
          99
        );
        setVideoProgress(progress);
        setVideoStatusMessage(
          `Merekam animasi 3D (${elapsedSec.toFixed(1)}s / ${videoDuration}s)...`
        );

        // --- LAYER 1: Base Background & 3D WebGL ---
        if (is3D) {
          ctx.fillStyle = palette.bgHex || "#09090b";
          ctx.fillRect(0, 0, width, height);

          // Update & Render Three.js 3D Scene
          if (threeSceneInstance && threeRenderer) {
            threeSceneInstance.update(elapsedSec, deltaSec);
            threeRenderer.render(
              threeSceneInstance.scene,
              threeSceneInstance.camera
            );
            ctx.drawImage(threeRenderer.domElement, 0, 0, width, height);
          }
        } else if (bgImage) {
          // Subtle slow cinematic zoom for photo background
          const zoom = 1 + (elapsed / totalDurationMs) * 0.05;
          const dw = width * zoom;
          const dh = height * zoom;
          const dx = (width - dw) / 2;
          const dy = (height - dh) / 2;
          ctx.drawImage(bgImage, dx, dy, dw, dh);
        } else if (background?.type === "gradient") {
          const grad = ctx.createLinearGradient(
            0,
            0,
            width * Math.cos(elapsedSec * 0.2),
            height
          );
          grad.addColorStop(0, "#1e1b4b");
          grad.addColorStop(0.5, "#312e81");
          grad.addColorStop(1, "#0f172a");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        } else {
          ctx.fillStyle = background?.value || "#09090b";
          ctx.fillRect(0, 0, width, height);
        }

        // --- LAYER 2: Color Overlay (if any) ---
        if (background && background.overlayOpacity > 0) {
          ctx.save();
          ctx.globalAlpha = background.overlayOpacity;
          ctx.fillStyle = background.overlayColor || "#000000";
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        // --- LAYER 3: Vignette Shading (if enabled) ---
        if (background?.hasVignette) {
          ctx.save();
          const radGrad = ctx.createRadialGradient(
            width / 2,
            height / 2,
            width * 0.25,
            width / 2,
            height / 2,
            width * 0.75
          );
          radGrad.addColorStop(0, "rgba(0,0,0,0)");
          radGrad.addColorStop(1, "rgba(0,0,0,0.65)");
          ctx.fillStyle = radGrad;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        }

        // --- LAYER 4: Typography & Content Overlay ---
        ctx.drawImage(overlayImg, 0, 0, width, height);

        if (elapsed < totalDurationMs) {
          requestAnimationFrame(renderFrame);
        } else {
          setVideoStatusMessage("Menyelesaikan encoding video...");
          setTimeout(() => {
            if (mediaRecorder.state !== "inactive") {
              mediaRecorder.stop();
            }
          }, 250);
        }
      };

      requestAnimationFrame(renderFrame);
    } catch (err: any) {
      console.error("Video export error:", err);
      if (activeThreeCleanupRef.current) {
        activeThreeCleanupRef.current();
        activeThreeCleanupRef.current = null;
      }
      setIsRecordingVideo(false);
      isRecordingRef.current = false;
      setExportError(
        err?.message || "Gagal merekam animasi video. Silakan coba kembali."
      );
    }
  };

  const handleCancelVideoRecording = () => {
    isRecordingRef.current = false;
    if (activeThreeCleanupRef.current) {
      activeThreeCleanupRef.current();
      activeThreeCleanupRef.current = null;
    }
    setIsRecordingVideo(false);
    setVideoProgress(0);
    setVideoStatusMessage("");
  };

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(socialCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Download className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                <span>Unduh & Ekspor Konten</span>
                {is3DActive && (
                  <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                    <Box className="h-2.5 w-2.5" /> 3D Aktif
                  </span>
                )}
              </h3>
              <p className="text-xs text-zinc-400">
                Ekspor video animasi loop atau gambar resolusi tinggi
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

        {/* Mode Selector Tabs: Video vs Static Image */}
        <div className="border-b border-zinc-800/80 bg-zinc-900/40 p-2">
          <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-zinc-950/80 p-1 border border-zinc-800">
            {/* Tab 1: Video Animasi */}
            <button
              type="button"
              onClick={() => setActiveExportMode("video")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                activeExportMode === "video"
                  ? "bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Film className="h-3.5 w-3.5" />
              <span>Video Animasi Loop</span>
              {is3DActive && (
                <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-bold tracking-wide uppercase">
                  Pilihan 3D
                </span>
              )}
            </button>

            {/* Tab 2: Gambar Statis */}
            <button
              type="button"
              onClick={() => setActiveExportMode("image")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                activeExportMode === "image"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <FileImage className="h-3.5 w-3.5" />
              <span>Gambar Diam (PNG / JPG)</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* Error Notice */}
          {exportError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-xs text-rose-300 flex items-start gap-2">
              <span className="text-rose-400 font-bold">⚠️</span>
              <span>{exportError}</span>
            </div>
          )}

          {/* ================= TAB 1: VIDEO ANIMASI EXPORT ================= */}
          {activeExportMode === "video" && (
            <div className="space-y-5">
              {/* Highlight Badge */}
              <div className="flex items-start gap-3 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-indigo-500/5 p-3.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
                  <Play className="h-4 w-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-indigo-200 flex items-center gap-1.5">
                    <span>Ekspor Video Animasi 60 FPS</span>
                    <span className="rounded bg-indigo-400/20 px-1.5 py-0.5 text-[10px] text-indigo-300 font-mono">
                      MP4 / WebM
                    </span>
                  </h4>
                  <p className="text-zinc-400 mt-0.5 leading-relaxed">
                    Merekam keindahan gerakan 3D beserta kutipan & tipografi menjadi video loop siap unggah di Instagram Story, Reels, TikTok, & WhatsApp Status.
                  </p>
                </div>
              </div>

              {/* Video Duration Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Durasi Video Loop</span>
                  </span>
                  <span className="text-indigo-400 font-bold font-mono">{videoDuration} Detik</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 3, label: "3 Detik", desc: "Loop Cepat (~1.5 MB)" },
                    { val: 5, label: "5 Detik", desc: "Standar Story (~3 MB)" },
                    { val: 8, label: "8 Detik", desc: "Cinematic (~5 MB)" },
                  ].map((dur) => (
                    <button
                      key={dur.val}
                      type="button"
                      disabled={isRecordingVideo}
                      onClick={() => setVideoDuration(dur.val)}
                      className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all ${
                        videoDuration === dur.val
                          ? "border-indigo-500 bg-indigo-500/20 text-indigo-200 ring-1 ring-indigo-500/40 font-bold"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                      } disabled:opacity-50`}
                    >
                      <span className="text-xs">{dur.label}</span>
                      <span className="text-[9px] text-zinc-500 mt-0.5 font-normal">{dur.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Quality & FPS Selection */}
              <div className="grid grid-cols-2 gap-3">
                {/* Quality */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Sliders className="h-3 w-3 text-indigo-400" />
                    <span>Resolusi</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-900/80 p-1 border border-zinc-800">
                    <button
                      type="button"
                      disabled={isRecordingVideo}
                      onClick={() => setVideoQuality("720p")}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        videoQuality === "720p"
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      HD 720p
                    </button>
                    <button
                      type="button"
                      disabled={isRecordingVideo}
                      onClick={() => setVideoQuality("1080p")}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        videoQuality === "1080p"
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      Full HD 1080p
                    </button>
                  </div>
                </div>

                {/* Framerate */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <Zap className="h-3 w-3 text-indigo-400" />
                    <span>Framerate</span>
                  </label>
                  <div className="grid grid-cols-2 gap-1 rounded-xl bg-zinc-900/80 p-1 border border-zinc-800">
                    <button
                      type="button"
                      disabled={isRecordingVideo}
                      onClick={() => setVideoFps(30)}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        videoFps === 30
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      30 FPS
                    </button>
                    <button
                      type="button"
                      disabled={isRecordingVideo}
                      onClick={() => setVideoFps(60)}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        videoFps === 60
                          ? "bg-indigo-600 text-white"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      60 FPS
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Recording Progress Indicator */}
              {isRecordingVideo ? (
                <div className="space-y-3 rounded-2xl border border-indigo-500/50 bg-indigo-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                      </span>
                      <span className="text-xs font-bold text-zinc-100">
                        Merekam Live Frame 3D...
                      </span>
                    </div>
                    <span className="font-mono text-sm font-bold text-indigo-300">
                      {videoProgress}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-150"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="truncate">{videoStatusMessage}</span>
                    <button
                      type="button"
                      onClick={handleCancelVideoRecording}
                      className="text-rose-400 hover:text-rose-300 font-semibold underline shrink-0 ml-2"
                    >
                      Batalkan
                    </button>
                  </div>
                </div>
              ) : (
                /* Primary Video Action Button */
                <button
                  id="btn-download-animated-video"
                  type="button"
                  onClick={handleStartRecordVideo}
                  disabled={isRecordingVideo || isExporting}
                  className="w-full flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 py-3.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 transition-all duration-200"
                >
                  <Video className="h-4 w-4" />
                  <span>Mulai Rekam & Unduh Video Animasi ({videoDuration}s)</span>
                </button>
              )}
            </div>
          )}

          {/* ================= TAB 2: GAMBAR DIAM (PNG/JPG) ================= */}
          {activeExportMode === "image" && (
            <div className="space-y-5">
              {/* Quality Multiplier */}
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Pilihan Kualitas Gambar
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Standar (1x)", val: 1 },
                    { label: "HD Tajam (2x)", val: 2 },
                    { label: "Ultra 4K (3x)", val: 3 },
                  ].map((q) => (
                    <button
                      key={q.val}
                      type="button"
                      disabled={isExporting}
                      onClick={() => setScaleMultiplier(q.val)}
                      className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                        scaleMultiplier === q.val
                          ? "border-indigo-500 bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/40"
                          : "border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Download Action Buttons */}
              <div className="space-y-2.5">
                <button
                  id="btn-download-hd-png"
                  onClick={handleDownloadPng}
                  disabled={isExporting}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-3.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 transition-all"
                >
                  {isExporting ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  <span>Unduh Format PNG (Kualitas Terbaik)</span>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleDownloadJpg}
                    disabled={isExporting}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 transition-all"
                  >
                    <FileImage className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Unduh JPG</span>
                  </button>

                  <button
                    onClick={handleCopyImageToClipboard}
                    disabled={isExporting}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 py-2.5 text-xs font-semibold text-zinc-200 hover:border-zinc-700 hover:bg-zinc-800 transition-all"
                  >
                    {copiedImage ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-sky-400" />
                        <span>Salin Gambar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Caption Generator Box */}
          <div className="space-y-2 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Share2 className="h-3.5 w-3.5 text-indigo-400" />
                <span>Keterangan & Tagar Siap Salin</span>
              </label>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                {copiedCaption ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Caption</span>
                  </>
                )}
              </button>
            </div>

            <textarea
              readOnly
              rows={4}
              value={socialCaption}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs font-mono leading-relaxed text-zinc-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

