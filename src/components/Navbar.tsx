"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<{ user?: { name?: string; image?: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        setSession(data?.user ? data : null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

        {/* Center: Nav links */}
        <div className="flex items-center gap-6">
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
        </div>

        {/* Right: Auth */}
        <div className="flex items-center">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
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
              <button
                onClick={() => {
                  fetch("/api/auth/signout", { method: "POST" }).then(() => window.location.href = "/");
                }}
                className="text-white/30 hover:text-white/60 text-xs transition-colors cursor-pointer"
              >
                Logout
              </button>
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
