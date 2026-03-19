import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "./posts";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and insights for iOS developers on App Store optimization, screenshot design, and app marketing.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog | AppFrame",
    description:
      "Tips, guides, and insights for iOS developers on App Store optimization, screenshot design, and app marketing.",
    url: "https://appfra.me/blog",
  },
};

export default function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Hero */}
      <div className="max-w-5xl mx-auto px-4 pt-32 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
          Blog
        </h1>
        <p className="text-white/40 text-lg max-w-xl mx-auto">
          Tips, guides, and insights to help you launch your app with
          confidence.
        </p>
      </div>

      {/* Posts Grid */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-3xl bg-white/[0.03] border border-white/[0.06] p-8 transition-all hover:bg-white/[0.05] hover:border-white/[0.1]"
            >
              <div className="flex items-center gap-3 text-sm text-white/40 mb-4">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>&middot;</span>
                <span>{post.readingTime} min read</span>
              </div>
              <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-white/90 transition-colors">
                {post.title}
              </h2>
              <p className="text-white/40 text-sm leading-relaxed">
                {post.description}
              </p>
              <div className="mt-6 flex items-center gap-2 text-sm font-medium text-white/60 group-hover:text-white/80 transition-colors">
                Read article
                <svg
                  className="w-4 h-4 transition-transform group-hover:translate-x-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/[0.06] py-10">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>Made with</span>
            <svg
              className="w-4 h-4 text-red-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>
              by{" "}
              <a
                href="https://simoneruggiero.com?utm_source=appframe&utm_medium=footer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-white/70 transition-colors"
              >
                Simone Ruggiero
              </a>
            </span>
          </div>
          <div className="flex items-center justify-center gap-4 text-xs text-white/30">
            <Link
              href="/privacy"
              className="hover:text-white/50 transition-colors"
            >
              Privacy
            </Link>
            <span>&middot;</span>
            <Link
              href="/terms"
              className="hover:text-white/50 transition-colors"
            >
              Terms
            </Link>
            <span>&middot;</span>
            <span>&copy; {new Date().getFullYear()} AppFrame</span>
          </div>
        </div>
      </div>
    </div>
  );
}
