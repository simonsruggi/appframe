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
    default:
      "AppFrame — iOS App Launch Image Generator | Celebrate Your App Approval",
    template: "%s | AppFrame",
  },
  description:
    "Create iOS app launch announcement images in seconds. Perfect for sharing your App Store approval on Twitter, LinkedIn, and Instagram. Free to use.",
  keywords: [
    "app launch image generator",
    "ios app approval image",
    "app store screenshot generator",
    "app launch announcement",
    "celebrate app approval",
    "ios app showcase",
    "indie dev tools",
    "app store marketing",
    "app promo image",
    "app got approved",
  ],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    siteName: "AppFrame",
    locale: "en_US",
    type: "website",
    title:
      "AppFrame — iOS App Launch Image Generator | Celebrate Your App Approval",
    description:
      "Create iOS app launch announcement images in seconds. Perfect for sharing your App Store approval on Twitter, LinkedIn, and Instagram. Free to use.",
    url: "https://appfra.me",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "AppFrame — iOS App Launch Image Generator | Celebrate Your App Approval",
    description:
      "Create iOS app launch announcement images in seconds. Perfect for sharing your App Store approval on Twitter, LinkedIn, and Instagram. Free to use.",
  },
};

const jsonLdWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "AppFrame",
  url: "https://appfra.me",
  applicationCategory: "DesignApplication",
  operatingSystem: "Web",
  description:
    "Create iOS app launch announcement images in seconds. Perfect for sharing your App Store approval on Twitter, LinkedIn, and Instagram.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
      description:
        "Unlimited showcase images, 5 themes, basic PNG export with watermark",
    },
    {
      "@type": "Offer",
      price: "5.00",
      priceCurrency: "USD",
      name: "Pro",
      description:
        "No watermark, 20+ premium themes, high-resolution 3x PNG export, lifetime access",
    },
  ],
  creator: {
    "@type": "Person",
    name: "Simone Ruggiero",
    url: "https://simoneruggiero.com",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I create an app launch image with AppFrame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Search for your app by name or paste an App Store URL, choose a theme, customize fonts and colors, then download a high-quality PNG ready for social media.",
      },
    },
    {
      "@type": "Question",
      name: "Is AppFrame free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, AppFrame is free. You can create unlimited showcase images with 5 themes. Free downloads include a small watermark. Pro ($5 one-time) removes the watermark and unlocks 20+ themes with high-resolution exports.",
      },
    },
    {
      "@type": "Question",
      name: "What formats does AppFrame export?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AppFrame exports high-quality PNG images. Pro users get 3x resolution exports perfect for social media, press kits, and App Store listings.",
      },
    },
    {
      "@type": "Question",
      name: "Is AppFrame a subscription?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Pro is a one-time $5 payment, yours forever. No recurring charges.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
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
