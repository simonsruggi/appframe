# AppFrame

**Domain:** appfra.me
**Owner:** Simone Ruggiero (simone.ruggiero97@gmail.com)
**Stack:** Next.js 16.1.6, React 19.2.3, Tailwind CSS 4, TypeScript
**Auth:** NextAuth v5 beta (Google OAuth provider)
**Payments:** Stripe (one-time $5 USD for Pro)
**Screenshot rendering:** html2canvas-pro
**QR codes:** qrcode library
**Analytics:** PureAnalytics (anonymous, cookie-free)
**Deployment:** Vercel (inferred from Next.js setup)

## Architecture

Server-side Next.js App Router app. The homepage is a client component with live search (debounced). App showcase pages (`/app/[id]`) are server-rendered (fetch app data directly from iTunes API at build/request time) with a client-side interactive showcase component (`AppShowcase.tsx`). Auth is handled by NextAuth v5 with Google as the sole provider. Payments go through Stripe checkout sessions. Images from Apple CDN are proxied through `/api/image` to avoid CORS issues during html2canvas rendering.

## Folder Structure

```
src/
  app/
    page.tsx              # Homepage — hero, search bar, how-it-works, examples marquee, pricing CTA, footer with legal links
    layout.tsx            # Root layout — Albert Sans font, Navbar, SEO metadata (OG/Twitter), PureAnalytics script
    globals.css           # Tailwind 4 + custom animations (fade-in, marquee)
    sitemap.ts            # Dynamic sitemap (/, /login, /pricing)
    not-found.tsx         # Custom 404 page
    login/page.tsx        # Google sign-in page (server action) with terms/privacy links
    pricing/page.tsx      # Free vs Pro pricing cards + FAQ section
    privacy/page.tsx      # Privacy policy page
    terms/page.tsx        # Terms of service page
    pro/success/page.tsx  # Post-purchase success page — verifies Stripe session, stores Pro in localStorage
    app/[id]/
      page.tsx            # Server component — fetches app data from iTunes API, generates OG metadata per-app
      AppShowcase.tsx     # Client component — theme switcher, phone mockups, font picker, aspect ratio, toggles, download, Pro modal
    api/
      app/route.ts        # iTunes Search/Lookup proxy — searches across 12 country stores, deduplicates by trackId. Exports AppData type.
      auth/[...nextauth]/ # NextAuth route handler
      checkout/route.ts   # Stripe checkout session creation ($5 USD, one-time). Checks if already paid before creating session.
      verify/route.ts     # GET: checks Pro status by email via Stripe sessions. POST: verifies specific session_id.
      image/route.ts      # Image proxy for mzstatic.com (Apple CDN) — returns image with CORS headers and 24h cache
  auth.ts                 # NextAuth config (Google provider, custom sign-in page)
  middleware.ts           # Route protection: /app/* requires auth, /login redirects if logged in, ?format=md rewrites to /api/md
  components/
    Navbar.tsx            # Shared navbar (client component) — session-aware via fetch to /api/auth/session, hidden on /app/* pages, has logout via CSRF token
public/
  logo.svg               # Monochrome logo (white bg, dark frame)
  favicon.svg            # Monochrome favicon
  robots.txt             # Allows all crawlers, sitemap link
  examples/              # Example app icons and screenshots for the homepage marquee
```

## Design

