"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import type { AppData } from "../../api/app/route";

const THEMES = {
  noir: {
    bg: "#080808",
    bgClass: "bg-[#080808]",
    orb1: "bg-white/[0.03]",
    orb2: "bg-white/[0.02]",
    text: "text-white",
    sub: "text-white/50",
    pill: "bg-white/[0.06] text-white/70",
    watermarkColor: "rgba(255,255,255,0.15)",
  },
  cosmic: {
    bg: "#0a0015",
    bgClass: "bg-[#0a0015]",
    orb1: "bg-purple-500/10",
    orb2: "bg-blue-500/8",
    text: "text-white",
    sub: "text-purple-200/50",
    pill: "bg-purple-500/10 text-purple-200/70",
    watermarkColor: "rgba(200,180,255,0.15)",
  },
  ocean: {
    bg: "#001020",
    bgClass: "bg-[#001020]",
    orb1: "bg-cyan-500/10",
    orb2: "bg-blue-500/8",
    text: "text-white",
    sub: "text-cyan-200/50",
    pill: "bg-cyan-500/10 text-cyan-200/70",
    watermarkColor: "rgba(180,220,255,0.15)",
  },
  ember: {
    bg: "#120800",
    bgClass: "bg-[#120800]",
    orb1: "bg-orange-500/10",
    orb2: "bg-rose-500/8",
    text: "text-white",
    sub: "text-orange-200/50",
    pill: "bg-orange-500/10 text-orange-200/70",
    watermarkColor: "rgba(255,200,150,0.15)",
  },
  arctic: {
    bg: "#f8fafb",
    bgClass: "bg-[#f8fafb]",
    orb1: "bg-blue-500/5",
    orb2: "bg-indigo-500/5",
    text: "text-gray-900",
    sub: "text-gray-400",
    pill: "bg-gray-900/5 text-gray-600",
    watermarkColor: "rgba(0,0,0,0.12)",
  },
};

type ThemeKey = keyof typeof THEMES;

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function PhoneMockup({ src, className = "" }: { src: string; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative w-[260px] h-[530px] rounded-[48px] bg-[#1a1a1a] p-[6px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_25px_80px_-12px_rgba(0,0,0,0.8)]">
        <div className="w-full h-full rounded-[42px] overflow-hidden bg-black relative">
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-20" />
          <img src={src} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
        </div>
      </div>
    </div>
  );
}

function StarsWithCount({ rating, count, theme }: { rating: number; count: number; theme: ThemeKey }) {
  const isLight = theme === "arctic";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
        {rating.toFixed(1)}
      </span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : isLight ? "text-gray-200" : "text-white/10"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className={`text-xs ${THEMES[theme].sub}`}>
        ({formatCount(count)})
      </span>
    </div>
  );
}

