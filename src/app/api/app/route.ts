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
    let url: string;

    if (appId) {
      url = `https://itunes.apple.com/lookup?id=${appId}&country=${country}`;
    } else {
      url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&country=${country}&entity=software&limit=6`;
    }

    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: "App not found" }, { status: 404 });
    }

    const apps: AppData[] = data.results.map((app: Record<string, unknown>) => ({
      trackId: app.trackId,
      trackName: app.trackName,
      artworkUrl512: (app.artworkUrl512 as string) || (app.artworkUrl100 as string)?.replace("100x100", "512x512"),
      screenshotUrls: app.screenshotUrls || [],
      ipadScreenshotUrls: app.ipadScreenshotUrls || [],
      description: app.description,
      developerName: app.artistName,
      price: app.price,
      formattedPrice: app.formattedPrice,
      averageUserRating: app.averageUserRating || 0,
      userRatingCount: app.userRatingCount || 0,
      primaryGenreName: app.primaryGenreName,
      genres: app.genres || [],
      version: app.version,
      releaseNotes: app.releaseNotes || "",
      contentAdvisoryRating: app.contentAdvisoryRating,
      fileSizeBytes: app.fileSizeBytes,
      trackViewUrl: app.trackViewUrl,
      sellerName: app.sellerName,
      bundleId: app.bundleId,
      minimumOsVersion: app.minimumOsVersion,
      releaseDate: app.releaseDate,
      currentVersionReleaseDate: app.currentVersionReleaseDate,
    }));

    return NextResponse.json(appId ? { app: apps[0] } : { results: apps });
  } catch {
    return NextResponse.json({ error: "Failed to fetch app data" }, { status: 500 });
  }
}