- **Color scheme:** Monochrome — black (#080808) backgrounds, white text, grey (zinc) accents. No colored gradients on marketing pages.
- **Font:** Albert Sans (loaded via next/font/google, variable: --font-albert)
- **Navbar:** Fixed top, dark translucent bg with backdrop blur, border-b. Shows on all pages EXCEPT /app/[id] showcase pages. Contains logo + "AppFrame", nav links (Home, Pricing), and login/user avatar button with dropdown menu.
- **Buttons:** White on black (primary) or ghost style (bg-white/[0.04] border).
- **Cards:** rounded-3xl with subtle bg-white/[0.03] and border-white/[0.06]
- **Legal pages:** Same dark theme, max-w-3xl centered, sectioned layout with white headings

## Key Features

- **App search:** Debounced live search (350ms) across 12 iTunes country stores. Also accepts direct App Store URLs or numeric IDs (redirects straight to /app/[id]).
- **Showcase generation:** 5 themes (noir, cosmic, ocean, ember, arctic) with phone mockups, customizable content
- **Customization options:**
  - Theme selection (5 themes)
  - Aspect ratio (16:9, 4:3, 1:1, Auto)
  - Font selection (10 fonts: Geist, Inter, DM Sans, Jakarta, Satoshi/Outfit, Space Grotesk, Sora, Poppins, Playfair Display, JetBrains Mono)
  - Phone count (1, 2, or 3 mockups)
  - Screenshot selector (choose starting screenshot)
  - Custom headline, app name, developer name, tagline
  - Toggle elements: screenshots, description, rating, meta info, QR code
- **Download:** html2canvas-pro renders the showcase to PNG at 2x scale
- **Watermark:** Free users get a small "@AppFrame" text centered on the card (low opacity). Pro removes it.
- **Phone mockup component:** Realistic notch, rounded corners, inner shadow, two sizes (sm/md)
- **Card effects:** CSS noise/grain texture overlay, subtle gradient overlay, inner shadow for depth
- **Examples marquee:** Homepage infinite scroll marquee with 5 popular apps (WhatsApp, Spotify, Telegram, Notion, Duolingo) — some with screenshots, some without
- **QR code generation:** Dynamic QR code linking to the app's App Store page, themed to match card colors
- **Pro:** $5 one-time via Stripe, stored as localStorage flag (`appframe_pro`, `appframe_email`) + server verification on page load
- **SEO:** Full OpenGraph/Twitter cards, dynamic sitemap, per-app OG images (app icon), metadata templates
- **Legal:** Privacy policy and Terms of Service pages linked from homepage footer and login page

## Themes (AppShowcase only)

| Theme   | Background | Text    | Style                    |
|---------|-----------|---------|--------------------------|
| noir    | #080808   | white   | Dark monochrome          |
| cosmic  | #0a0015   | white   | Dark purple accents      |
| ocean   | #001020   | white   | Dark cyan/blue accents   |
| ember   | #120800   | white   | Dark orange/warm accents |
| arctic  | #f8fafb   | dark    | Light theme              |

These are user-selectable in the showcase component and NOT used on marketing pages.

## Auth Flow

1. Middleware (`src/middleware.ts`) checks auth on `/app/*` and `/login` routes
2. Unauthenticated users on `/app/*` → redirect to `/login`
3. Authenticated users on `/login` → redirect to `/`
4. `/login` uses a server action to call `signIn("google", { redirectTo: "/" })`
5. Navbar fetches session via `/api/auth/session` (client-side)
6. Logout: fetches CSRF token from `/api/auth/csrf`, POSTs to `/api/auth/signout`

## Pro Flow

1. User clicks "Remove watermark — $5" in AppShowcase sidebar → opens Pro modal
2. Click "Unlock Pro — $5" → POST `/api/checkout` → checks if already paid → creates Stripe checkout session
3. Stripe redirects to `/pro/success?session_id=...`
4. `/pro/success` calls POST `/api/verify` with session_id to confirm payment
5. On success: stores `appframe_pro=true` and `appframe_email` in localStorage
6. On every showcase page load: GET `/api/verify` checks Pro status by email from auth session
7. If already Pro from Stripe, auto-sets localStorage flag

## API Routes

| Route               | Method | Description                                                  |
|---------------------|--------|--------------------------------------------------------------|
| `/api/app`          | GET    | Search or lookup apps. `?q=` accepts name, URL, or numeric ID. `?country=` optional. |
| `/api/auth/[...]`   | *      | NextAuth handlers (session, signin, signout, csrf, etc.)     |
| `/api/checkout`     | POST   | Creates Stripe checkout session. Returns `{ url }` or `{ alreadyPro: true }`. |
| `/api/verify`       | GET    | Checks if current user's email has a paid Stripe session.    |
| `/api/verify`       | POST   | Verifies a specific Stripe session_id. Returns `{ pro, email }`. |
| `/api/image`        | GET    | Proxies images from mzstatic.com with CORS headers. `?url=` required. |
| `/api/md`           | GET    | Converts any page to Markdown (for AI agents). `?url=` path required. Triggered via `?format=md` on any page. |

## Environment Variables

- `STRIPE_SECRET_KEY` — Stripe secret key for checkout and verification
- `NEXTAUTH_URL` — Base URL for NextAuth (e.g., https://appfra.me)
- `NEXTAUTH_SECRET` — Secret for NextAuth session encryption
- `GOOGLE_CLIENT_ID` — Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` — Google OAuth client secret

## Dependencies

### Production
- `next` 16.1.6 — Framework
- `react` / `react-dom` 19.2.3 — UI
- `next-auth` 5.0.0-beta.30 — Authentication
- `stripe` 20.4.1 — Payments
- `html2canvas-pro` 2.0.2 — Client-side screenshot rendering
- `qrcode` 1.5.4 — QR code generation

### Dev
- `tailwindcss` 4 — Styling (via @tailwindcss/postcss)
- `typescript` 5 — Type checking
- `eslint` 9 + `eslint-config-next` — Linting
- `@types/qrcode` — Type definitions