export default function AppShowcase({
  app,
  theme: initialTheme,
}: {
  app: AppData;
  theme: string;
  accentColor: string;
}) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(
    (initialTheme in THEMES ? initialTheme : "noir") as ThemeKey
  );
  const [showControls, setShowControls] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const t = THEMES[currentTheme];

  // Check pro status on mount (localStorage cache + server verify)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pro = localStorage.getItem("appframe_pro");
      if (pro === "true") {
        setIsPro(true);
      }
      // Also verify with server
      fetch("/api/verify").then(r => r.json()).then(data => {
        if (data.pro) {
          localStorage.setItem("appframe_pro", "true");
          setIsPro(true);
        }
      }).catch(() => {});
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!captureRef.current) return;
    setDownloading(true);

    try {
      const controlsEl = document.getElementById("controls-bar");
      const controlsBtnEl = document.getElementById("controls-btn");
      const downloadBarEl = document.getElementById("download-bar");
      if (controlsEl) controlsEl.style.display = "none";
      if (controlsBtnEl) controlsBtnEl.style.display = "none";
      if (downloadBarEl) downloadBarEl.style.display = "none";

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: t.bg,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: captureRef.current.scrollWidth,
        height: captureRef.current.scrollHeight,
      });

      // Small watermark text in bottom-right if not pro
      if (!isPro) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const fontSize = Math.max(13, canvas.width * 0.01);
          ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.fillStyle = t.watermarkColor;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("appfra.me", canvas.width - 24, canvas.height - 16);
        }
      }

      if (controlsEl) controlsEl.style.display = "";
      if (controlsBtnEl) controlsBtnEl.style.display = "";
      if (downloadBarEl) downloadBarEl.style.display = "";

      const link = document.createElement("a");
      link.download = `${app.trackName.replace(/[^a-zA-Z0-9]/g, "-")}-appframe.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }

    setDownloading(false);
  }, [app.trackName, isPro, t.bg, t.watermarkColor]);

  const handleBuy = async () => {
    setProLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();

      if (data.alreadyPro) {
        localStorage.setItem("appframe_pro", "true");
        setIsPro(true);
        setShowProModal(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // ignore
    }
    setProLoading(false);
  };

  return (
    <>
      <div ref={captureRef} className={`min-h-screen ${t.bgClass} relative overflow-hidden`} id="showcase">
        {/* Subtle orbs */}
        <div className={`absolute top-[-20%] right-[-10%] w-[600px] h-[600px] ${t.orb1} rounded-full blur-[120px]`} />
        <div className={`absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] ${t.orb2} rounded-full blur-[120px]`} />

        {/* Controls */}
        {showControls && (
          <div id="controls-bar" className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  currentTheme === key
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {key}
              </button>
            ))}
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={() => setShowControls(false)}
              className="text-white/30 hover:text-white/60 transition-all cursor-pointer text-xs"
            >
              hide
            </button>
          </div>
        )}

        {!showControls && (
          <button
            id="controls-btn"
            onClick={() => setShowControls(true)}
            className="fixed top-4 right-4 z-50 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/30 hover:text-white/60 cursor-pointer backdrop-blur-xl transition-all text-xs"
          >
            +
          </button>
        )}

        {/* Content */}
        <div className="relative z-10 min-h-screen flex items-center justify-center px-8 py-20">
          <div className="max-w-[1100px] w-full flex flex-col lg:flex-row items-center gap-16">
            {/* Left: Info */}
            <div className="flex-1 max-w-md">
              <div className="mb-8 animate-fade-in">
                <img
                  src={app.artworkUrl512}
                  alt={app.trackName}
                  className="w-24 h-24 rounded-[22px] shadow-[0_8px_40px_-8px_rgba(0,0,0,0.5)]"
                  crossOrigin="anonymous"
                />
              </div>

              <h1 className={`text-5xl font-bold ${t.text} leading-[1.1] tracking-tight mb-3 animate-fade-in`}>
                {app.trackName}
              </h1>

              <p className={`text-lg ${t.sub} mb-6 animate-fade-in`}>
                {app.developerName}
              </p>

              {app.averageUserRating > 0 && (
                <div className="mb-6 animate-fade-in-delay">
                  <StarsWithCount rating={app.averageUserRating} count={app.userRatingCount} theme={currentTheme} />
                </div>
              )}

              <p className={`text-base leading-relaxed ${t.sub} mb-8 line-clamp-3 animate-fade-in-delay`}>
                {app.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-10 animate-fade-in-delay-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${t.pill}`}>
                  {app.primaryGenreName}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${t.pill}`}>
                  {app.formattedPrice}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${t.pill}`}>
                  v{app.version}
                </span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${t.pill}`}>
                  {app.contentAdvisoryRating}
                </span>
              </div>

              <a
                href={app.trackViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full font-semibold text-sm transition-all animate-fade-in-delay-2 ${
                  currentTheme === "arctic"
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-white text-black hover:bg-white/90"
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </a>
            </div>

            {/* Right: Phone mockups */}
            {app.screenshotUrls.length > 0 && (
              <div className="relative flex items-center justify-center animate-fade-in">
                <div className="absolute inset-0 blur-[100px] opacity-20">
                  <img src={app.screenshotUrls[0]} alt="" className="w-full h-full object-cover rounded-full" crossOrigin="anonymous" />
                </div>

                <div className="relative flex items-end gap-5">
                  <PhoneMockup
                    src={app.screenshotUrls[0]}
                    className="z-10 transform hover:scale-[1.02] transition-transform duration-500"
                  />
                  {app.screenshotUrls.length > 1 && (
                    <PhoneMockup
                      src={app.screenshotUrls[1]}
                      className="hidden md:block transform -translate-y-8 opacity-70 hover:opacity-100 hover:scale-[1.02] transition-all duration-500"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Download bar */}
      <div id="download-bar" className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-lg mx-auto px-4 pb-6">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                  <path d="M12 2a10 10 0 019.95 9" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              )}
              {downloading ? "Generating..." : "Download PNG"}
            </button>

            {!isPro ? (
              <button
                onClick={() => setShowProModal(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-200 font-medium text-sm hover:from-amber-500/30 hover:to-orange-500/30 transition-all cursor-pointer whitespace-nowrap"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                Remove watermark
              </button>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-2 text-emerald-400 text-xs font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                PRO
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pro Modal */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowProModal(false)} />
          <div className="relative bg-[#111] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <button
              onClick={() => setShowProModal(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5">
              <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">AppFrame Pro</h2>
            <p className="text-white/40 text-sm mb-5">Clean downloads, no watermark. Forever.</p>

            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold text-white">$5</span>
              <span className="text-white/30 text-sm ml-2">one-time</span>
            </div>

            <button
              onClick={handleBuy}
              disabled={proLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm hover:from-amber-400 hover:to-orange-400 transition-all cursor-pointer disabled:opacity-50"
            >
              {proLoading ? "Redirecting to Stripe..." : "Unlock Pro — $5"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
