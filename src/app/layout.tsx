import type { Metadata } from "next";
import Script from "next/script";
import { Albert_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const albertSans = Albert_Sans({
  variable: "--font-albert",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://appfra.me"),
  title: {
    default: "AppFrame — Beautiful App Store Showcases",
    template: "%s | AppFrame",
  },
  description:
    "Generate stunning showcase images for your iOS apps. Share app launches on social media with beautiful, ready-to-post visuals.",
  keywords: [
    "app showcase",
    "app store screenshot",
    "ios app promotion",
    "app launch",
    "indie dev tools",
    "app store marketing",
    "app promo image",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    siteName: "AppFrame",
    locale: "en_US",
    type: "website",
    title: "AppFrame — Beautiful App Store Showcases",
    description:
      "Generate stunning showcase images for your iOS apps. Share app launches on social media with beautiful, ready-to-post visuals.",
    url: "https://appfra.me",
  },
  twitter: {
    card: "summary_large_image",
    title: "AppFrame — Beautiful App Store Showcases",
    description:
      "Generate stunning showcase images for your iOS apps. Share app launches on social media with beautiful, ready-to-post visuals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${albertSans.variable} antialiased bg-white`}
        style={{ fontFamily: "'Albert Sans', sans-serif" }}
      >
        <Navbar />
        {children}
        <Script
          defer
          data-ea-website-id="aew6kgwp03"
          data-ea-domain="appfra.me"
          data-ea-track-accuracy="most accurate"
          src="https://pure-analytics.com/tracking/utilities/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
