"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import QRCode from "qrcode";
import type { AppData } from "../../api/app/route";

const THEMES = {
  noir: { bg: "#080808", gradient: "", text: "text-white", sub: "text-white/50", pill: "bg-white/[0.06] text-white/70", wm: "rgba(255,255,255,0.25)", qrFg: "#ffffff", qrBg: "#080808" },
  midnight: { bg: "#0a0a1a", gradient: "linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 50%, #0a0a2a 100%)", text: "text-white", sub: "text-indigo-200/50", pill: "bg-indigo-500/10 text-indigo-200/70", wm: "rgba(200,200,255,0.2)", qrFg: "#c0c0ff", qrBg: "#0a0a1a" },
  cosmic: { bg: "#0a0015", gradient: "linear-gradient(135deg, #0a0015 0%, #1a0030 40%, #0d0020 100%)", text: "text-white", sub: "text-purple-200/50", pill: "bg-purple-500/10 text-purple-200/70", wm: "rgba(200,180,255,0.2)", qrFg: "#e0d0ff", qrBg: "#0a0015" },
  ocean: { bg: "#001020", gradient: "linear-gradient(135deg, #001020 0%, #002040 50%, #001530 100%)", text: "text-white", sub: "text-cyan-200/50", pill: "bg-cyan-500/10 text-cyan-200/70", wm: "rgba(180,220,255,0.2)", qrFg: "#b0e0ff", qrBg: "#001020" },
  forest: { bg: "#001008", gradient: "linear-gradient(135deg, #001008 0%, #002010 50%, #001808 100%)", text: "text-white", sub: "text-emerald-200/50", pill: "bg-emerald-500/10 text-emerald-200/70", wm: "rgba(180,255,200,0.2)", qrFg: "#b0ffc0", qrBg: "#001008" },
  ember: { bg: "#120800", gradient: "linear-gradient(135deg, #120800 0%, #201000 50%, #180a00 100%)", text: "text-white", sub: "text-orange-200/50", pill: "bg-orange-500/10 text-orange-200/70", wm: "rgba(255,200,150,0.2)", qrFg: "#ffd0a0", qrBg: "#120800" },
  rose: { bg: "#150010", gradient: "linear-gradient(135deg, #150010 0%, #250018 50%, #1a0012 100%)", text: "text-white", sub: "text-pink-200/50", pill: "bg-pink-500/10 text-pink-200/70", wm: "rgba(255,180,200,0.2)", qrFg: "#ffb0c8", qrBg: "#150010" },
  sunset: { bg: "#1a0a00", gradient: "linear-gradient(135deg, #1a0a00 0%, #2a1000 30%, #1a0015 70%, #100020 100%)", text: "text-white", sub: "text-amber-200/50", pill: "bg-amber-500/10 text-amber-200/70", wm: "rgba(255,220,150,0.2)", qrFg: "#ffe0a0", qrBg: "#1a0a00" },
  arctic: { bg: "#f8fafb", gradient: "linear-gradient(135deg, #f8fafb 0%, #eef2f7 50%, #f0f4f8 100%)", text: "text-gray-900", sub: "text-gray-400", pill: "bg-gray-900/5 text-gray-600", wm: "rgba(0,0,0,0.15)", qrFg: "#1a1a1a", qrBg: "#f8fafb" },
  snow: { bg: "#ffffff", gradient: "linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #fafafa 100%)", text: "text-gray-900", sub: "text-gray-400", pill: "bg-gray-100 text-gray-600", wm: "rgba(0,0,0,0.12)", qrFg: "#1a1a1a", qrBg: "#ffffff" },
};

type ThemeKey = keyof typeof THEMES;

