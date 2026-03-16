"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import type { AppData } from "../../api/app/route";

const THEMES = {
  noir: { bg: "#080808", text: "text-white", sub: "text-white/50", pill: "bg-white/[0.06] text-white/70", wm: "rgba(255,255,255,0.15)" },
  cosmic: { bg: "#0a0015", text: "text-white", sub: "text-purple-200/50", pill: "bg-purple-500/10 text-purple-200/70", wm: "rgba(200,180,255,0.15)" },
  ocean: { bg: "#001020", text: "text-white", sub: "text-cyan-200/50", pill: "bg-cyan-500/10 text-cyan-200/70", wm: "rgba(180,220,255,0.15)" },
  ember: { bg: "#120800", text: "text-white", sub: "text-orange-200/50", pill: "bg-orange-500/10 text-orange-200/70", wm: "rgba(255,200,150,0.15)" },
  arctic: { bg: "#f8fafb", text: "text-gray-900", sub: "text-gray-400", pill: "bg-gray-900/5 text-gray-600", wm: "rgba(0,0,0,0.12)" },
};

type ThemeKey = keyof typeof THEMES;

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function PhoneMockup({ src }: { src: string }) {
  return (
    <div className="relative w-[200px] h-[408px] rounded-[38px] bg-[#1a1a1a] p-[5px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_60px_-12px_rgba(0,0,0,0.8)]">
      <div className="w-full h-full rounded-[33px] overflow-hidden bg-black relative">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[80px] h-[24px] bg-black rounded-full z-20" />
        <img src={src} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
      </div>
    </div>
  );
}

function StarsRow({ rating, count, theme }: { rating: number; count: number; theme: ThemeKey }) {
  const isLight = theme === "arctic";
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>{rating.toFixed(1)}</span>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <svg key={s} className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-amber-400" : isLight ? "text-gray-200" : "text-white/10"}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className={`text-xs ${THEMES[theme].sub}`}>({formatCount(count)})</span>
    </div>
  );
}

