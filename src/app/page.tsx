"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-2xl text-center">
        <div className="animate-fade-in">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            AppFrame
          </h1>
          <p className="text-zinc-400 text-lg mb-10">
            Generate stunning showcase images for your iOS apps
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

        <p className="mt-12 text-zinc-600 text-sm animate-fade-in-delay-2">
          Tip: You can also go directly to <code className="text-zinc-500">appfra.me/app/APP_ID</code>
        </p>
      </div>
    </div>
  );
}
