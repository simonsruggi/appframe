import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <p className="text-7xl font-bold text-white mb-4">
          404
        </p>
        <h1 className="text-xl font-semibold text-white mb-2">Page not found</h1>
        <p className="text-white/40 text-sm mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/[0.06] border border-white/[0.08] text-white font-medium text-sm hover:bg-white/[0.1] transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
      </div>
    </div>
  );
}