// The card that gets captured as PNG
function ShowcaseCard({
  app, theme, showDescription, showScreenshots, showRating, showMeta, screenshotIndex,
}: {
  app: AppData; theme: ThemeKey; showDescription: boolean; showScreenshots: boolean; showRating: boolean; showMeta: boolean; screenshotIndex: number;
}) {
  const t = THEMES[theme];
  const isLight = theme === "arctic";

  return (
    <div
      className="relative overflow-hidden"
      style={{ backgroundColor: t.bg, width: "100%", aspectRatio: showScreenshots ? "16/10" : "16/8" }}
    >
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-12 py-10">
        <div className={`flex items-center gap-12 ${showScreenshots ? "" : "justify-center"}`}>
          {/* Left: App info */}
          <div className={`max-w-sm ${showScreenshots ? "" : "text-center"}`}>
            <div className={`mb-5 ${showScreenshots ? "" : "flex justify-center"}`}>
              <img
                src={app.artworkUrl512}
                alt={app.trackName}
                className="w-20 h-20 rounded-[18px] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)]"
                crossOrigin="anonymous"
              />
            </div>

            <h1 className={`text-4xl font-bold ${t.text} leading-[1.1] tracking-tight mb-2`}>
              {app.trackName}
            </h1>
            <p className={`text-base ${t.sub} mb-4`}>{app.developerName}</p>

            {showRating && app.averageUserRating > 0 && (
              <div className={`mb-4 ${showScreenshots ? "" : "flex justify-center"}`}>
                <StarsRow rating={app.averageUserRating} count={app.userRatingCount} theme={theme} />
              </div>
            )}

            {showDescription && (
              <p className={`text-sm leading-relaxed ${t.sub} mb-5 line-clamp-2`}>
                {app.description}
              </p>
            )}

            {showMeta && (
              <div className={`flex flex-wrap gap-1.5 ${showScreenshots ? "" : "justify-center"}`}>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.pill}`}>{app.primaryGenreName}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.pill}`}>{app.formattedPrice}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.pill}`}>v{app.version}</span>
              </div>
            )}
          </div>

          {/* Right: Phone mockups */}
          {showScreenshots && app.screenshotUrls.length > 0 && (
            <div className="flex items-end gap-4 shrink-0">
              <PhoneMockup src={app.screenshotUrls[screenshotIndex % app.screenshotUrls.length]} />
              {app.screenshotUrls.length > 1 && (
                <div className="opacity-60 -translate-y-6">
                  <PhoneMockup src={app.screenshotUrls[(screenshotIndex + 1) % app.screenshotUrls.length]} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className={`absolute bottom-3 left-0 right-0 flex items-center justify-center`}>
        <a
          href={app.trackViewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-medium text-xs transition-all ${
            isLight ? "bg-gray-900/10 text-gray-600" : "bg-white/[0.06] text-white/40"
          }`}
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          App Store
        </a>
      </div>
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
  const [showDescription, setShowDescription] = useState(true);
  const [showScreenshots, setShowScreenshots] = useState(true);
  const [showRating, setShowRating] = useState(true);
  const [showMeta, setShowMeta] = useState(true);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const t = THEMES[currentTheme];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pro = localStorage.getItem("appframe_pro");
      if (pro === "true") setIsPro(true);
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
      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: t.bg,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      if (!isPro) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const fontSize = Math.max(13, canvas.width * 0.01);
          ctx.font = `500 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.fillStyle = t.wm;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("appfra.me", canvas.width - 24, canvas.height - 16);
        }
      }

      const link = document.createElement("a");
      link.download = `${app.trackName.replace(/[^a-zA-Z0-9]/g, "-")}-appframe.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }

    setDownloading(false);
  }, [app.trackName, isPro, t.bg, t.wm]);

  const handleBuy = async () => {
    setProLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.status === 401) {
        // Not authenticated, redirect to login
        window.location.href = "/login";
        return;
      }
      if (data.alreadyPro) {
        localStorage.setItem("appframe_pro", "true");
        setIsPro(true);
        setShowProModal(false);
        setProLoading(false);
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      alert("Something went wrong. Please try again.");
    } catch {
      alert("Connection error. Please try again.");
    }
    setProLoading(false);
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] flex">
        {/* Left: Preview */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-3xl">
            {/* The actual card to capture */}
            <div ref={captureRef} className="rounded-2xl overflow-hidden shadow-2xl border border-white/[0.06]">
              <ShowcaseCard
                app={app}
                theme={currentTheme}
                showDescription={showDescription}
                showScreenshots={showScreenshots}
                showRating={showRating}
                showMeta={showMeta}
                screenshotIndex={screenshotIndex}
              />
            </div>
          </div>
        </div>

        {/* Right: Controls panel */}
        <div className="w-[320px] shrink-0 bg-[#111] border-l border-white/[0.06] p-6 overflow-y-auto flex flex-col gap-6">
          {/* Theme */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Theme</label>
            <div className="grid grid-cols-5 gap-2">
              {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setCurrentTheme(key)}
                  className={`aspect-square rounded-xl border-2 transition-all cursor-pointer ${
                    currentTheme === key ? "border-white scale-105" : "border-white/10 hover:border-white/30"
                  }`}
                  style={{ backgroundColor: THEMES[key].bg }}
                  title={key}
                />
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div>
            <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Elements</label>
            <div className="space-y-2">
              {[
                { label: "Screenshots", value: showScreenshots, set: setShowScreenshots },
                { label: "Description", value: showDescription, set: setShowDescription },
                { label: "Rating", value: showRating, set: setShowRating },
                { label: "Meta info", value: showMeta, set: setShowMeta },
              ].map((toggle) => (
                <button
                  key={toggle.label}
                  onClick={() => toggle.set(!toggle.value)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer"
                >
                  <span className="text-sm text-white/70">{toggle.label}</span>
                  <div className={`w-9 h-5 rounded-full transition-all relative ${toggle.value ? "bg-white" : "bg-white/10"}`}>
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${toggle.value ? "right-0.5 bg-black" : "left-0.5 bg-white/30"}`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot selector */}
          {showScreenshots && app.screenshotUrls.length > 2 && (
            <div>
              <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">Screenshot</label>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {app.screenshotUrls.slice(0, 6).map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenshotIndex(i)}
                    className={`shrink-0 w-12 h-24 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      screenshotIndex === i ? "border-white" : "border-white/10 opacity-50 hover:opacity-80"
                    }`}
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Download */}
          <div className="space-y-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer disabled:opacity-50"
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 font-medium text-sm hover:bg-white/[0.08] transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                Remove watermark — $5
              </button>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-2 text-emerald-400 text-xs font-medium">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                PRO — No watermark
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
            <button onClick={() => setShowProModal(false)} className="absolute top-4 right-4 text-white/30 hover:text-white/60 cursor-pointer">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5">
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
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {proLoading ? "Redirecting to Stripe..." : "Unlock Pro — $5"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
