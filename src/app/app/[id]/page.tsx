import { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppData } from "../../api/app/route";
import { scrapeScreenshots } from "../../api/app/route";
import AppShowcase from "./AppShowcase";

async function getAppData(id: string, country: string): Promise<AppData | null> {
  try {
    // Try primary country first, then fallback to others for screenshots
    const countries = [country, ...(country !== "us" ? ["us"] : []), "gb", "it", "de", "fr"];
    let bestApp = null;

    for (const c of countries) {
      const res = await fetch(
        `https://itunes.apple.com/lookup?id=${id}&country=${c}`,
        { next: { revalidate: 3600 } }
      );
      const data = await res.json();
      if (!data.results || data.results.length === 0) continue;

      const app = data.results[0];
      if (!bestApp) bestApp = app;

      // If this country has screenshots, use it
      if (app.screenshotUrls && app.screenshotUrls.length > 0) {
        bestApp = { ...bestApp, screenshotUrls: app.screenshotUrls, ipadScreenshotUrls: app.ipadScreenshotUrls || [] };
        break;
      }
    }

    if (!bestApp) return null;
    const app = bestApp;
    const screenshotUrls = app.screenshotUrls || [];

    // Fallback: scrape App Store page if iTunes API returns no screenshots
    const finalScreenshots = screenshotUrls.length > 0
      ? screenshotUrls
      : await scrapeScreenshots(app.trackId, country);

    console.log(`[AppFrame] ${app.trackName} (${app.trackId}): ${screenshotUrls.length} from API, ${finalScreenshots.length} final`);

    return {
      trackId: app.trackId,
      trackName: app.trackName,
      artworkUrl512: app.artworkUrl512 || app.artworkUrl100?.replace("100x100", "512x512"),
      screenshotUrls: finalScreenshots,
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
    };
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const app = await getAppData(id, "us");
  if (!app) return { title: "App Not Found — AppFrame" };

  const description = `${app.trackName} by ${app.developerName}. ${app.description?.slice(0, 120)}...`;

  return {
    title: `${app.trackName}`,
    description,
    openGraph: {
      title: `${app.trackName} — AppFrame`,
      description,
      images: [
        {
          url: app.artworkUrl512,
          width: 512,
          height: 512,
          alt: `${app.trackName} app icon`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.trackName} — AppFrame`,
      description,
      images: [app.artworkUrl512],
    },
  };
}

export default async function AppPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ theme?: string; color?: string; country?: string }>;
}) {
  const { id } = await params;
  const { theme, color, country } = await searchParams;
  const app = await getAppData(id, country || "us");

  if (!app) notFound();

  return <AppShowcase app={app} theme={theme || "ocean"} accentColor={color || "purple"} />;
}
