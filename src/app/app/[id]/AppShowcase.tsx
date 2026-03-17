"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import html2canvas from "html2canvas-pro";
import QRCode from "qrcode";
import type { AppData } from "../../api/app/route";

interface ThemePreset {
  name: string;
  // Visual
  bg: string;
  gradient: string;
  thumb: string;
  text: string;
  sub: string;
  pill: string;
  wm: string;
  qrFg: string;
  qrBg: string;
  // Defaults
  font: number;
  phones: number;
  aspect: string;
  showDesc: boolean;
  showRating: boolean;
  showMeta: boolean;
}

const THEMES: Record<string, ThemePreset> = {
  // --- Dark themes ---
  noir:     { name: "Noir", bg: "#080808", gradient: "radial-gradient(ellipse at 30% 20%, #1a1a2e 0%, #0d0d0d 40%, #080808 100%)", thumb: "linear-gradient(135deg, #1a1a2e, #080808)", text: "text-white", sub: "text-white/50", pill: "bg-white/[0.06] text-white/70", wm: "rgba(255,255,255,0.25)", qrFg: "#ffffff", qrBg: "#080808", font: 0, phones: 2, aspect: "16/9", showDesc: true, showRating: true, showMeta: true },
  midnight: { name: "Midnight", bg: "#0a0a1a", gradient: "radial-gradient(ellipse at 70% 30%, #1e1e4a 0%, #12123a 30%, #0a0a1a 70%), linear-gradient(135deg, #0a0a1a 0%, #15153a 100%)", thumb: "linear-gradient(135deg, #2a2a5a, #0a0a1a)", text: "text-white", sub: "text-indigo-200/50", pill: "bg-indigo-500/10 text-indigo-200/70", wm: "rgba(200,200,255,0.2)", qrFg: "#c0c0ff", qrBg: "#0a0a1a", font: 8, phones: 1, aspect: "16/9", showDesc: true, showRating: true, showMeta: false },
  cosmic:   { name: "Cosmic", bg: "#0a0015", gradient: "radial-gradient(ellipse at 20% 50%, #2a0050 0%, #150030 30%, #0a0015 70%), radial-gradient(ellipse at 80% 20%, #1a0040 0%, transparent 50%)", thumb: "linear-gradient(135deg, #3a0070, #0a0015)", text: "text-white", sub: "text-purple-200/50", pill: "bg-purple-500/10 text-purple-200/70", wm: "rgba(200,180,255,0.2)", qrFg: "#e0d0ff", qrBg: "#0a0015", font: 6, phones: 2, aspect: "1/1", showDesc: false, showRating: true, showMeta: true },
  ocean:    { name: "Ocean", bg: "#001020", gradient: "radial-gradient(ellipse at 60% 40%, #003060 0%, #002040 30%, #001020 70%), radial-gradient(ellipse at 10% 80%, #002050 0%, transparent 50%)", thumb: "linear-gradient(135deg, #004080, #001020)", text: "text-white", sub: "text-cyan-200/50", pill: "bg-cyan-500/10 text-cyan-200/70", wm: "rgba(180,220,255,0.2)", qrFg: "#b0e0ff", qrBg: "#001020", font: 1, phones: 2, aspect: "16/9", showDesc: true, showRating: true, showMeta: true },
  forest:   { name: "Forest", bg: "#001008", gradient: "radial-gradient(ellipse at 40% 60%, #003020 0%, #002015 30%, #001008 70%), radial-gradient(ellipse at 80% 20%, #002818 0%, transparent 50%)", thumb: "linear-gradient(135deg, #004030, #001008)", text: "text-white", sub: "text-emerald-200/50", pill: "bg-emerald-500/10 text-emerald-200/70", wm: "rgba(180,255,200,0.2)", qrFg: "#b0ffc0", qrBg: "#001008", font: 2, phones: 1, aspect: "3/2", showDesc: true, showRating: true, showMeta: false },
  ember:    { name: "Ember", bg: "#120800", gradient: "radial-gradient(ellipse at 30% 30%, #301800 0%, #201000 30%, #120800 70%), radial-gradient(ellipse at 70% 70%, #281200 0%, transparent 50%)", thumb: "linear-gradient(135deg, #402000, #120800)", text: "text-white", sub: "text-orange-200/50", pill: "bg-orange-500/10 text-orange-200/70", wm: "rgba(255,200,150,0.2)", qrFg: "#ffd0a0", qrBg: "#120800", font: 7, phones: 2, aspect: "16/9", showDesc: true, showRating: true, showMeta: true },
  rose:     { name: "Rose", bg: "#150010", gradient: "radial-gradient(ellipse at 50% 30%, #350020 0%, #200015 30%, #150010 70%), radial-gradient(ellipse at 20% 80%, #2a0018 0%, transparent 50%)", thumb: "linear-gradient(135deg, #450030, #150010)", text: "text-white", sub: "text-pink-200/50", pill: "bg-pink-500/10 text-pink-200/70", wm: "rgba(255,180,200,0.2)", qrFg: "#ffb0c8", qrBg: "#150010", font: 4, phones: 1, aspect: "1/1", showDesc: false, showRating: true, showMeta: false },
  sunset:   { name: "Sunset", bg: "#1a0a00", gradient: "radial-gradient(ellipse at 20% 40%, #3a1500 0%, #2a0a00 25%, transparent 50%), radial-gradient(ellipse at 80% 60%, #250020 0%, #1a0015 25%, #1a0a00 70%)", thumb: "linear-gradient(135deg, #4a1a00, #250020)", text: "text-white", sub: "text-amber-200/50", pill: "bg-amber-500/10 text-amber-200/70", wm: "rgba(255,220,150,0.2)", qrFg: "#ffe0a0", qrBg: "#1a0a00", font: 5, phones: 2, aspect: "1.91/1", showDesc: true, showRating: true, showMeta: true },
  neon:     { name: "Neon", bg: "#050505", gradient: "radial-gradient(ellipse at 50% 50%, #0a1a2a 0%, #050510 40%, #050505 100%), linear-gradient(135deg, #00ff8820 0%, #ff00ff10 100%)", thumb: "linear-gradient(135deg, #00ff88, #ff00ff)", text: "text-white", sub: "text-emerald-300/50", pill: "bg-emerald-500/10 text-emerald-300/70", wm: "rgba(0,255,136,0.2)", qrFg: "#00ff88", qrBg: "#050505", font: 8, phones: 1, aspect: "16/9", showDesc: false, showRating: true, showMeta: false },
  galaxy:   { name: "Galaxy", bg: "#06001a", gradient: "radial-gradient(ellipse at 30% 20%, #1a0050 0%, #0d0030 30%, #06001a 70%), radial-gradient(ellipse at 70% 80%, #000840 0%, transparent 50%)", thumb: "linear-gradient(135deg, #2a0070, #000840)", text: "text-white", sub: "text-blue-200/50", pill: "bg-blue-500/10 text-blue-200/70", wm: "rgba(180,180,255,0.2)", qrFg: "#c0c0ff", qrBg: "#06001a", font: 6, phones: 1, aspect: "9/16", showDesc: false, showRating: true, showMeta: false },
  // --- Light themes ---
  arctic:   { name: "Arctic", bg: "#f0f4f8", gradient: "radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f0f4f8 50%, #e8edf3 100%)", thumb: "linear-gradient(135deg, #e8edf5, #d0d8e8)", text: "text-gray-900", sub: "text-gray-400", pill: "bg-gray-900/5 text-gray-600", wm: "rgba(0,0,0,0.15)", qrFg: "#1a1a1a", qrBg: "#f0f4f8", font: 1, phones: 2, aspect: "16/9", showDesc: true, showRating: true, showMeta: true },
  snow:     { name: "Snow", bg: "#ffffff", gradient: "radial-gradient(ellipse at 30% 20%, #f5f0ff 0%, #ffffff 40%, #f8fafb 100%)", thumb: "linear-gradient(135deg, #f0eaff, #ffffff)", text: "text-gray-900", sub: "text-gray-400", pill: "bg-gray-100 text-gray-600", wm: "rgba(0,0,0,0.12)", qrFg: "#1a1a1a", qrBg: "#ffffff", font: 2, phones: 1, aspect: "1/1", showDesc: false, showRating: true, showMeta: false },
  cream:    { name: "Cream", bg: "#faf6f0", gradient: "radial-gradient(ellipse at 40% 30%, #fff8ee 0%, #faf6f0 50%, #f0ebe0 100%)", thumb: "linear-gradient(135deg, #f0e8d8, #faf6f0)", text: "text-gray-900", sub: "text-amber-800/40", pill: "bg-amber-900/5 text-amber-900/60", wm: "rgba(0,0,0,0.1)", qrFg: "#1a1a1a", qrBg: "#faf6f0", font: 8, phones: 2, aspect: "3/2", showDesc: true, showRating: true, showMeta: true },
  mint:     { name: "Mint", bg: "#f0faf5", gradient: "radial-gradient(ellipse at 50% 30%, #e8fff0 0%, #f0faf5 50%, #e0f5ea 100%)", thumb: "linear-gradient(135deg, #d0f0e0, #f0faf5)", text: "text-gray-900", sub: "text-emerald-700/40", pill: "bg-emerald-900/5 text-emerald-800/60", wm: "rgba(0,0,0,0.1)", qrFg: "#1a1a1a", qrBg: "#f0faf5", font: 4, phones: 1, aspect: "16/9", showDesc: true, showRating: true, showMeta: false },
  lavender: { name: "Lavender", bg: "#f5f0fa", gradient: "radial-gradient(ellipse at 60% 30%, #efe5ff 0%, #f5f0fa 50%, #ece5f5 100%)", thumb: "linear-gradient(135deg, #e0d0f0, #f5f0fa)", text: "text-gray-900", sub: "text-purple-700/40", pill: "bg-purple-900/5 text-purple-800/60", wm: "rgba(0,0,0,0.1)", qrFg: "#1a1a1a", qrBg: "#f5f0fa", font: 7, phones: 2, aspect: "1/1", showDesc: true, showRating: true, showMeta: true },
  // --- Bold/Gradient themes ---
  aurora:   { name: "Aurora", bg: "#0a1a20", gradient: "linear-gradient(135deg, #0d4040 0%, #1a0050 50%, #2a0060 100%), radial-gradient(ellipse at 30% 70%, #006060 0%, transparent 50%)", thumb: "linear-gradient(135deg, #00aaaa, #8800ff)", text: "text-white", sub: "text-teal-200/50", pill: "bg-teal-500/10 text-teal-200/70", wm: "rgba(100,255,220,0.2)", qrFg: "#80ffd0", qrBg: "#0a1a20", font: 5, phones: 2, aspect: "16/9", showDesc: true, showRating: true, showMeta: true },
  fire:     { name: "Fire", bg: "#1a0000", gradient: "linear-gradient(135deg, #4a0000 0%, #8a2000 50%, #ff6000 100%)", thumb: "linear-gradient(135deg, #cc3300, #ff8800)", text: "text-white", sub: "text-orange-200/50", pill: "bg-orange-500/10 text-orange-200/70", wm: "rgba(255,180,100,0.2)", qrFg: "#ffc080", qrBg: "#1a0000", font: 7, phones: 1, aspect: "1.91/1", showDesc: false, showRating: true, showMeta: false },
  electric: { name: "Electric", bg: "#000820", gradient: "linear-gradient(135deg, #001050 0%, #002080 50%, #00c8ff 100%)", thumb: "linear-gradient(135deg, #0040cc, #00e0ff)", text: "text-white", sub: "text-cyan-200/50", pill: "bg-cyan-500/10 text-cyan-200/70", wm: "rgba(100,220,255,0.2)", qrFg: "#80e0ff", qrBg: "#000820", font: 8, phones: 3, aspect: "16/9", showDesc: true, showRating: true, showMeta: true },
  velvet:   { name: "Velvet", bg: "#1a0008", gradient: "radial-gradient(ellipse at 40% 40%, #400018 0%, #280010 40%, #1a0008 100%)", thumb: "linear-gradient(135deg, #600028, #1a0008)", text: "text-white", sub: "text-rose-200/50", pill: "bg-rose-500/10 text-rose-200/70", wm: "rgba(255,150,180,0.2)", qrFg: "#ffa0c0", qrBg: "#1a0008", font: 8, phones: 1, aspect: "3/2", showDesc: true, showRating: true, showMeta: false },
  carbon:   { name: "Carbon", bg: "#1a1a1a", gradient: "radial-gradient(ellipse at 50% 50%, #2a2a2a 0%, #1e1e1e 40%, #1a1a1a 100%)", thumb: "linear-gradient(135deg, #3a3a3a, #1a1a1a)", text: "text-white", sub: "text-gray-400", pill: "bg-white/[0.06] text-gray-300", wm: "rgba(255,255,255,0.2)", qrFg: "#ffffff", qrBg: "#1a1a1a", font: 0, phones: 2, aspect: "16/9", showDesc: true, showRating: true, showMeta: true },
};

