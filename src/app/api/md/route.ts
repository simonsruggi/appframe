import { NextRequest, NextResponse } from "next/server";

function htmlToMarkdown(html: string): string {
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n");
  text = text.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n");
  text = text.replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n");
  text = text.replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n");
  text = text.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)");
  text = text.replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
  text = text.replace(/\n{3,}/g, "\n\n").trim();
  return text;
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url") || "/";
  const baseUrl = new URL(request.url).origin;
  const pageUrl = `${baseUrl}${url}`;

  try {
    const res = await fetch(pageUrl, { headers: { Accept: "text/html" } });
    const html = await res.text();
    const markdown = htmlToMarkdown(html);
    return new NextResponse(markdown, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch {
    return new NextResponse("Error fetching page", { status: 500 });
  }
}
