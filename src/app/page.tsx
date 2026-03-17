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
      {/* Background with floating app icons */}
      <div className="absolute inset-0 bg-[#080808]" />
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-500/[0.04] rounded-full blur-[120px]" />
      <div className="absolute top-1/4 left-1/5 w-80 h-80 bg-blue-500/[0.03] rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/5 w-80 h-80 bg-purple-500/[0.03] rounded-full blur-[100px]" />

      {/* Floating app icons background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { icon: "/examples/whatsapp-icon.jpg", top: "8%", left: "5%", size: 56, blur: 2, opacity: 0.15, delay: "0s" },
          { icon: "/examples/spotify-icon.jpg", top: "15%", right: "8%", size: 48, blur: 3, opacity: 0.12, delay: "0.5s" },
          { icon: "/examples/telegram-icon.jpg", top: "60%", left: "8%", size: 44, blur: 2, opacity: 0.1, delay: "1s" },
          { icon: "/examples/notion-icon.jpg", top: "70%", right: "12%", size: 52, blur: 3, opacity: 0.12, delay: "1.5s" },
          { icon: "/examples/duolingo-icon.jpg", top: "35%", left: "2%", size: 40, blur: 4, opacity: 0.08, delay: "2s" },
          { icon: "/examples/whatsapp-icon.jpg", top: "25%", right: "3%", size: 36, blur: 4, opacity: 0.08, delay: "0.8s" },
          { icon: "/examples/spotify-icon.jpg", top: "80%", left: "15%", size: 42, blur: 3, opacity: 0.1, delay: "1.2s" },
          { icon: "/examples/telegram-icon.jpg", top: "5%", right: "20%", size: 38, blur: 3, opacity: 0.08, delay: "0.3s" },
          { icon: "/examples/notion-icon.jpg", top: "45%", right: "2%", size: 50, blur: 2, opacity: 0.1, delay: "1.8s" },
          { icon: "/examples/duolingo-icon.jpg", top: "85%", right: "25%", size: 34, blur: 4, opacity: 0.07, delay: "0.6s" },
        ].map((item, i) => (
          <img
            key={i}
            src={item.icon}
            alt=""
            className="absolute rounded-2xl animate-float"
            style={{
              top: item.top,
              left: item.left,
              right: item.right,
              width: item.size,
              height: item.size,
              filter: `blur(${item.blur}px)`,
              opacity: item.opacity,
              animationDelay: item.delay,
              animationDuration: `${4 + i * 0.3}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Sparkle particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-300/40 rounded-full animate-float"
            style={{
              top: `${10 + Math.random() * 80}%`,
              left: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Hero + Search */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 min-h-screen">
        <div className="w-full max-w-3xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 text-white leading-[1.1] tracking-tight whitespace-nowrap">
              Your app got approved.<br />Time to <span className="relative inline-block"><span className="relative z-10 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 bg-clip-text text-transparent">celebrate</span><span className="absolute -inset-3 bg-amber-400/20 rounded-2xl blur-lg" /></span>.
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-xl mx-auto">
              Generate a stunning showcase image in seconds. Pick a theme, customize it, and share your launch on social media.
            </p>
          </div>

          <div className="animate-fade-in-delay">
            <div className="search-wrapper">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Paste App Store URL or search by name..."
                className="w-full px-6 py-4 rounded-[18px] bg-[#0d0d0d] text-white placeholder-zinc-500 text-lg focus:outline-none transition-all relative z-10"
              />
            </div>
          </div>

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
      <div id="examples" className="relative z-10 py-20 overflow-hidden scroll-mt-20">
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
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "/examples/whatsapp-icon.jpg", screenshot: "/examples/whatsapp-ss.jpg", bg: "#0a0015", genre: "Social", tagline: "Approved! ✅" },
              { name: "Spotify", developer: "Spotify AB", icon: "/examples/spotify-icon.jpg", screenshot: "/examples/spotify-ss.jpg", bg: "#001020", genre: "Music", tagline: "Just launched! 🚀" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "/examples/telegram-icon.jpg", screenshot: "/examples/telegram-ss.jpg", bg: "#080808", genre: "Messaging", tagline: "Now available" },
              { name: "Notion", developer: "Notion Labs", icon: "/examples/notion-icon.jpg", screenshot: "", bg: "#120800", genre: "Productivity", tagline: "10K downloads 🎉" },
              { name: "Duolingo", developer: "Duolingo", icon: "/examples/duolingo-icon.jpg", screenshot: "", bg: "#0a0015", genre: "Education", tagline: "v2.0 is here!" },
              { name: "WhatsApp", developer: "WhatsApp Inc.", icon: "/examples/whatsapp-icon.jpg", screenshot: "/examples/whatsapp-ss.jpg", bg: "#0a0015", genre: "Social", tagline: "Approved! ✅" },
              { name: "Spotify", developer: "Spotify AB", icon: "/examples/spotify-icon.jpg", screenshot: "/examples/spotify-ss.jpg", bg: "#001020", genre: "Music", tagline: "Just launched! 🚀" },
              { name: "Telegram", developer: "Telegram FZ-LLC", icon: "/examples/telegram-icon.jpg", screenshot: "/examples/telegram-ss.jpg", bg: "#080808", genre: "Messaging", tagline: "Now available" },
              { name: "Notion", developer: "Notion Labs", icon: "/examples/notion-icon.jpg", screenshot: "", bg: "#120800", genre: "Productivity", tagline: "10K downloads 🎉" },
              { name: "Duolingo", developer: "Duolingo", icon: "/examples/duolingo-icon.jpg", screenshot: "", bg: "#0a0015", genre: "Education", tagline: "v2.0 is here!" },
            ].map((ex, i) => (
              <div key={i} className={`shrink-0 ${ex.screenshot ? "w-[480px]" : "w-[300px]"} rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl`} style={{ backgroundColor: ex.bg }}>
                <div className={`flex items-center gap-6 p-8 ${!ex.screenshot ? "justify-center" : ""}`}>
                  <div className={`${ex.screenshot ? "flex-1" : ""} min-w-0 ${!ex.screenshot ? "text-center" : ""}`}>
                    <div className={`${!ex.screenshot ? "flex justify-center" : ""}`}>
                      <img src={ex.icon} alt={ex.name} className="w-14 h-14 rounded-[12px] shadow-lg mb-3" />
                    </div>
                    {ex.tagline && <p className="text-white/70 text-sm font-medium mb-1">{ex.tagline}</p>}
                    <h3 className="text-white font-bold text-xl leading-tight">{ex.name}</h3>
                    <p className="text-white/40 text-xs mt-1">{ex.developer}</p>
                    <div className={`flex items-center gap-1 mt-2 ${!ex.screenshot ? "justify-center" : ""}`}>
                      {[1,2,3,4,5].map(s => (
                        <svg key={s} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className={`inline-block mt-3 px-2.5 py-1 rounded-full text-[10px] font-medium bg-white/[0.06] text-white/50`}>{ex.genre}</span>
                  </div>
                  {ex.screenshot && (
                    <div className="shrink-0 w-[120px] h-[245px] rounded-[24px] bg-[#1a1a1a] p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_15px_40px_-8px_rgba(0,0,0,0.8)]">
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
      </div>

      {/* Pricing */}
      <div id="pricing" className="relative z-10 max-w-4xl mx-auto px-4 py-20 scroll-mt-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple pricing</h2>
        <p className="text-white/40 text-center mb-12 text-sm">
          Create beautiful app showcases for free. Go Pro when you need clean exports.
        </p>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-16">
          {/* Free */}
          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8">
            <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-4">Free</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$0</span>
            </div>
            <p className="text-white/30 text-sm mb-8">Free forever</p>
            <ul className="space-y-3">
              {["Unlimited showcase images", "All themes included", "5 beautiful themes", "Small watermark on downloads"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <svg className="w-4 h-4 text-white/30 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-3xl bg-white/[0.05] border border-white/[0.12] p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-black text-xs font-semibold">
              Recommended
            </div>
            <p className="text-white/70 text-sm font-medium uppercase tracking-wider mb-4">Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">$5</span>
            </div>
            <p className="text-white/30 text-sm mb-8">One-time payment</p>
            <ul className="space-y-3">
              {["Everything in Free", "No watermark on downloads", "High-resolution PNG export", "Lifetime access"].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/80">
                  <svg className="w-4 h-4 text-white mt-0.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
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
                <p className="text-white/40 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-white/[0.06] py-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/20 text-sm">
            <span>Made with</span>
            <svg className="w-4 h-4 text-red-400/60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            <span>by <a href="https://x.com/simonsruggi" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white/60 transition-colors">Simone Ruggiero</a></span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-white/20">
            <Link href="/privacy" className="hover:text-white/40 transition-colors">Privacy</Link>
            <span>&middot;</span>
            <Link href="/terms" className="hover:text-white/40 transition-colors">Terms</Link>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()} AppFrame</span>
          </div>
        </div>
      </div>
    </div>
  );
}
