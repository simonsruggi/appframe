"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SITE_FONTS = [
  { id: "geist", label: "Geist", css: "" },
  { id: "inter", label: "Inter", google: "Inter:wght@400;500;600;700", css: "'Inter', sans-serif" },
  { id: "dm-sans", label: "DM Sans", google: "DM+Sans:wght@400;500;600;700", css: "'DM Sans', sans-serif" },
  { id: "jakarta", label: "Jakarta", google: "Plus+Jakarta+Sans:wght@400;500;600;700", css: "'Plus Jakarta Sans', sans-serif" },
  { id: "space", label: "Space Grotesk", google: "Space+Grotesk:wght@400;500;600;700", css: "'Space Grotesk', sans-serif" },
  { id: "sora", label: "Sora", google: "Sora:wght@400;500;600;700", css: "'Sora', sans-serif" },
  { id: "poppins", label: "Poppins", google: "Poppins:wght@400;500;600;700", css: "'Poppins', sans-serif" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<{ user?: { name?: string; image?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        setSession(data?.user ? data : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Load and apply site font
  useEffect(() => {
    const font = SITE_FONTS[fontIndex];
    if (!font.css) {
      document.body.style.fontFamily = "";
      return;
    }
    // Load Google Font
    const id = `site-font-${font.id}`;
    if (!document.getElementById(id) && font.google) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;
      document.head.appendChild(link);
    }
    document.body.style.fontFamily = font.css;
  }, [fontIndex]);

  // Hide navbar on showcase pages (they have their own controls)
  if (pathname.startsWith("/app/")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo + name */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="AppFrame" className="w-7 h-7 rounded-lg" />
          <span className="text-white font-semibold text-sm">AppFrame</span>
        </Link>

        {/* Center: Nav links + font selector */}
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className={`text-sm transition-colors ${
              pathname === "/" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            Home
          </Link>
          <Link
            href="/pricing"
            className={`text-sm transition-colors ${
              pathname === "/pricing" ? "text-white" : "text-white/40 hover:text-white/70"
            }`}
          >
            Pricing
          </Link>
          <div className="w-px h-4 bg-white/10" />
          <select
            value={fontIndex}
            onChange={(e) => setFontIndex(Number(e.target.value))}
            className="px-2 py-1 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 text-xs focus:outline-none cursor-pointer appearance-none hover:bg-white/[0.1] transition-all"
            title="Change site font"
          >
            {SITE_FONTS.map((f, i) => (
              <option key={f.id} value={i} style={{ backgroundColor: "#111", color: "white" }}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
          ) : session?.user ? (
            <div className="flex items-center gap-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-8 h-8 rounded-full border border-white/10"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white text-xs font-medium">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
