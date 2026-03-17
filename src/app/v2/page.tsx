"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AppData } from "../api/app/route";

export default function V2Page() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    const isDirectId = /^\d+$/.test(q.trim()) || q.includes("apps.apple.com");
    if (isDirectId) {
      const idMatch = q.match(/\/id(\d+)/) || [null, q.trim()];
      router.push(`/app/${idMatch[1]}`);
      return;
    }

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/app?q=${encodeURIComponent(q)}`, { signal: controller.signal });
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      if ((err as Error).name !== "AbortError") setResults([]);
    }
    setLoading(false);
  }, [router]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    debounceRef.current = setTimeout(() => doSearch(query), 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, doSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#0a0a12" }}>
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float"
            style={{
              width: Math.random() > 0.8 ? 2 : 1,
              height: Math.random() > 0.8 ? 2 : 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `rgba(255,255,255,${0.1 + Math.random() * 0.4})`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Cosmic glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-purple-600/[0.07] rounded-full blur-[150px]" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-600/[0.05] rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-600/[0.05] rounded-full blur-[130px]" />

      {/* ============ HERO SECTION ============ */}
      <section className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center pt-20">
          {/* Left: text + search */}
          <div>
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
              <span>🔥</span>
              <span>#1 tool for indie app launches</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-white leading-[1.1] tracking-tight mb-6">
              Turn your App Store link into a{" "}
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                viral launch image
              </span>{" "}
              in seconds.
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-lg">
              Generate stunning, share-ready images for Twitter, LinkedIn and Product Hunt in one click.
            </p>

            {/* Search input */}
            <form onSubmit={handleSearch} className="relative max-w-lg">
              <div className="v2-search-wrapper">
                <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#12121e] relative z-10">
                  {/* App Store icon */}
                  <svg className="w-5 h-5 text-purple-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.807 14.49l-1.795 3.11a.75.75 0 01-1.299-.75l1.674-2.9H5.25a.75.75 0 110-1.5h3.557c.068 0 .135.006.2.016L10.5 10.08l1.5 2.598-1.693 2.935a.208.208 0 01-.028.039l-.022.028L8.807 14.49zm2.193-4.73L9.5 7.16l-.75 1.3a.75.75 0 01-1.299-.75L8.7 5.46a.75.75 0 011.299 0L13 10.5h4.75a.75.75 0 110 1.5h-3.019l1.769 3.064a.75.75 0 01-1.299.75L13 12.25l-1-.866L11 9.76zm3.25-4.51a.75.75 0 011.299.75l-5.5 9.526a.75.75 0 01-1.298-.75l5.5-9.526z" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Paste App Store URL or search by name..."
                    className="flex-1 bg-transparent text-white placeholder-zinc-500 text-base focus:outline-none"
                  />
                  {loading && (
                    <div className="w-5 h-5 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
                  )}
                </div>
              </div>
            </form>

            {/* Social proof */}
            <div className="flex items-center gap-3 mt-6 text-zinc-500 text-sm">
              <div className="flex -space-x-2">
                {["#6366f1", "#8b5cf6", "#a855f7", "#ec4899"].map((c, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-[#0a0a12] flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: c }}
                  >
                    {["S", "M", "A", "J"][i]}
                  </div>
                ))}
              </div>
              <span>Used by <strong className="text-zinc-300">1,200+</strong> indie hackers</span>
            </div>

            {/* Search results */}
            {searched && results.length > 0 && (
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg animate-fade-in">
                {results.map((app) => (
                  <button
                    key={app.trackId}
                    onClick={() => router.push(`/app/${app.trackId}`)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all text-left cursor-pointer"
                  >
                    <img
                      src={app.artworkUrl512}
                      alt={app.trackName}
                      className="w-12 h-12 rounded-xl"
                    />
                    <div className="min-w-0">
                      <p className="text-white font-semibold text-sm truncate">{app.trackName}</p>
                      <p className="text-zinc-400 text-xs truncate">{app.developerName}</p>
                      <p className="text-zinc-500 text-[11px]">{app.primaryGenreName}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {searched && !loading && results.length === 0 && (
              <p className="mt-6 text-zinc-500 text-sm animate-fade-in">No apps found. Try a different search.</p>
            )}

            <p className="mt-6 text-zinc-600 text-xs">
              Tip: You can also go directly to <code className="text-zinc-500">appfra.me/app/APP_ID</code>
            </p>
          </div>

          {/* Right: Phone mockup */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              {/* Glow behind phone */}
              <div className="absolute inset-0 bg-purple-500/20 blur-[80px] rounded-full scale-75" />

              {/* Phone frame */}
              <div className="relative w-[300px] h-[600px] rounded-[48px] bg-gradient-to-b from-zinc-700 to-zinc-800 p-[3px] shadow-[0_0_80px_-20px_rgba(139,92,246,0.3)]">
                <div className="w-full h-full rounded-[45px] bg-[#0e0e1a] overflow-hidden relative">
                  {/* Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-black rounded-full z-20" />

                  {/* Screen content */}
                  <div className="absolute inset-0 p-6 pt-14 flex flex-col items-center">
                    {/* Mini card preview */}
                    <div className="w-full rounded-3xl bg-gradient-to-br from-[#1a1030] to-[#0d1025] border border-purple-500/20 p-6 mt-4">
                      <p className="text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">Just Approved</p>

                      {/* App icon placeholder */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 mb-3 flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>

                      <h3 className="text-white font-bold text-lg mb-1">YourApp</h3>
                      <p className="text-zinc-400 text-xs mb-3">by Indie Dev</p>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 mb-3">
                        {[1,2,3,4,5].map(s => (
                          <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-zinc-400 text-[10px] ml-1">5.0</span>
                      </div>

                      <span className="inline-block px-3 py-1 rounded-full text-[10px] font-medium bg-purple-500/20 text-purple-300 border border-purple-500/20">
                        Productivity
                      </span>
                    </div>

                    {/* Bottom buttons */}
                    <div className="mt-4 flex gap-2 w-full">
                      <div className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-center text-white text-xs font-semibold">
                        Download PNG
                      </div>
                      <div className="py-2.5 px-4 rounded-xl bg-white/10 text-white text-xs font-semibold">
                        Share
                      </div>
                    </div>

                    {/* Theme dots */}
                    <div className="flex gap-2 mt-4">
                      {["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"].map((c, i) => (
                        <div
                          key={i}
                          className="w-5 h-5 rounded-full border-2"
                          style={{
                            background: c,
                            borderColor: i === 0 ? "white" : "transparent",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold text-white text-center mb-4">How it works</h2>
        <p className="text-zinc-500 text-center mb-14 text-sm">Three steps. Zero design skills needed.</p>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Paste your App Store link",
              desc: "Drop any App Store URL or search by name. We fetch everything automatically.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                </svg>
              ),
            },
            {
              step: "2",
              title: "Pick a style",
              desc: "Choose from 5 beautiful themes. Dark, light, colorful — match your brand.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="13.5" cy="6.5" r="2.5" />
                  <circle cx="17.5" cy="10.5" r="2.5" />
                  <circle cx="8.5" cy="7.5" r="2.5" />
                  <circle cx="6.5" cy="12.5" r="2.5" />
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12a10 10 0 005.012 8.662" />
                </svg>
              ),
            },
            {
              step: "3",
              title: "Share everywhere",
              desc: "Export a high-res PNG perfect for Twitter, LinkedIn, or Product Hunt.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                </svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="text-center p-8 rounded-3xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/20 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/20 flex items-center justify-center mx-auto mb-5 text-purple-400 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all">
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider mb-2">
                Step {item.step}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Connecting arrows (desktop) */}
        <div className="hidden md:flex justify-center -mt-[calc(50%+1rem)] pointer-events-none">
          {/* Arrows are implied by layout */}
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Built specifically for{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                App Store launches
              </span>
            </h2>
            <p className="text-zinc-400 mb-8">
              No more fiddling with Figma templates or hiring a designer. AppFrame knows exactly what makes a great launch image.
            </p>

            <ul className="space-y-4">
              {[
                "Auto-fetch app data from the App Store",
                "Pre-made viral templates that convert",
                "Perfect dimensions for Twitter & LinkedIn",
                "One-click high-res PNG export",
                "No account required to try",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <span className="text-zinc-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href="#v2-pricing"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/25"
            >
              Get started free
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Feature mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full" />
            <div className="relative rounded-3xl bg-gradient-to-br from-[#12121e] to-[#0e0e1a] border border-white/[0.08] p-8 shadow-2xl">
              {/* Fake browser bar */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                <div className="flex-1 ml-3 h-7 rounded-lg bg-white/[0.04] flex items-center px-3">
                  <span className="text-zinc-600 text-[10px]">appfra.me/app/123456</span>
                </div>
              </div>

              {/* Showcase preview */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1a1030] to-[#0d1025] border border-purple-500/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                    <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-purple-400 text-[10px] font-semibold uppercase tracking-wider">Just Approved</p>
                    <h4 className="text-white font-bold text-base mt-0.5">MyAwesomeApp</h4>
                    <p className="text-zinc-500 text-xs">by Cool Developer</p>
                    <div className="flex items-center gap-0.5 mt-1.5">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme selector mock */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  {["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"].map((c, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full"
                      style={{
                        background: c,
                        boxShadow: i === 0 ? `0 0 0 2px #0e0e1a, 0 0 0 3px ${c}` : "none",
                      }}
                    />
                  ))}
                </div>
                <div className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-[11px] font-semibold">
                  Download
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ EXAMPLES CAROUSEL ============ */}
      <section className="relative z-10 py-24 overflow-hidden">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          See what you can create
        </h2>
        <p className="text-zinc-500 text-center mb-12 text-sm">
          Beautiful showcase images generated in seconds
        </p>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a12] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a12] to-transparent z-10" />
          <div className="flex gap-6 animate-marquee">
            {[
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "/examples/whatsapp-icon.jpg", screenshot: "/examples/whatsapp-ss.jpg", bg: "#0a0015", genre: "Social", tagline: "Approved!" },
              { name: "Spotify", developer: "Spotify AB", icon: "/examples/spotify-icon.jpg", screenshot: "/examples/spotify-ss.jpg", bg: "#001020", genre: "Music", tagline: "Just launched!" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "/examples/telegram-icon.jpg", screenshot: "/examples/telegram-ss.jpg", bg: "#080812", genre: "Messaging", tagline: "Now available" },
              { name: "Notion", developer: "Notion Labs", icon: "/examples/notion-icon.jpg", screenshot: "", bg: "#120810", genre: "Productivity", tagline: "10K downloads" },
              { name: "Duolingo", developer: "Duolingo", icon: "/examples/duolingo-icon.jpg", screenshot: "", bg: "#0a0015", genre: "Education", tagline: "v2.0 is here!" },
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "/examples/whatsapp-icon.jpg", screenshot: "/examples/whatsapp-ss.jpg", bg: "#0a0015", genre: "Social", tagline: "Approved!" },
              { name: "Spotify", developer: "Spotify AB", icon: "/examples/spotify-icon.jpg", screenshot: "/examples/spotify-ss.jpg", bg: "#001020", genre: "Music", tagline: "Just launched!" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "/examples/telegram-icon.jpg", screenshot: "/examples/telegram-ss.jpg", bg: "#080812", genre: "Messaging", tagline: "Now available" },
              { name: "Notion", developer: "Notion Labs", icon: "/examples/notion-icon.jpg", screenshot: "", bg: "#120810", genre: "Productivity", tagline: "10K downloads" },
              { name: "Duolingo", developer: "Duolingo", icon: "/examples/duolingo-icon.jpg", screenshot: "", bg: "#0a0015", genre: "Education", tagline: "v2.0 is here!" },
            ].map((ex, i) => (
              <div key={i} className={`shrink-0 ${ex.screenshot ? "w-[480px]" : "w-[300px]"} rounded-3xl overflow-hidden border border-purple-500/10 shadow-2xl`} style={{ backgroundColor: ex.bg }}>
                <div className={`flex items-center gap-6 p-8 ${!ex.screenshot ? "justify-center" : ""}`}>
                  <div className={`${ex.screenshot ? "flex-1" : ""} min-w-0 ${!ex.screenshot ? "text-center" : ""}`}>
                    <div className={`${!ex.screenshot ? "flex justify-center" : ""}`}>
                      <img src={ex.icon} alt={ex.name} className="w-14 h-14 rounded-[12px] shadow-lg mb-3" />
                    </div>
                    {ex.tagline && <p className="text-purple-300/70 text-sm font-medium mb-1">{ex.tagline}</p>}
                    <h3 className="text-white font-bold text-xl leading-tight">{ex.name}</h3>
                    <p className="text-white/40 text-xs mt-1">{ex.developer}</p>
                    <div className={`flex items-center gap-1 mt-2 ${!ex.screenshot ? "justify-center" : ""}`}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-300/60 border border-purple-500/10">{ex.genre}</span>
                  </div>
                  {ex.screenshot && (
                    <div className="shrink-0 w-[120px] h-[245px] rounded-[24px] bg-[#1a1a2e] p-[3px] shadow-[0_0_0_1px_rgba(139,92,246,0.15),0_15px_40px_-8px_rgba(0,0,0,0.8)]">
                      <div className="w-full h-full rounded-[21px] overflow-hidden bg-black relative">
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[48px] h-[14px] bg-black rounded-full z-10" />
                        <img src={ex.screenshot} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="v2-pricing" className="relative z-10 max-w-4xl mx-auto px-6 py-24 scroll-mt-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple pricing</h2>
        <p className="text-zinc-500 text-center mb-12 text-sm">
          Create beautiful app showcases for free. Go Pro when you need clean exports.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {/* Free */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/[0.06] p-8">
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-wider mb-4">Free</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$0</span>
            </div>
            <p className="text-zinc-600 text-sm mb-8">Free forever</p>
            <ul className="space-y-3">
              {["Unlimited showcase images", "All themes included", "5 beautiful themes", "Small watermark on downloads"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-400">
                  <svg className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-3xl bg-white/[0.04] border border-purple-500/20 p-8 relative shadow-[0_0_40px_-15px_rgba(139,92,246,0.15)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-semibold">
              Recommended
            </div>
            <p className="text-purple-300/70 text-sm font-medium uppercase tracking-wider mb-4">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$5</span>
            </div>
            <p className="text-zinc-600 text-sm mb-8">One-time payment</p>
            <ul className="space-y-3">
              {["Everything in Free", "No watermark on downloads", "High-resolution PNG export", "Lifetime access"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-zinc-300">
                  <svg className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-10">FAQ</h3>
          <div className="space-y-6">
            {[
              { q: "What do I get for free?", a: "Unlimited showcase images for any iOS app. Free downloads include a small @AppFrame watermark." },
              { q: "What does Pro unlock?", a: "Removes the watermark and gives you high-res PNG exports, perfect for social media and press kits." },
              { q: "Is it a subscription?", a: "No. $5 one-time, yours forever." },
              { q: "Can I get a refund?", a: "Contact us within 7 days for a full refund, no questions asked." },
            ].map((faq, i) => (
              <div key={i} className="border-b border-white/[0.06] pb-6">
                <h4 className="text-white font-semibold mb-2">{faq.q}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-zinc-600 text-sm">
            <span>Made with</span>
            <svg className="w-4 h-4 text-purple-400/60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            <span>by <a href="https://simoneruggiero.com/?utm_source=appshot&utm_medium=footer" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-200 transition-colors">Simone Ruggiero</a></span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-zinc-600">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()} AppFrame</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