const LIGHT_THEMES = new Set(["arctic", "snow", "cream", "mint", "lavender"]);

type ThemeKey = keyof typeof THEMES;

const FREE_THEME_KEYS = ["noir", "ocean", "ember", "arctic", "snow"];
const FREE_THEMES = new Set(FREE_THEME_KEYS);
const FREE_FONTS = 4; // First 4 fonts are free (Geist, Inter, DM Sans, Jakarta)

// Show free themes first, then pro themes
const THEME_KEYS_SORTED = [...FREE_THEME_KEYS, ...Object.keys(THEMES).filter(k => !FREE_THEMES.has(k))];

const FONTS = [
  { id: "geist", label: "Geist", css: "var(--font-geist-sans), -apple-system, sans-serif", google: "" },
  { id: "inter", label: "Inter", css: "'Inter', sans-serif", google: "Inter:wght@400;500;600;700" },
  { id: "dm-sans", label: "DM Sans", css: "'DM Sans', sans-serif", google: "DM+Sans:wght@400;500;600;700" },
  { id: "jakarta", label: "Jakarta", css: "'Plus Jakarta Sans', sans-serif", google: "Plus+Jakarta+Sans:wght@400;500;600;700" },
  { id: "satoshi", label: "Satoshi", css: "'Outfit', sans-serif", google: "Outfit:wght@400;500;600;700" },
  { id: "space", label: "Space", css: "'Space Grotesk', sans-serif", google: "Space+Grotesk:wght@400;500;600;700" },
  { id: "sora", label: "Sora", css: "'Sora', sans-serif", google: "Sora:wght@400;500;600;700" },
  { id: "poppins", label: "Poppins", css: "'Poppins', sans-serif", google: "Poppins:wght@400;500;600;700" },

  { id: "mono", label: "Mono", css: "'JetBrains Mono', monospace", google: "JetBrains+Mono:wght@400;500;600;700" },
];

