"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [session, setSession] = useState<{ user?: { name?: string; image?: string } } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Left: Logo + name */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <img src="/logo.svg" alt="AppFrame" className="w-7 h-7 rounded-lg" />
          <span className="text-gray-900 font-semibold text-sm">AppFrame</span>
        </Link>

        {/* Center: Nav links */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm transition-colors ${
              pathname === "/" ? "text-gray-900" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Home
          </Link>
          <Link
            href="/#examples"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Examples
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Pricing
          </Link>
        </div>

        {/* Right: Auth */}
        <div className="flex items-center">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-100" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="cursor-pointer"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full border border-gray-200 hover:border-gray-400 transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium transition-all">
                    {session.user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-12 z-50 w-48 rounded-xl bg-white border border-gray-200 shadow-lg overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-gray-900 text-sm font-medium truncate">{session.user.name}</p>
                    </div>
                    <button
                      onClick={async () => {
                        const csrfRes = await fetch("/api/auth/csrf");
                        const { csrfToken } = await csrfRes.json();
                        await fetch("/api/auth/signout", {
                          method: "POST",
                          headers: { "Content-Type": "application/x-www-form-urlencoded" },
                          body: `csrfToken=${csrfToken}`,
                        });
                        window.location.href = "/";
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-1.5 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
