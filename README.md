# AppFrame (appfra.me)

App Store screenshot showcase generator. Users search for an iOS app, then customize and download a styled promotional image.

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Styling**: Tailwind CSS 4
- **Auth**: NextAuth.js (via `/api/auth/[...nextauth]`)
- **Payments**: Stripe (one-time Pro purchase, $5)
- **Screenshot capture**: html2canvas-pro
- **QR codes**: qrcode library
- **Deployment**: Vercel

## Project Structure

```
src/app/
  page.tsx              - Homepage with app search
  layout.tsx            - Root layout (Geist font)
  globals.css           - Global styles
  not-found.tsx         - 404 page
  sitemap.ts            - Dynamic sitemap
  login/                - Login page
  pricing/              - Pricing page
  privacy/              - Privacy policy
  terms/                - Terms of service
  pro/success/          - Post-purchase success page
  app/[id]/             - Main showcase editor page
    AppShowcase.tsx      - Core component: preview + sidebar controls
  api/
    app/                - iTunes Search API proxy (fetches app data)
    auth/[...nextauth]/ - NextAuth endpoints
    checkout/           - Stripe checkout session creation
    image/              - Image proxy for mzstatic.com URLs (CORS)
    md/                 - Markdown endpoint
    verify/             - Pro status verification
```

## Key Component: AppShowcase.tsx

The main editor component at `src/app/app/[id]/AppShowcase.tsx`:

- **THEMES**: 20 theme presets (ThemePreset interface), each controlling:
  - Visual: bg, gradient, thumb, text, sub, pill, wm, qrFg, qrBg
  - Defaults: font (index into FONTS), phones (1-3), aspect ratio, showDesc, showRating, showMeta
  - Categories: Dark (noir, midnight, cosmic, ocean, forest, ember, rose, sunset, neon, galaxy), Light (arctic, snow, cream, mint, lavender), Bold (aurora, fire, electric, velvet, carbon)
- **FONTS**: 10 fonts (Geist, Inter, DM Sans, Jakarta, Outfit, Space Grotesk, Sora, Poppins, Playfair, JetBrains Mono)
- **ASPECTS**: 6 ratios (16:9, 1:1, 9:16, 1.91:1, 3:2, Auto)
- **Theme selector**: Circle-based UI with first 8 visible + expand button for full grid
- **Preset + override**: Selecting a theme applies all preset values; individual controls override after

## Features

- Search any iOS app via iTunes API
- 20+ theme presets (dark, light, bold/gradient)
- Customizable: font, phone count (1-3), aspect ratio, headline, tagline, app name, developer name
- Toggle: screenshots, description, rating, meta info, QR code
- Phone mockup display with dynamic island
- HD PNG download (3x scale)
- Watermark for free users, removed with Pro ($5 one-time via Stripe)
- Share link / native share
- Google Fonts loaded dynamically

## Light Theme Detection

Uses `LIGHT_THEMES` Set containing: arctic, snow, cream, mint, lavender. Affects text colors, star colors, watermark opacity.
