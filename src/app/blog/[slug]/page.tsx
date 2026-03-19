import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { posts, getPostBySlug, getAllSlugs } from "../posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} | AppFrame`,
      description: post.description,
      url: `https://appfra.me/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

function markdownToHtml(content: string): string {
  return content
    .trim()
    .split("\n\n")
    .map((block) => {
      block = block.trim();
      if (!block) return "";

      // Headings
      if (block.startsWith("### ")) {
        return `<h3 class="text-lg font-semibold text-white mt-10 mb-4">${block.slice(4)}</h3>`;
      }
      if (block.startsWith("## ")) {
        return `<h2 class="text-2xl font-bold text-white mt-12 mb-4">${block.slice(3)}</h2>`;
      }

      // Unordered list
      if (block.startsWith("- ")) {
        const items = block.split("\n").map((line) => {
          const text = line.replace(/^- /, "");
          return `<li>${inlineMarkdown(text)}</li>`;
        });
        return `<ul class="list-disc list-inside space-y-2 text-white/60 leading-relaxed">${items.join("")}</ul>`;
      }

      // Ordered list
      if (/^\d+\.\s/.test(block)) {
        const items = block.split("\n").map((line) => {
          const text = line.replace(/^\d+\.\s/, "");
          return `<li>${inlineMarkdown(text)}</li>`;
        });
        return `<ol class="list-decimal list-inside space-y-2 text-white/60 leading-relaxed">${items.join("")}</ol>`;
      }

      // Paragraph
      return `<p class="text-white/60 leading-relaxed">${inlineMarkdown(block)}</p>`;
    })
    .join("\n");
}

function inlineMarkdown(text: string): string {
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/80 font-semibold">$1</strong>');
  // Links
  text = text.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" class="text-white/80 underline underline-offset-4 decoration-white/20 hover:decoration-white/40 transition-colors">$1</a>'
  );
  return text;
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const html = markdownToHtml(post.content);

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: "AppFrame",
      url: "https://appfra.me",
    },
    publisher: {
      "@type": "Organization",
      name: "AppFrame",
      url: "https://appfra.me",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://appfra.me/blog/${post.slug}`,
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://appfra.me",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://appfra.me/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://appfra.me/blog/${post.slug}`,
      },
    ],
  };

  // Find related posts (exclude current)
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="min-h-screen bg-[#080808]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-4">
        <nav className="flex items-center gap-2 text-sm text-white/30">
          <Link href="/" className="hover:text-white/50 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-white/50 transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-white/50 truncate">{post.title}</span>
        </nav>
      </div>

      {/* Article Header */}
      <header className="max-w-3xl mx-auto px-4 pt-8 pb-12">
        <div className="flex items-center gap-3 text-sm text-white/40 mb-6">
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
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-white/40 leading-relaxed">
          {post.description}
        </p>
        <div className="mt-8 h-px bg-white/[0.06]" />
      </header>

      {/* Article Body */}
      <article
        className="max-w-3xl mx-auto px-4 pb-16 space-y-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Related Posts */}
      {related.length > 0 && (
        <div className="max-w-3xl mx-auto px-4 pb-24">
          <div className="h-px bg-white/[0.06] mb-12" />
          <h2 className="text-xl font-bold text-white mb-8">
            Continue reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map((rp) => (
              <Link
                key={rp.slug}
                href={`/blog/${rp.slug}`}
                className="group rounded-3xl bg-white/[0.03] border border-white/[0.06] p-6 transition-all hover:bg-white/[0.05] hover:border-white/[0.1]"
              >
                <div className="flex items-center gap-3 text-xs text-white/30 mb-3">
                  <time dateTime={rp.date}>
                    {new Date(rp.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{rp.readingTime} min read</span>
                </div>
                <h3 className="text-base font-semibold text-white mb-2 group-hover:text-white/90 transition-colors">
                  {rp.title}
                </h3>
                <p className="text-white/40 text-sm line-clamp-2">
                  {rp.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-white/[0.06] py-10">
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center gap-4">
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
