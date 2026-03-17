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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#080808]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/[0.015] rounded-full blur-3xl" />

      {/* Hero + Search */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-2xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 text-white">
              AppFrame
            </h1>
            <p className="text-zinc-300 text-xl mb-2">
              Beautiful showcase images for your iOS apps
            </p>
            <p className="text-zinc-500 text-base mb-10 max-w-lg mx-auto">
              Search any app on the App Store, pick a theme, and download a stunning promo image ready for social media, press kits, or your portfolio.
            </p>
          </div>

          <form onSubmit={handleSearch} className="animate-fade-in-delay">
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Paste App Store URL or search by name..."
                className="flex-1 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-lg focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-2xl bg-white text-black font-semibold text-lg hover:bg-white/90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? "..." : "Go"}
              </button>
            </div>
          </form>

          {/* Search results */}
          {searched && results.length > 0 && (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
              {results.map((app) => (
                <button
                  key={app.trackId}
                  onClick={() => router.push(`/app/${app.trackId}`)}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-left cursor-pointer"
                >
                  <img
                    src={app.artworkUrl512}
                    alt={app.trackName}
                    className="w-16 h-16 rounded-2xl"
                  />
                  <div className="min-w-0">
                    <p className="text-white font-semibold truncate">{app.trackName}</p>
                    <p className="text-zinc-400 text-sm truncate">{app.developerName}</p>
                    <p className="text-zinc-500 text-xs">{app.primaryGenreName}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {searched && !loading && results.length === 0 && (
            <p className="mt-8 text-zinc-500 animate-fade-in">No apps found. Try a different search.</p>
          )}

          <p className="mt-10 text-zinc-600 text-sm animate-fade-in-delay-2">
            Tip: You can also go directly to <code className="text-zinc-500">appfra.me/app/APP_ID</code>
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-14 animate-fade-in">
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
          ].map((item) => (
            <div
              key={item.step}
              className="text-center p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-zinc-300">
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Step {item.step}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Examples carousel */}
      <div className="relative z-10 py-20 overflow-hidden">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          See what you can create
        </h2>
        <p className="text-zinc-500 text-center mb-12 text-sm">
          Beautiful showcase images generated in seconds
        </p>
        {/* Auto-scrolling infinite marquee */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#080808] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#080808] to-transparent z-10" />
          <div className="flex gap-6 animate-marquee">
            {[
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e3/b2/8a/e3b28a99-2fc5-641f-7b35-0a8094337b1a/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/46/b3/59/46b3593b-3e88-3b48-2c82-6df72e23a492/0a0fb59e-e3e0-40e3-8cb1-df6d4bb1ebba_EN_01.jpg/392x696bb.jpg", bg: "#0a0015", genre: "Social" },
              { name: "Spotify", developer: "Spotify AB", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ba/1e/e8/ba1ee81c-0053-a1ab-07c3-60db23cff573/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/d2/5c/6c/d25c6c33-5e55-d80d-9b88-84f868ef0312/ba0ca975-3f10-4424-b744-600487e14e72_2_en.jpg/392x696bb.jpg", bg: "#001020", genre: "Music" },
              { name: "Notion", developer: "Notion Labs", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/fe/40/77/fe407752-14ab-5958-5e48-e0a087ca6a2b/AppIcon-0-0-1x_U007epad-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/86/c0/a7/86c0a72c-d040-d87a-7f69-7eee8a02daa9/9d5c4c11-e591-4b24-aebe-e14c43575ea6_1290_2796_Productivity_01.jpg/392x696bb.jpg", bg: "#080808", genre: "Productivity" },
              { name: "Duolingo", developer: "Duolingo", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/96/17/10/96171033-83a0-f498-8fa3-5c73f38a0a2e/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/5c/a0/1a/5ca01aab-8b83-fe5e-c689-72fb29e15ef7/a42f6ab7-84a0-4daa-b498-7b229a0e8d35_iOS_1_6.7.jpg/392x696bb.jpg", bg: "#120800", genre: "Education" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/10/2d/b1/102db1da-e532-1597-67cb-1e9a2adfa45a/AppIconLLC-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/0a/3d/3e/0a3d3e04-ced3-7e9a-a5ce-5940f7599b5b/0c5e5752-b07f-4bb2-b7f5-be7e12cd52be_Apple_iPhone_15_Pro_Max_1.jpg/392x696bb.jpg", bg: "#0a0015", genre: "Messaging" },
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/e3/b2/8a/e3b28a99-2fc5-641f-7b35-0a8094337b1a/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/46/b3/59/46b3593b-3e88-3b48-2c82-6df72e23a492/0a0fb59e-e3e0-40e3-8cb1-df6d4bb1ebba_EN_01.jpg/392x696bb.jpg", bg: "#0a0015", genre: "Social" },
              { name: "Spotify", developer: "Spotify AB", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/ba/1e/e8/ba1ee81c-0053-a1ab-07c3-60db23cff573/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/d2/5c/6c/d25c6c33-5e55-d80d-9b88-84f868ef0312/ba0ca975-3f10-4424-b744-600487e14e72_2_en.jpg/392x696bb.jpg", bg: "#001020", genre: "Music" },
              { name: "Notion", developer: "Notion Labs", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/fe/40/77/fe407752-14ab-5958-5e48-e0a087ca6a2b/AppIcon-0-0-1x_U007epad-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/86/c0/a7/86c0a72c-d040-d87a-7f69-7eee8a02daa9/9d5c4c11-e591-4b24-aebe-e14c43575ea6_1290_2796_Productivity_01.jpg/392x696bb.jpg", bg: "#080808", genre: "Productivity" },
              { name: "Duolingo", developer: "Duolingo", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/96/17/10/96171033-83a0-f498-8fa3-5c73f38a0a2e/AppIcon-0-0-1x_U007emarketing-0-7-0-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource211/v4/5c/a0/1a/5ca01aab-8b83-fe5e-c689-72fb29e15ef7/a42f6ab7-84a0-4daa-b498-7b229a0e8d35_iOS_1_6.7.jpg/392x696bb.jpg", bg: "#120800", genre: "Education" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/10/2d/b1/102db1da-e532-1597-67cb-1e9a2adfa45a/AppIconLLC-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-85-220.png/512x512bb.jpg", screenshot: "https://is1-ssl.mzstatic.com/image/thumb/PurpleSource221/v4/0a/3d/3e/0a3d3e04-ced3-7e9a-a5ce-5940f7599b5b/0c5e5752-b07f-4bb2-b7f5-be7e12cd52be_Apple_iPhone_15_Pro_Max_1.jpg/392x696bb.jpg", bg: "#0a0015", genre: "Messaging" },
            ].map((ex, i) => (
              <div key={i} className="shrink-0 w-[480px] rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl" style={{ backgroundColor: ex.bg }}>
                <div className="flex items-center gap-6 p-8">
                  {/* Left info */}
                  <div className="flex-1 min-w-0">
                    <img src={ex.icon} alt={ex.name} className="w-14 h-14 rounded-[12px] shadow-lg mb-3" />
                    <h3 className="text-white font-bold text-xl leading-tight">{ex.name}</h3>
                    <p className="text-white/40 text-xs mt-1">{ex.developer}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/50">{ex.genre}</span>
                  </div>
                  {/* Phone mockup */}
                  <div className="shrink-0 w-[120px] h-[245px] rounded-[24px] bg-[#1a1a1a] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_15px_40px_-8px_rgba(0,0,0,0.8)]">
                    <div className="w-full h-full rounded-[21px] overflow-hidden bg-black relative">
                      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[48px] h-[14px] bg-black rounded-full z-10" />
                      <img src={ex.screenshot} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA / Pricing link */}
      <div className="relative z-10 text-center px-4 pb-20">
        <p className="text-zinc-500 text-sm mb-3">
          Free to use with a small watermark.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium transition-colors"
        >
          See pricing for Pro
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
