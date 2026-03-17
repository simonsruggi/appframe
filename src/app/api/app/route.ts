import { NextRequest, NextResponse } from "next/server";

export interface AppData {
  trackId: number;
  trackName: string;
  artworkUrl512: string;
  screenshotUrls: string[];
  ipadScreenshotUrls: string[];
  description: string;
  developerName: string;
  price: number;
  formattedPrice: string;
  averageUserRating: number;
  userRatingCount: number;
  primaryGenreName: string;
  genres: string[];
  version: string;
  releaseNotes: string;
  contentAdvisoryRating: string;
  fileSizeBytes: string;
  trackViewUrl: string;
  sellerName: string;
  bundleId: string;
  minimumOsVersion: string;
  releaseDate: string;
  currentVersionReleaseDate: string;
}

/** Scrape App Store web page for screenshot URLs when iTunes API returns none */
async function scrapeScreenshots(trackId: number, country: string): Promise<string[]> {
  try {
    const res = await fetch(`https://apps.apple.com/${country}/app/id${trackId}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" },
    });
    if (!res.ok) return [];
    const html = await res.text();
    // Match unique screenshot base paths (highest resolution webp variant)
    const matches = html.matchAll(/https:\/\/is\d+-ssl\.mzstatic\.com\/image\/thumb\/[^\s"'>]+?screenshot[^\s"'>]*?\/(\d+x\d+)bb[^\s"'>]*/gi);
    const seen = new Set<string>();
    const urls: string[] = [];
    for (const m of matches) {
      // Extract base path (everything before the resolution suffix)
      const url = m[0].replace(/\);?$/, "");
      const base = url.replace(/\/\d+x\d+bb.*$/, "");
      if (!seen.has(base)) {
        seen.add(base);
        // Use a high-res version
        urls.push(`${base}/460x996bb.webp`);
      }
    }
    return urls;
  } catch {
    return [];
  }
}

function extractAppId(input: string): string | null {
  // Direct ID
  if (/^\d+$/.test(input.trim())) {
    return input.trim();
  }
  // App Store URL: apps.apple.com/.../id123456789
  const urlMatch = input.match(/\/id(\d+)/);
  if (urlMatch) return urlMatch[1];
  return null;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const country = searchParams.get("country") || "us";

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
  }

  try {
    const appId = extractAppId(query);

    function mapApp(app: Record<string, unknown>): AppData {
      return {
        trackId: app.trackId as number,
        trackName: app.trackName as string,
        artworkUrl512: (app.artworkUrl512 as string) || (app.artworkUrl100 as string)?.replace("100x100", "512x512"),
        screenshotUrls: (app.screenshotUrls as string[]) || [],
        ipadScreenshotUrls: (app.ipadScreenshotUrls as string[]) || [],
        description: app.description as string,
        developerName: app.artistName as string,
        price: app.price as number,
        formattedPrice: app.formattedPrice as string,
        averageUserRating: (app.averageUserRating as number) || 0,
        userRatingCount: (app.userRatingCount as number) || 0,
        primaryGenreName: app.primaryGenreName as string,
        genres: (app.genres as string[]) || [],
        version: app.version as string,
        releaseNotes: (app.releaseNotes as string) || "",
        contentAdvisoryRating: app.contentAdvisoryRating as string,
        fileSizeBytes: app.fileSizeBytes as string,
        trackViewUrl: app.trackViewUrl as string,
        sellerName: app.sellerName as string,
        bundleId: app.bundleId as string,
        minimumOsVersion: app.minimumOsVersion as string,
        releaseDate: app.releaseDate as string,
        currentVersionReleaseDate: app.currentVersionReleaseDate as string,
      };
    }

    if (appId) {
      const res = await fetch(`https://itunes.apple.com/lookup?id=${appId}&country=${country}`, { next: { revalidate: 3600 } });
      const data = await res.json();
      if (!data.results?.length) {
        return NextResponse.json({ error: "App not found" }, { status: 404 });
      }
      const app = mapApp(data.results[0]);
      if (app.screenshotUrls.length === 0) {
        app.screenshotUrls = await scrapeScreenshots(app.trackId, country);
      }
      return NextResponse.json({ app });
    }

    // Search across multiple stores in parallel for broader coverage
    const baseStores = ["us", "gb", "de", "fr", "it", "es", "br", "jp", "kr", "au", "ca", "in"];
    const stores = [country, ...baseStores];
    const uniqueStores = [...new Set(stores)];

    const allResults = await Promise.all(
      uniqueStores.map(async (c) => {
        try {
          const res = await fetch(
            `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=${c}&entity=software&limit=6`,
            { next: { revalidate: 3600 } }
          );
          const data = await res.json();
          return (data.results || []) as Record<string, unknown>[];
        } catch {
          return [];
        }
      })
    );

    // Merge and deduplicate by trackId
    const seen = new Set<number>();
    const apps: AppData[] = [];
    for (const results of allResults) {
      for (const app of results) {
        const id = app.trackId as number;
        if (!seen.has(id)) {
          seen.add(id);
          apps.push(mapApp(app));
        }
      }
    }

    if (apps.length === 0) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    return NextResponse.json({ results: apps.slice(0, 12) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch app data" }, { status: 500 });
  }
}
