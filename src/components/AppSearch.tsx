"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { AppData } from "@/app/api/app/route";

export default function AppSearch() {
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
    <>
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
    </>
  );
}