const ASPECTS = [
  { id: "twitter", label: "Twitter / X", desc: "16:9", ratio: "16/9" },
  { id: "instagram-post", label: "Instagram", desc: "1:1", ratio: "1/1" },
  { id: "instagram-story", label: "Story", desc: "9:16", ratio: "9/16" },
  { id: "linkedin", label: "LinkedIn", desc: "1.91:1", ratio: "1.91/1" },
  { id: "producthunt", label: "Product Hunt", desc: "3:2", ratio: "3/2" },
  { id: "auto", label: "Auto", desc: "Fit", ratio: "" },
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

function PhoneMockup({ src, scale = 1 }: { src: string; scale?: number }) {
  const w = 200 * scale;
  const h = 408 * scale;
  const r = 38 * scale;
  const ri = 33 * scale;
  const nw = 80 * scale;
  const nh = 24 * scale;
  const pad = 5 * scale;
  return (
    <div
      className="relative bg-[#1a1a1a]"
      style={{ width: w, height: h, borderRadius: r, padding: pad, border: "1px solid rgba(255,255,255,0.1)" }}
    >
      <div className="w-full h-full overflow-hidden bg-black relative" style={{ borderRadius: ri }}>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black rounded-full z-20" style={{ width: nw, height: nh }} />
        <img src={proxyImg(src)} alt="" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

function StarsRow({ rating, count, theme }: { rating: number; count: number; theme: string }) {
  const isLight = LIGHT_THEMES.has(theme);
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
  app: AppData; theme: string; showDescription: boolean; showScreenshots: boolean;
  showRating: boolean; showMeta: boolean; showQR: boolean; screenshotIndex: number;
  phoneCount: number; fontFamily: string; aspectRatio: string; tagline: string; qrDataUrl: string;
  customAppName: string; customDeveloper: string; isPro: boolean; headline: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentScale, setContentScale] = useState(1);

  // Auto-scale content to fit card whenever anything changes
  useEffect(() => {
    const recalc = () => {
      const card = cardRef.current;
      const content = contentRef.current;
      const wrapper = content?.parentElement;
      if (!card || !content || !wrapper) return;
      // Reset to natural size to measure
      content.style.transform = "scale(1)";
      requestAnimationFrame(() => {
        // Use wrapper's content box (excluding padding) as available space
        const style = getComputedStyle(wrapper);
        const cw = wrapper.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
        const ch = wrapper.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
        // Measure the inner content child to get true dimensions (scrollWidth can be clamped by flex)
        const inner = content.firstElementChild as HTMLElement | null;
        const sw = inner ? inner.scrollWidth : content.scrollWidth;
        const sh = inner ? inner.scrollHeight : content.scrollHeight;
        const scale = Math.min(cw / sw, ch / sh, 1);
        setContentScale(Math.round(scale * 1000) / 1000);
      });
    };
    recalc();
    // Also recalc on window resize
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [aspectRatio, phoneCount, showDescription, showRating, showMeta, showQR, showScreenshots, headline, tagline, customAppName, customDeveloper, fontFamily, theme]);
  const t = THEMES[theme];
  const isLight = LIGHT_THEMES.has(theme);
  const hasScreenshots = showScreenshots && app.screenshotUrls.length > 0;
  const isSquare = aspectRatio === "1/1";
  const isVertical = aspectRatio === "9/16";
  const isWide = aspectRatio === "1.91/1" || aspectRatio === "16/9";
  const isCompact = isVertical || isSquare;

  const displayName = customAppName || app.trackName;
  const displayDeveloper = customDeveloper || app.developerName;

  // Scale sizes based on aspect ratio
  const iconSize = isCompact ? "w-14 h-14 rounded-[12px]" : "w-20 h-20 rounded-[18px]";
  const titleSize = isCompact ? "text-2xl" : isWide ? "text-3xl" : "text-4xl";
  const headlineSize = isCompact ? "text-lg" : "text-2xl";
  const maxPhones = isVertical ? 1 : isSquare ? Math.min(phoneCount, 2) : phoneCount;
  const phoneScale = isCompact ? 0.7 : maxPhones >= 3 ? 0.8 : maxPhones >= 2 ? 0.9 : 1;
  const phoneScaleSm = isCompact ? 0.6 : 0.65;

  return (
    <div
      ref={cardRef}
      data-showcase-card
      className="relative overflow-hidden"
      style={{
        backgroundColor: t.bg,
        background: t.gradient || t.bg,
        width: "100%",
        aspectRatio: aspectRatio || (hasScreenshots ? "16/10" : "16/8"),
        fontFamily,
      }}
    >
      {/* Subtle noise/grain texture overlay — hidden during export via onclone */}
      <div className="showcase-overlay absolute inset-0 z-[1] opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundSize: "128px 128px" }} />
      {/* Subtle gradient overlay for depth */}
      <div className="showcase-overlay absolute inset-0 z-[2] pointer-events-none" style={{ background: `linear-gradient(180deg, ${isLight ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.02)"} 0%, transparent 40%, ${isLight ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.15)"} 100%)` }} />
      {/* Inner shadow for depth */}
      <div className="showcase-overlay absolute inset-0 z-[2] pointer-events-none" style={{ boxShadow: `inset 0 1px 0 ${isLight ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.04)"}, inset 0 -1px 0 rgba(0,0,0,0.2)` }} />

      {/* Watermark for free users */}
      {!isPro && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none select-none">
          <span
            className={`text-sm font-medium ${isLight ? "text-black" : "text-white"}`}
            style={{ opacity: 0.12, letterSpacing: "0.05em" }}
          >
            @AppFrame
          </span>
        </div>
      )}

      <div className={`relative z-10 h-full overflow-hidden ${isCompact ? "px-5 py-6 pb-12" : "px-10 py-8 pb-12"}`}>
      <div
        ref={contentRef}
        className={`h-full flex items-center justify-center ${isVertical ? "flex-col" : ""}`}
        style={{ transform: `scale(${contentScale})`, transformOrigin: "center center" }}
      >
        <div className={`flex items-center ${isCompact ? "gap-4" : "gap-10"} ${hasScreenshots && !isCompact ? "" : "justify-center"} ${isCompact ? "flex-col text-center" : ""}`}>
          {/* App info */}
          <div className={`${hasScreenshots && !isCompact ? "max-w-sm" : isCompact ? "max-w-xs" : "max-w-lg text-center"}`}>
            {headline && (
              <p className={`${headlineSize} font-bold ${t.text} ${isCompact ? "mb-2" : "mb-4"} opacity-90`}>{headline}</p>
            )}

            <div className={`${isCompact ? "mb-2" : "mb-4"} ${!hasScreenshots || isCompact ? "flex justify-center" : ""}`}>
              <img
                src={proxyImg(app.artworkUrl512)}
                alt={displayName}
                className={`${iconSize} shadow-[0_8px_30px_-8px_rgba(0,0,0,0.5)]`}
              />
            </div>

            <h1 className={`${titleSize} font-bold ${t.text} leading-[1.1] tracking-tight mb-1`}>
              {displayName}
            </h1>
            <p className={`${isCompact ? "text-sm" : "text-base"} ${t.sub} ${isCompact ? "mb-2" : "mb-3"}`}>{displayDeveloper}</p>

            {tagline && (
              <p className={`${isCompact ? "text-sm" : "text-lg"} font-medium ${t.text} ${isCompact ? "mb-2" : "mb-3"} opacity-80`}>{tagline}</p>
            )}

            {showRating && app.averageUserRating > 0 && (
              <div className={`${isCompact ? "mb-2" : "mb-3"} ${!hasScreenshots || isCompact ? "flex justify-center" : ""}`}>
                <StarsRow rating={app.averageUserRating} count={app.userRatingCount} theme={theme} />
              </div>
            )}

            {showDescription && !tagline && !isVertical && (
              <p className={`text-sm leading-relaxed ${t.sub} mb-3 line-clamp-2`}>{app.description}</p>
            )}

            {showMeta && (
              <div className={`flex flex-wrap gap-1 ${!hasScreenshots || isCompact ? "justify-center" : ""}`}>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.pill}`}>{app.primaryGenreName}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.pill}`}>{app.formattedPrice}</span>
                {!isVertical && <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${t.pill}`}>v{app.version}</span>}
              </div>
            )}

            {showQR && qrDataUrl && !isVertical && (
              <div className={`mt-3 flex items-center gap-2 ${!hasScreenshots || isCompact ? "justify-center" : ""}`}>
                <img src={qrDataUrl} alt="QR Code" className={`${isCompact ? "w-12 h-12" : "w-16 h-16"} rounded-lg`} />
                <div className={`flex items-center gap-1 ${t.sub} text-[10px] font-medium`}>
                  <span>←</span>
                  <span>Scan to<br />download</span>
                </div>
              </div>
            )}
          </div>

          {/* Phone mockups */}
          {hasScreenshots && (
            <div className={`flex items-end ${isCompact ? "gap-2" : "gap-3"} shrink-0 ${isCompact ? "justify-center" : ""}`}>
              <PhoneMockup src={app.screenshotUrls[screenshotIndex % app.screenshotUrls.length]} scale={phoneScale} />
              {maxPhones >= 2 && app.screenshotUrls.length > 1 && (
                <div className={`opacity-60 ${isCompact ? "-translate-y-3" : "-translate-y-4"}`}>
                  <PhoneMockup src={app.screenshotUrls[(screenshotIndex + 1) % app.screenshotUrls.length]} scale={phoneScale} />
                </div>
              )}
              {maxPhones >= 3 && app.screenshotUrls.length > 2 && (
                <div className="opacity-40 -translate-y-2">
                  <PhoneMockup src={app.screenshotUrls[(screenshotIndex + 2) % app.screenshotUrls.length]} scale={phoneScaleSm} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Bottom */}
      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center z-20">
        <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs backdrop-blur-md ${isLight ? "bg-white/60 text-gray-500" : "bg-black/40 text-white/60"}`}>
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
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
    >
      <span className="text-sm text-gray-600">{label}</span>
      <div className={`w-9 h-5 rounded-full transition-all relative ${value ? "bg-gray-900" : "bg-gray-200"}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${value ? "right-0.5 bg-white" : "left-0.5 bg-white"}`} />
      </div>
    </button>
  );
}

// --- Section label ---
function SectionLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">{children}</label>;
}

export default function AppShowcase({
  app,
  theme: initialTheme,
}: {
  app: AppData;
  theme: string;
  accentColor: string;
}) {
  const resolvedInitialTheme = initialTheme in THEMES ? initialTheme : "ocean";
  const initialPreset = THEMES[resolvedInitialTheme];

  // Persist state in localStorage per app (survives refresh & tab close)
  const storageKey = `appframe_${app.trackId}`;
  const saved = typeof window !== "undefined" ? (() => { try { return JSON.parse(localStorage.getItem(storageKey) || "{}"); } catch { return {}; } })() : {};

  const [currentTheme, setCurrentTheme] = useState(saved.theme ?? resolvedInitialTheme);
  const [showDescription, setShowDescription] = useState(saved.showDesc ?? initialPreset.showDesc);
  const [showScreenshots, setShowScreenshots] = useState(saved.showScreens ?? true);
  const [showRating, setShowRating] = useState(saved.showRating ?? initialPreset.showRating);
  const [showMeta, setShowMeta] = useState(saved.showMeta ?? initialPreset.showMeta);
  const [showQR, setShowQR] = useState(saved.showQR ?? false);
  const [phoneCount, setPhoneCount] = useState(saved.phones ?? initialPreset.phones);
  const [screenshotIndex, setScreenshotIndex] = useState(saved.ssIdx ?? 0);
  const [currentFont, setCurrentFont] = useState(saved.font ?? initialPreset.font);
  const [aspectRatio, setAspectRatio] = useState(saved.aspect ?? initialPreset.aspect);
  const [themesExpanded, setThemesExpanded] = useState(false);
  const [tagline, setTagline] = useState(saved.tagline ?? "");
  const [customAppName, setCustomAppName] = useState(saved.appName ?? "");
  const [headline, setHeadline] = useState(saved.headline ?? "Approved! ✅");
  const [customDeveloper, setCustomDeveloper] = useState(saved.dev ?? "");
  const [qrDataUrl, setQrDataUrl] = useState("");
  // Save state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        theme: currentTheme, showDesc: showDescription, showScreens: showScreenshots,
        showRating, showMeta, showQR, phones: phoneCount, ssIdx: screenshotIndex,
        font: currentFont, aspect: aspectRatio, tagline, appName: customAppName,
        headline, dev: customDeveloper,
      }));
    } catch {}
  }, [currentTheme, showDescription, showScreenshots, showRating, showMeta, showQR, phoneCount, screenshotIndex, currentFont, aspectRatio, tagline, customAppName, headline, customDeveloper, storageKey]);

  const [downloading, setDownloading] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [proLoading, setProLoading] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [userSession, setUserSession] = useState<{ name?: string; image?: string } | null>(null);
  const captureRef = useRef<HTMLDivElement>(null);

  const t = THEMES[currentTheme];

  const applyThemePreset = useCallback((key: string) => {
    const preset = THEMES[key];
    setCurrentTheme(key);
    setCurrentFont(preset.font);
    setPhoneCount(preset.phones);
    setAspectRatio(preset.aspect);
    setShowDescription(preset.showDesc);
    setShowRating(preset.showRating);
    setShowMeta(preset.showMeta);
  }, []);

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
      // localStorage is only a cache to avoid watermark flash — server is authoritative
      const cached = localStorage.getItem("appframe_pro") === "true";
      if (cached) setIsPro(true);
      fetch("/api/verify").then(r => r.json()).then(data => {
        if (data.pro) {
          localStorage.setItem("appframe_pro", "true");
          setIsPro(true);
        } else {
          localStorage.removeItem("appframe_pro");
          localStorage.removeItem("appframe_email");
          setIsPro(false);
        }
      }).catch(() => {});
      // Fetch user session
      fetch("/api/auth/session").then(r => r.json()).then(data => {
        if (data?.user) setUserSession(data.user);
      }).catch(() => {});
    }
  }, []);

  const handleDownload = useCallback(async () => {
    if (!captureRef.current) return;
    setDownloading(true);
    try {
      // Server-side Pro check before download — prevents localStorage tampering
      const verifyRes = await fetch("/api/verify").then(r => r.json()).catch(() => ({ pro: false }));
      const verifiedPro = verifyRes.pro === true;
      const raw = await html2canvas(captureRef.current, {
        backgroundColor: null,
        scale: verifiedPro ? 3 : 1,
        useCORS: true,
        allowTaint: true,
        logging: false,
        onclone: (_doc: Document, el: HTMLElement) => {
          // Remove overlays that html2canvas renders with artifacts
          el.querySelectorAll(".showcase-overlay").forEach(o => o.remove());
          // Keep gradient background — only overlays cause artifacts
        },
      });

      // Clip to rounded corners to match preview
      const exportScale = verifiedPro ? 3 : 1;
      const radius = 24 * exportScale; // rounded-3xl ≈ 24px
      const canvas = document.createElement("canvas");
      canvas.width = raw.width;
      canvas.height = raw.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.roundRect(0, 0, raw.width, raw.height, radius);
        ctx.clip();
        ctx.drawImage(raw, 0, 0);

        // Bake watermark into canvas for free users (server-verified)
        if (!verifiedPro) {
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
      if (res.status === 401) { window.location.href = `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`; return; }
      if (data.alreadyPro) {
        localStorage.setItem("appframe_pro", "true");
        setIsPro(true);
        setShowProModal(false);
        setProLoading(false);
        return;
      }
      if (data.url) { localStorage.setItem("appframe_return_url", window.location.pathname); window.location.href = data.url; return; }
      alert("Something went wrong. Please try again.");
    } catch { alert("Connection error. Please try again."); }
    setProLoading(false);
  };

  return (
    <>
      <div className="h-screen bg-[#fafafa] flex overflow-hidden relative">
        {/* Left: Preview */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
          <div className="w-full max-w-3xl">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <div ref={captureRef}>
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
        </div>

        {/* Right: Controls */}
        <div className="w-[320px] shrink-0 bg-white border-l border-gray-200 flex flex-col">
          {/* Fixed header - User */}
          <div className="shrink-0 px-5 py-3 border-b border-gray-200 flex items-center justify-between">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Customize</span>
            {userSession && (
              <div className="relative">
                <button onClick={() => setShowAccountMenu(!showAccountMenu)} className="cursor-pointer">
                  {userSession.image ? (
                    <img src={userSession.image} alt="" className="w-7 h-7 rounded-full border border-gray-200 hover:border-gray-400 transition-all" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-900 text-[10px] font-medium transition-all">
                      {userSession.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>
                {showAccountMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
                    <div className="absolute right-0 top-9 z-50 w-40 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden">
                      <div className="px-3 py-2 border-b border-gray-200">
                        <p className="text-gray-900 text-xs font-medium truncate">{userSession.name}</p>
                      </div>
                      <button
                        onClick={async () => {
                          const csrfRes = await fetch("/api/auth/csrf");
                          const { csrfToken } = await csrfRes.json();
                          await fetch("/api/auth/signout", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: `csrfToken=${csrfToken}` });
                          window.location.href = "/";
                        }}
                        className="w-full px-3 py-2 text-left text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Scrollable controls */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
          {/* Theme */}
          <div className="pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Theme</label>
              <span className="text-xs font-medium text-gray-600">{THEMES[currentTheme].name}</span>
            </div>
            {/* First row: 8 circles + expand button */}
            <div className="flex items-center gap-2 flex-wrap">
              {THEME_KEYS_SORTED.slice(0, 8).map((key) => {
                const locked = !isPro && !FREE_THEMES.has(key);
                return (
                  <button
                    key={key}
                    onClick={() => locked ? setShowProModal(true) : applyThemePreset(key)}
                    className={`relative w-9 h-9 rounded-full border-2 transition-all cursor-pointer shrink-0 ${
                      currentTheme === key ? "border-white ring-2 ring-gray-900 scale-110" : locked ? "border-gray-200 opacity-50" : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={{ background: THEMES[key].thumb }}
                    title={locked ? `${THEMES[key].name} (Pro)` : THEMES[key].name}
                  >
                    {locked && (
                      <svg className="absolute inset-0 m-auto w-3.5 h-3.5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
                    )}
                  </button>
                );
              })}
              <button
                onClick={() => setThemesExpanded(!themesExpanded)}
                className="w-9 h-9 rounded-full border-2 border-gray-200 hover:border-gray-400 flex items-center justify-center cursor-pointer shrink-0 bg-gray-50 transition-all"
                title={themesExpanded ? "Show less" : "Show all themes"}
              >
                <svg className={`w-4 h-4 text-gray-500 transition-transform ${themesExpanded ? "rotate-45" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </button>
            </div>
            {/* Expanded grid */}
            {themesExpanded && (
              <div className="mt-3 grid grid-cols-5 gap-3">
                {THEME_KEYS_SORTED.map((key) => {
                  const locked = !isPro && !FREE_THEMES.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => locked ? setShowProModal(true) : applyThemePreset(key)}
                      className={`flex flex-col items-center gap-1 cursor-pointer group ${locked ? "opacity-50" : ""}`}
                    >
                      <div
                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                          currentTheme === key ? "border-white ring-2 ring-gray-900 scale-110" : locked ? "border-gray-200" : "border-gray-200 group-hover:border-gray-400"
                        }`}
                        style={{ background: THEMES[key].thumb }}
                      >
                        {locked && (
                          <svg className="absolute inset-0 m-auto w-3.5 h-3.5 text-white drop-shadow-md" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM15.1 8H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z"/></svg>
                        )}
                      </div>
                      <span className={`text-[10px] leading-tight ${currentTheme === key ? "text-gray-900 font-semibold" : "text-gray-400"}`}>
                        {THEMES[key].name}{locked ? " 🔒" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Aspect Ratio */}
          <div className="pb-3 border-b border-gray-100">
            <SectionLabel>Aspect Ratio</SectionLabel>
            <div className="grid grid-cols-3 gap-1.5">
              {ASPECTS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAspectRatio(a.ratio)}
                  className={`py-2 px-1 rounded-lg text-center transition-all cursor-pointer ${
                    aspectRatio === a.ratio
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <div className="text-xs font-semibold">{a.label}</div>
                  <div className="text-[10px] opacity-60">{a.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div className="pb-3 border-b border-gray-100">
            <SectionLabel>Font</SectionLabel>
            <select
              value={currentFont}
              onChange={(e) => {
                const idx = Number(e.target.value);
                if (!isPro && idx >= FREE_FONTS) { setShowProModal(true); return; }
                setCurrentFont(idx);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm focus:outline-none focus:border-gray-400 cursor-pointer appearance-none"
              style={{ fontFamily: FONTS[currentFont].css }}
            >
              {FONTS.map((f, i) => (
                <option key={f.id} value={i} style={{ fontFamily: f.css, backgroundColor: "white", color: "#111" }}>
                  {f.label}{!isPro && i >= FREE_FONTS ? " 🔒 Pro" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Phone count */}
          {showScreenshots && (
            <div className="pb-3 border-b border-gray-100">
              <SectionLabel>Phones</SectionLabel>
              <div className="grid grid-cols-3 gap-1.5">
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPhoneCount(n)}
                    className={`py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                      phoneCount === n
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
            <div className="pb-3 border-b border-gray-100">
              <SectionLabel>Start from</SectionLabel>
              <div className="flex gap-1.5 overflow-x-auto pb-1">
                {app.screenshotUrls.slice(0, 8).map((url, i) => (
                  <button
                    key={i}
                    onClick={() => setScreenshotIndex(i)}
                    className={`shrink-0 w-10 h-20 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                      screenshotIndex === i ? "border-gray-900" : "border-gray-200 opacity-40 hover:opacity-70"
                    }`}
                  >
                    <img src={proxyImg(url)} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="pb-3 border-b border-gray-100">
            <SectionLabel>Content</SectionLabel>
            <div className="space-y-2">
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Approved! ✅"
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
              <input
                type="text"
                value={customAppName}
                onChange={(e) => setCustomAppName(e.target.value)}
                placeholder={app.trackName}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
              <input
                type="text"
                value={customDeveloper}
                onChange={(e) => setCustomDeveloper(e.target.value)}
                placeholder={app.developerName}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />
            </div>
          </div>

          {/* Tagline */}
          <div className="pb-3 border-b border-gray-100">
            <SectionLabel>Custom tagline</SectionLabel>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Just launched! 🚀"
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Toggles */}
          <div className="pb-3 border-b border-gray-100">
            <SectionLabel>Elements</SectionLabel>
            <div className="space-y-1.5">
              <Toggle label="Screenshots" value={showScreenshots} onChange={setShowScreenshots} />
              <Toggle label="Description" value={showDescription} onChange={setShowDescription} />
              <Toggle label="Rating" value={showRating} onChange={setShowRating} />
              <Toggle label="Meta info" value={showMeta} onChange={setShowMeta} />
              <Toggle label="QR Code" value={showQR} onChange={setShowQR} />
            </div>
          </div>

          </div>

          {/* Fixed footer - Download & Share */}
          <div className="shrink-0 px-5 py-4 border-t border-gray-200 space-y-2">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-semibold text-sm hover:bg-gray-800 transition-all cursor-pointer disabled:opacity-50"
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

            <div className="flex gap-2">
              {/* Share button */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: `${app.trackName} — AppFrame`, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied!");
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-medium text-xs hover:bg-gray-50 transition-all cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>
                </svg>
                Share
              </button>

              {/* Pro button */}
              {!isPro ? (
                <button
                  onClick={() => setShowProModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 font-medium text-xs hover:bg-gray-50 transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  Pro — $5
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-center gap-1.5 py-2 text-emerald-400 text-xs font-medium">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  PRO
                </div>
              )}
            </div>
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
            <p className="text-white/40 text-sm mb-4">One-time payment, yours forever.</p>
            <ul className="space-y-2.5 mb-5">
              {["20+ premium themes", "No watermark on downloads", "High-resolution export (3x)", "All fonts included", "Lifetime access"].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-white/70">
                  <svg className="w-4 h-4 text-white/50 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex items-baseline gap-1 mb-5">
              <span className="text-3xl font-bold text-white">$5</span>
              <span className="text-white/30 text-sm ml-2">one-time</span>
            </div>
            <button
              onClick={handleBuy}
              disabled={proLoading}
              className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {proLoading ? "Redirecting to payment..." : "Unlock Pro — $5"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
