"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AppData } from "./api/app/route";

export default function Home() {
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

    // If it's a direct URL or ID, go straight to showcase
    const isDirectId = /^\d+$/.test(q.trim()) || q.includes("apps.apple.com");
    if (isDirectId) {
      const idMatch = q.match(/\/id(\d+)/) || [null, q.trim()];
      router.push(`/app/${idMatch[1]}`);
      return;
    }

    // Abort previous request
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

  // Debounced live search on typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 1) {
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
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-white via-gray-50/50 to-white">
      {/* Dot grid pattern */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "32px 32px", opacity: 0.3 }} />
      {/* Subtle bg elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-amber-100/30 via-orange-50/20 to-transparent rounded-full blur-[100px] -top-[400px]" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[80px]" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-50/30 rounded-full blur-[80px]" />
      <div className="absolute top-[60%] left-1/4 w-[500px] h-[500px] bg-amber-50/30 rounded-full blur-[100px]" />
      <div className="absolute top-[80%] right-1/4 w-[400px] h-[400px] bg-blue-50/30 rounded-full blur-[80px]" />

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-32 pb-16">
        <div className="w-full max-w-4xl text-center">
          {/* Badge */}
          <div className="animate-fade-in mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-sm font-medium">
              <span>🎉</span> The #1 showcase tool for indie devs
            </span>
          </div>

          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 leading-[1.1] tracking-tight whitespace-nowrap">
              Your app got approved.<br />Time to <span className="relative inline-block"><span className="relative z-10 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 bg-clip-text text-transparent">celebrate</span><span className="absolute -inset-3 bg-amber-400/10 rounded-2xl blur-lg" /></span>.
            </h1>
            <p className="text-gray-500 text-lg md:text-xl mb-10 max-w-xl mx-auto">
              Generate a stunning showcase image in seconds. Pick a theme, customize it, and share your launch on social media.
            </p>
          </div>

          <div className="animate-fade-in-delay max-w-2xl mx-auto relative">
            {/* Hand-drawn arrow + text */}
            <div className="absolute -left-40 -top-8 hidden lg:flex flex-col items-end select-none pointer-events-none">
              <p className="text-gray-700 text-xl -rotate-6 mr-2" style={{ fontFamily: "'Caveat', cursive" }}>Try now! It&apos;s free!</p>
              <svg className="w-28 h-16 text-gray-700 -mt-1" viewBox="0 0 160 80" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 5 C 10 25, 25 50, 60 58 C 90 64, 120 58, 142 48" />
                <path d="M132 40 L 145 49 L 135 55" />
              </svg>
            </div>

            <div className="search-wrapper">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Paste App Store URL or search by name..."
                className="w-full px-6 py-4 rounded-[18px] bg-white text-gray-900 placeholder-gray-400 text-lg focus:outline-none transition-all relative z-10 shadow-sm"
              />
            </div>
          </div>

          {/* Loading spinner */}
          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm animate-fade-in">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                <path d="M12 2a10 10 0 019.95 9" />
              </svg>
              Searching...
            </div>
          )}

          {/* Search results */}
          {!loading && searched && results.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in max-w-2xl mx-auto">
              {results.map((app) => (
                <button
                  key={app.trackId}
                  onClick={() => router.push(`/app/${app.trackId}`)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all text-left cursor-pointer"
                >
                  <img
                    src={app.artworkUrl512}
                    alt={app.trackName}
                    className="w-16 h-16 rounded-2xl shadow-sm"
                  />
                  <div className="min-w-0">
                    <p className="text-gray-900 font-semibold truncate">{app.trackName}</p>
                    <p className="text-gray-500 text-sm truncate">{app.developerName}</p>
                    <p className="text-gray-400 text-xs">{app.primaryGenreName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <p className="mt-8 text-gray-400 animate-fade-in">No apps found. Try a different search.</p>
          )}

          {/* Social proof */}
          <div className="mt-14 animate-fade-in-delay-2 space-y-6">
            {/* Avatars + count */}
            <div className="group flex items-center justify-center gap-3 relative cursor-default">
              <div className="flex -space-x-2">
                {[
                  "https://api.dicebear.com/9.x/avataaars/svg?seed=Marco&backgroundColor=b6e3f4",
                  "https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah&backgroundColor=ffd5dc",
                  "https://api.dicebear.com/9.x/avataaars/svg?seed=Alex&backgroundColor=d1f4d9",
                  "https://api.dicebear.com/9.x/avataaars/svg?seed=James&backgroundColor=ffe0b2",
                  "https://api.dicebear.com/9.x/avataaars/svg?seed=Nina&backgroundColor=e8d5f5",
                ].map((url, i) => (
                  <img key={i} src={url} alt="" className="w-9 h-9 rounded-full border-2 border-white shadow-sm bg-gray-100" />
                ))}
              </div>
              <p className="text-gray-500 text-sm">
                Loved by <span className="font-semibold text-gray-700">500+</span> indie developers
              </p>
              {/* Easter egg tooltip */}
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                <div className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg">
                  none of them exist, but who cares? 😄
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
              </div>
            </div>

            {/* Platforms */}
            <div className="flex items-center justify-center gap-6 text-gray-300">
              <span className="text-xl font-bold tracking-tight">𝕏</span>
              <span className="text-sm font-semibold">LinkedIn</span>
              <span className="text-sm font-semibold">Product Hunt</span>
              <span className="text-sm font-semibold">Instagram</span>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto pt-4">
              {[
                { text: "Made my app launch post look 10x more professional. Took literally 30 seconds.", name: "Marco K.", role: "iOS Developer" },
                { text: "Finally a tool that gets it. No more fiddling with Figma for a simple launch image.", name: "Sarah L.", role: "Indie Maker" },
                { text: "Used it for my Product Hunt launch. Got way more upvotes than usual.", name: "Alex P.", role: "Founder" },
              ].map((t, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <p className="text-gray-600 text-xs leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
                  <div>
                    <p className="text-gray-900 text-xs font-semibold">{t.name}</p>
                    <p className="text-gray-400 text-[10px]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Preview mockup */}
        <div className="mt-16 w-full max-w-4xl animate-fade-in-delay-2">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-gray-200/60 bg-[#080808]">
            <div className="flex items-center gap-8 p-8">
              <div className="flex-1">
                <p className="text-xl font-bold text-white mb-2">Approved! ✅</p>
                <img src="/examples/whatsapp-icon.jpg" alt="" className="w-14 h-14 rounded-xl mb-3" />
                <h3 className="text-2xl font-bold text-white">WhatsApp</h3>
                <p className="text-white/40 text-sm mt-1">WhatsApp Inc.</p>
                <div className="flex gap-1 mt-2">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-white/50">Social</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-white/50">Free</span>
                </div>
              </div>
              <div className="shrink-0 w-[140px] h-[286px] rounded-[28px] bg-[#1a1a1a] p-[4px] shadow-lg">
                <div className="w-full h-full rounded-[24px] overflow-hidden bg-black relative">
                  <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[56px] h-[16px] bg-black rounded-full z-10" />
                  <img src="/examples/whatsapp-ss.jpg" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-400 text-xs mt-4">Example output — yours will look even better ✨</p>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-14 animate-fade-in">
          How it works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Search your app",
              desc: "Paste an App Store link or search by name. We pull all the info automatically.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
              ),
            },
            {
              step: "2",
              title: "Choose a theme",
              desc: "Pick from 5 carefully crafted themes. Dark, light, colorful -- your call.",
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
              title: "Download & share",
              desc: "Export a high-quality PNG and share it on Twitter, Product Hunt, or anywhere.",
              icon: (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div key={item.step} className="relative">
              <div className="text-center p-6 rounded-3xl bg-gray-50 border border-gray-100">
                <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-4 text-gray-500 shadow-sm">
                  {item.icon}
                </div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Step {item.step}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
              {/* Arrow between cards */}
              {idx < 2 && (
                <div className="hidden md:flex absolute top-1/2 -right-5 -translate-y-1/2 z-10 text-gray-300">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Examples carousel */}
      <div id="examples" className="relative z-10 py-20 overflow-hidden scroll-mt-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
          See what you can create
        </h2>
        <p className="text-gray-500 text-center mb-12 text-sm">
          Beautiful showcase images generated in seconds
        </p>
        {/* Auto-scrolling infinite marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          <div className="flex gap-6 animate-marquee">
            {[
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "/examples/whatsapp-icon.jpg", screenshot: "/examples/whatsapp-ss.jpg", genre: "Social", tagline: "Approved! ✅" },
              { name: "Spotify", developer: "Spotify AB", icon: "/examples/spotify-icon.jpg", screenshot: "/examples/spotify-ss.jpg", bg: "#001020", genre: "Music", tagline: "Just launched! 🚀" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "/examples/telegram-icon.jpg", screenshot: "/examples/telegram-ss.jpg", bg: "#080808", genre: "Messaging", tagline: "Now available" },
              { name: "Notion", developer: "Notion Labs", icon: "/examples/notion-icon.jpg", screenshot: "", genre: "Productivity", tagline: "10K downloads 🎉" },
              { name: "Duolingo", developer: "Duolingo", icon: "/examples/duolingo-icon.jpg", screenshot: "", genre: "Education", tagline: "v2.0 is here!" },
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "/examples/whatsapp-icon.jpg", screenshot: "/examples/whatsapp-ss.jpg", genre: "Social", tagline: "Approved! ✅", bg: "#080808", text: "white" },
              { name: "Spotify", developer: "Spotify AB", icon: "/examples/spotify-icon.jpg", screenshot: "/examples/spotify-ss.jpg", genre: "Music", tagline: "Just launched! 🚀", bg: "#1a0030", text: "white" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "/examples/telegram-icon.jpg", screenshot: "/examples/telegram-ss.jpg", genre: "Messaging", tagline: "Now available", bg: "#002540", text: "white" },
              { name: "Notion", developer: "Notion Labs", icon: "/examples/notion-icon.jpg", screenshot: "", genre: "Productivity", tagline: "10K downloads 🎉", bg: "#f0f4f8", text: "dark" },
              { name: "Duolingo", developer: "Duolingo", icon: "/examples/duolingo-icon.jpg", screenshot: "", genre: "Education", tagline: "v2.0 is here!", bg: "#2a1500", text: "white" },
            ].map((ex, i) => {
              const isDark = ex.text === "white";
              return (
              <div key={i} className={`shrink-0 ${ex.screenshot ? "w-[480px]" : "w-[280px]"} rounded-3xl overflow-hidden shadow-lg ${isDark ? "" : "border border-gray-200"}`} style={{ backgroundColor: ex.bg }}>
                <div className={`flex items-center gap-6 p-7 ${!ex.screenshot ? "justify-center" : ""}`}>
                  <div className={`${ex.screenshot ? "flex-1" : ""} min-w-0 ${!ex.screenshot ? "text-center" : ""}`}>
                    <div className={`${!ex.screenshot ? "flex justify-center" : ""}`}>
                      <img src={ex.icon} alt={ex.name} className="w-14 h-14 rounded-[12px] shadow-md mb-3" />
                    </div>
                    {ex.tagline && <p className={`text-sm font-medium mb-1 ${isDark ? "text-amber-400" : "text-amber-600"}`}>{ex.tagline}</p>}
                    <h3 className={`font-bold text-xl leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>{ex.name}</h3>
                    <p className={`text-xs mt-1 ${isDark ? "text-white/40" : "text-gray-400"}`}>{ex.developer}</p>
                    <div className={`flex items-center gap-1 mt-2 ${!ex.screenshot ? "justify-center" : ""}`}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium ${isDark ? "bg-white/[0.08] text-white/50" : "bg-gray-100 text-gray-500"}`}>{ex.genre}</span>
                  </div>
                  {ex.screenshot && (
                    <div className={`shrink-0 w-[120px] h-[245px] rounded-[24px] ${isDark ? "bg-[#1a1a1a]" : "bg-gray-200"} p-[3px] shadow-lg`}>
                      <div className="w-full h-full rounded-[21px] overflow-hidden bg-black relative">
                        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[48px] h-[14px] bg-black rounded-full z-10" />
                        <img src={ex.screenshot} alt="" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div id="pricing" className="relative z-10 max-w-4xl mx-auto px-4 py-20 scroll-mt-20">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">Simple pricing</h2>
        <p className="text-gray-400 text-center mb-12 text-sm">
          Create beautiful app showcases for free. Go Pro when you need clean exports.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {/* Free */}
          <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8">
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-4">Free</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">$0</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">Free forever</p>
            <ul className="space-y-3">
              {[
                { text: "Unlimited showcase images", ok: true },
                { text: "5 themes", ok: true },
                { text: "Basic PNG export", ok: true },
                { text: "Watermark on downloads", ok: true },
                { text: "20+ premium themes", ok: false },
                { text: "No watermark", ok: false },
                { text: "High-resolution export (3x)", ok: false },
              ].map((item, i) => (
                <li key={i} className={`flex items-start gap-3 text-sm ${item.ok ? "text-gray-600" : "text-gray-300"}`}>
                  {item.ok ? (
                    <svg className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  ) : (
                    <svg className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                  )}
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-3xl bg-white border border-gray-300 p-8 relative shadow-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-semibold">
              Recommended
            </div>
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-4">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-gray-900">$5</span>
            </div>
            <p className="text-gray-400 text-sm mb-8">One-time payment</p>
            <ul className="space-y-3">
              {["Everything in Free", "20+ premium themes", "No watermark on downloads", "High-resolution PNG export (3x)", "All fonts included", "Lifetime access"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-gray-900 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-10">FAQ</h3>
          <div className="space-y-6">
            {[
              { q: "What do I get for free?", a: "Unlimited showcase images for any iOS app. Free downloads include a small @AppFrame watermark." },
              { q: "What does Pro unlock?", a: "Removes the watermark and gives you high-res PNG exports, perfect for social media and press kits." },
              { q: "Is it a subscription?", a: "No. $5 one-time, yours forever." },
              { q: "Can I get a refund?", a: "Contact us within 7 days for a full refund, no questions asked." },
            ].map((faq, i) => (
              <div key={i} className="border-b border-gray-200 pb-6">
                <h4 className="text-gray-900 font-semibold mb-2">{faq.q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Ready to show off your app?
        </h2>
        <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
          Search your app, pick a theme, and download a stunning image in under 30 seconds. No design skills needed.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 text-white font-semibold text-lg hover:bg-gray-800 transition-all cursor-pointer shadow-lg"
        >
          Get started — it&apos;s free
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-gray-200 bg-gray-50 py-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            <span>by <a href="https://simoneruggiero.com/?utm_source=appshot&utm_medium=footer" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700 transition-colors">Simone Ruggiero</a></span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()} AppFrame</span>
          </div>
        </div>
      </div>
    </div>
  );
}
