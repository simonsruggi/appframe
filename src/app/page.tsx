"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { AppData } from "./api/app/route";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // If it's a direct URL or ID, go straight to showcase
    const isDirectId = /^\d+$/.test(query.trim()) || query.includes("apps.apple.com");
    if (isDirectId) {
      const idMatch = query.match(/\/id(\d+)/) || [null, query.trim()];
      router.push(`/app/${idMatch[1]}`);
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/app?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      {/* Hero + Search */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-2xl text-center">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
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
                className="flex-1 px-5 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-lg focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg hover:from-purple-500 hover:to-blue-500 transition-all disabled:opacity-50 cursor-pointer"
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
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/30 transition-all text-left cursor-pointer"
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
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/10 flex items-center justify-center mx-auto mb-4 text-purple-300">
                {item.icon}
              </div>
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
                Step {item.step}
              </p>
              <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA / Pricing link */}
      <div className="relative z-10 text-center px-4 pb-20">
        <p className="text-zinc-500 text-sm mb-3">
          Free to use with a small watermark.
        </p>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
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