const FONTS = [
  { id: "geist", label: "Geist", css: "var(--font-geist-sans), -apple-system, sans-serif", google: "" },
  { id: "inter", label: "Inter", css: "'Inter', sans-serif", google: "Inter:wght@400;500;600;700" },
  { id: "dm-sans", label: "DM Sans", css: "'DM Sans', sans-serif", google: "DM+Sans:wght@400;500;600;700" },
  { id: "jakarta", label: "Jakarta", css: "'Plus Jakarta Sans', sans-serif", google: "Plus+Jakarta+Sans:wght@400;500;600;700" },
  { id: "satoshi", label: "Satoshi", css: "'Outfit', sans-serif", google: "Outfit:wght@400;500;600;700" },
  { id: "space", label: "Space", css: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@400;500;600;700" },
  { id: "sora", label: "Sora", css: "'Sora', sans-serif", google: "Sora:wght@400;500;600;700" },
  { id: "poppins", label: "Poppins", css: "'Poppins', sans-serif", google: "Poppins:wght@400;500;600;700" },
  { id: "playfair", label: "Playfair", css: "'Playfair Display', serif", google: "Playfair+Display:wght@400;500;600;700" },
  { id: "mono", label: "Mono", css: "'JetBrains Mono', monospace", google: "JetBrains+Mono:wght@400;500;600;700" },
];

const ASPECTS = [
  { id: "16:9", label: "16:9", desc: "Twitter / X", ratio: "16/9" },
  { id: "4:3", label: "4:3", desc: "Landscape", ratio: "4/3" },
  { id: "1:1", label: "1:1", desc: "Instagram", ratio: "1/1" },
  { id: "auto", label: "Auto", desc: "Fit content", ratio: "" },
];

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function proxyImg(url: string) {
  if (url.includes("mzstatic.com")) return `/api/image?url=${encodeURIComponent(url)}`;
  return url;
}

function PhoneMockup({ src, size = "md" }: { src: string; size?: "sm" | "md" }) {
  const w = size === "sm" ? "w-[160px] h-[326px] rounded-[30px]" : "w-[200px] h-[408px] rounded-[38px]";
  const inner = size === "sm" ? "rounded-[26px]" : "rounded-[33px]";
  const notch = size === "sm" ? "w-[64px] h-[20px]" : "w-[80px] h-[24px]";
  return (
    <div className={`relative ${w} bg-[#1a1a1a] p-[5px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_60px_-12px_rgba(0,0,0,0.8)]`}>
      <div className={`w-full h-full ${inner} overflow-hidden bg-black relative`}>
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 ${notch} bg-black rounded-full z-20`} />
        <img src={proxyImg(src)} alt="" className="w-full h-full object-cover" />
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

function ShowcaseCard({
  app, theme, showDescription, showScreenshots, showRating, showMeta, showQR, screenshotIndex,
  phoneCount, fontFamily, aspectRatio, tagline, qrDataUrl, customAppName, customDeveloper, isPro, headline,
}: {
  app: AppData; theme: ThemeKey; showDescription: boolean; showScreenshots: boolean;
  showRating: boolean; showMeta: boolean; showQR: boolean; screenshotIndex: number;
  phoneCount: number; fontFamily: string; aspectRatio: string; tagline: string; qrDataUrl: string;
  customAppName: string; customDeveloper: string; isPro: boolean; headline: string;
}) {
  const t = THEMES[theme];
  const isLight = theme === "arctic";
  const hasScreenshots = showScreenshots && app.screenshotUrls.length > 0;
  const isSquare = aspectRatio === "1/1";

  const displayName = customAppName || app.trackName;
  const displayDeveloper = customDeveloper || app.developerName;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        backgroundColor: t.bg,
        background: t.gradient || t.bg,
        width: "100%",
        aspectRatio: aspectRatio || (hasScreenshots ? "16/10" : "16/8"),
        fontFamily,
      }}
    >
      {/* Subtle noise/grain texture overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: `linear-gradient(180deg, ${isLight ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)"} 0%, transparent 40%, ${isLight ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.15)"} 100%)` }} />
      {/* Inner shadow for depth */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ boxShadow: `inset 0 1px 0 ${isLight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.04)"}, inset 0 -1px 0 rgba(0,0,0,0.2)` }} />

      {/* Watermark for free users */}
      {!isPro && (
        <div className="absolute inset-0 z-[3] flex items-center justify-center pointer-events-none select-none">
          <span
            className={`text-sm font-medium ${isLight ? "text-black" : "text-white"}`}
            style={{ opacity: 0.12, letterSpacing: "0.05em" }}
          >
            @AppFrame
          </span>
        </div>
      )}

      <div className={`relative z-10 h-full flex items-center justify-center px-8 py-6 ${isSquare ? "flex-col gap-4" : ""}`}>
        <div className={`flex items-center gap-10 ${hasScreenshots && !isSquare ? "" : "justify-center"} ${isSquare ? "flex-col text-center" : ""}`}>
          {/* App info */}
          <div className={`${hasScreenshots && !isSquare ? "max-w-sm" : isSquare ? "max-w-md" : "max-w-lg text-center"}`}>
            {headline && (
              <p className={`text-2xl font-bold ${t.text} mb-4 opacity-90`}>{headline}</p>
            )}

            <div className={`mb-4 ${!hasScreenshots || isSquare ? "flex justify-center" : ""}`}>
              <img
                src={proxyImg(app.artworkUrl512)}
                alt={displayName}
                className="w-20 h-20 rounded-[18px] shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)]"
              />
            </div>

            <h1 className={`text-4xl font-bold ${t.text} leading-[1.1] tracking-tight mb-2`}>
              {displayName}
            </h1>
            <p className={`text-base ${t.sub} mb-3`}>{displayDeveloper}</p>

            {tagline && (
              <p className={`text-lg font-medium ${t.text} mb-3 opacity-80`}>{tagline}</p>
            )}

            {showRating && app.averageUserRating > 0 && (
              <div className={`mb-3 ${!hasScreenshots || isSquare ? "flex justify-center" : ""}`}>
                <StarsRow rating={app.averageUserRating} count={app.userRatingCount} theme={theme} />
              </div>
            )}

            {showDescription && !tagline && (
              <p className={`text-sm leading-relaxed ${t.sub} mb-4 line-clamp-2`}>{app.description}</p>
            )}

            {showMeta && (
              <div className={`flex flex-wrap gap-1.5 ${!hasScreenshots || isSquare ? "justify-center" : ""}`}>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.pill}`}>{app.primaryGenreName}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.pill}`}>{app.formattedPrice}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${t.pill}`}>v{app.version}</span>
              </div>
            )}

            {showQR && qrDataUrl && (
              <div className={`mt-4 ${!hasScreenshots || isSquare ? "flex justify-center" : ""}`}>
                <img src={qrDataUrl} alt="QR Code" className="w-16 h-16 rounded-lg" />
              </div>
            )}
          </div>

          {/* Phone mockups */}
          {hasScreenshots && (
            <div className={`flex items-end gap-3 shrink-0 ${isSquare ? "justify-center" : ""}`}>
              <PhoneMockup src={app.screenshotUrls[screenshotIndex % app.screenshotUrls.length]} size={phoneCount >= 3 || isSquare ? "sm" : "md"} />
              {phoneCount >= 2 && app.screenshotUrls.length > 1 && (
                <div className={`opacity-60 ${isSquare ? "-translate-y-4" : "-translate-y-6"}`}>
                  <PhoneMockup src={app.screenshotUrls[(screenshotIndex + 1) % app.screenshotUrls.length]} size={phoneCount >= 3 || isSquare ? "sm" : "md"} />
                </div>
              )}
              {phoneCount >= 3 && app.screenshotUrls.length > 2 && (
                <div className={`opacity-40 ${isSquare ? "-translate-y-2" : "-translate-y-3"}`}>
                  <PhoneMockup src={app.screenshotUrls[(screenshotIndex + 2) % app.screenshotUrls.length]} size="sm" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center">
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs ${isLight ? "text-gray-400" : "text-white/20"}`}>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Available on the App Store
        </span>
      </div>
    </div>
  );
}

// --- Toggle switch ---
function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all cursor-pointer"
    >
      <span className="text-sm text-white/70">{label}</span>
      <div className={`w-9 h-5 rounded-full transition-all relative ${value ? "bg-white" : "bg-white/10"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${value ? "right-0.5 bg-black" : "left-0.5 bg-white/30"}`} />
      </div>
    </button>
  );
}

// --- Section label ---
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3 block">{children}</label>;
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
  const [showQR, setShowQR] = useState(false);
  const [phoneCount, setPhoneCount] = useState(2);
  const [screenshotIndex, setScreenshotIndex] = useState(0);
  const [currentFont, setCurrentFont] = useState(0);
  const [aspectRatio, setAspectRatio] = useState("16/9");
  const [tagline, setTagline] = useState("");
  const [customAppName, setCustomAppName] = useState("");
  const [headline, setHeadline] = useState("Approved! ✅");
  const [customDeveloper, setCustomDeveloper] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  const t = THEMES[currentTheme];

  // Load Google Font dynamically
  useEffect(() => {
    const font = FONTS[currentFont];
    if (!font.google) return;
    const id = `gfont-${font.id}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
    document.head.appendChild(link);
  }, [currentFont]);

  // Generate QR code
  useEffect(() => {
    if (showQR && app.trackViewUrl) {
      QRCode.toDataURL(app.trackViewUrl, {
        width: 128,
        margin: 1,
        color: { dark: THEMES[currentTheme].qrFg, light: THEMES[currentTheme].qrBg },
      }).then(setQrDataUrl).catch(() => {});
    }
  }, [showQR, app.trackViewUrl, currentTheme]);

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
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Bake watermark into canvas for free users (can't be removed via DevTools)
      if (!isPro) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Center watermark
          const fontSize = Math.max(16, canvas.width * 0.02);
          ctx.font = `600 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.fillStyle = t.wm;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("@AppFrame", canvas.width / 2, canvas.height / 2);

          // Bottom-right small text
          const smallFont = Math.max(11, canvas.width * 0.008);
          ctx.font = `500 ${smallFont}px -apple-system, BlinkMacSystemFont, sans-serif`;
          ctx.fillStyle = t.wm;
          ctx.textAlign = "right";
          ctx.textBaseline = "bottom";
          ctx.fillText("appfra.me", canvas.width - 16, canvas.height - 12);
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
  }, [app.trackName, t.bg]);

  const handleBuy = async () => {
    setProLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.status === 401) { window.location.href = "/login"; return; }
      if (data.alreadyPro) {
        localStorage.setItem("appframe_pro", "true");
        setIsPro(true);
        setShowProModal(false);
        setProLoading(false);
        return;
      }
      if (data.url) { window.location.href = data.url; return; }
      alert("Something went wrong. Please try again.");
    } catch { alert("Connection error. Please try again."); }
    setProLoading(false);
  };

  return (
    <>
      <div className="h-screen bg-[#0a0a0a] flex overflow-hidden">
        {/* Left: Preview */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-3xl">
            <div ref={captureRef} className="rounded-3xl overflow-hidden shadow-2xl border border-white/[0.06]">
              <ShowcaseCard
                app={app}
                theme={currentTheme}
                showDescription={showDescription}
                showScreenshots={showScreenshots}
                showRating={showRating}
                showMeta={showMeta}
                showQR={showQR}
                screenshotIndex={screenshotIndex}
                phoneCount={phoneCount}
                fontFamily={FONTS[currentFont].css}
                aspectRatio={aspectRatio}
                tagline={tagline}
                qrDataUrl={qrDataUrl}
                customAppName={customAppName}
                customDeveloper={customDeveloper}
                isPro={isPro}
                headline={headline}
              />
            </div>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="w-[320px] shrink-0 bg-[#111] border-l border-white/[0.06] p-5 overflow-y-auto flex flex-col gap-5">
          {/* Theme */}
          <div>
            <SectionLabel>Theme</SectionLabel>
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

          {/* Aspect Ratio */}
          <div>
            <SectionLabel>Aspect Ratio</SectionLabel>
            <div className="grid grid-cols-4 gap-1.5">
              {ASPECTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAspectRatio(a.ratio)}
                  className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                    aspectRatio === a.ratio
                      ? "bg-white text-black"
                      : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"
                  }`}
                >
                  <div className="text-xs font-semibold">{a.label}</div>
                  <div className="text-[10px] opacity-60">{a.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div>
            <SectionLabel>Font</SectionLabel>
            <select
              value={currentFont}
              onChange={(e) => setCurrentFont(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-white/20 cursor-pointer appearance-none"
              style={{ fontFamily: FONTS[currentFont].css }}
            >
              {FONTS.map((f, i) => (
                <option key={f.id} value={i} style={{ fontFamily: f.css, backgroundColor: "#111", color: "white" }}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Phone count */}
          {showScreenshots && (
            <div>
              <SectionLabel>Phones</SectionLabel>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPhoneCount(n)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      phoneCount === n
                        ? "bg-white text-black"
                        : "bg-white/[0.04] text-white/50 hover:bg-white/[0.08]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Screenshot selector */}
          {showScreenshots && app.screenshotUrls.length > 2 && (
            <div>
              <SectionLabel>Start from</SectionLabel>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {app.screenshotUrls.slice(0, 8).map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenshotIndex(i)}
                    className={`shrink-0 w-10 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      screenshotIndex === i ? "border-white" : "border-white/10 opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img src={proxyImg(url)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div>
            <SectionLabel>Content</SectionLabel>
            <div className="space-y-2">
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Approved! ✅"
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20"
              />
              <input
                type="text"
                value={customAppName}
                onChange={(e) => setCustomAppName(e.target.value)}
                placeholder={app.trackName}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20"
              />
              <input
                type="text"
                value={customDeveloper}
                onChange={(e) => setCustomDeveloper(e.target.value)}
                placeholder={app.developerName}
                className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Tagline */}
          <div>
            <SectionLabel>Custom tagline</SectionLabel>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Just launched! 🚀"
              className="w-full px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/20"
            />
          </div>

          {/* Toggles */}
          <div>
            <SectionLabel>Elements</SectionLabel>
            <div className="space-y-1.5">
              <Toggle label="Screenshots" value={showScreenshots} onChange={setShowScreenshots} />
              <Toggle label="Description" value={showDescription} onChange={setShowDescription} />
              <Toggle label="Rating" value={showRating} onChange={setShowRating} />
              <Toggle label="Meta info" value={showMeta} onChange={setShowMeta} />
              <Toggle label="QR Code" value={showQR} onChange={setShowQR} />
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Download */}
          <div className="space-y-2.5 pt-4 border-t border-white/[0.06]">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {downloading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.25" /><path d="M12 2a10 10 0 019.95 9" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              )}
              {downloading ? "Generating..." : isPro ? "Download HD PNG" : "Download PNG"}
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
