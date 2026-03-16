# AppFrame

**Domain:** appfra.me
**Stack:** Next.js 16, React 19, Tailwind CSS 4, TypeScript
**Auth:** NextAuth v5 (Google provider)
**Payments:** Stripe (one-time $5 USD for Pro)
**Screenshot rendering:** html2canvas-pro

## Architecture

Server-side Next.js App Router app. The homepage is a client component with search. App showcase pages are server-rendered (fetch app data from iTunes API) with a client-side interactive showcase component.

## Folder Structure

```
src/
  app/
    page.tsx              # Homepage — hero, search, how-it-works, pricing link
    layout.tsx            # Root layout with Navbar, SEO metadata, analytics
    globals.css           # Tailwind + custom animations
    sitemap.ts            # Dynamic sitemap (/, /login, /pricing)
    not-found.tsx         # Custom 404 page
    login/page.tsx        # Google sign-in page
    pricing/page.tsx      # Free vs Pro pricing + FAQ
    pro/success/page.tsx  # Post-purchase success page
    app/[id]/
      page.tsx            # Server component — fetches app data, generates OG metadata
      AppShowcase.tsx     # Client component — theme switcher, phone mockups, download, pro modal
    api/
      app/route.ts        # iTunes Search/Lookup proxy, exports AppData type
      auth/[...nextauth]/ # NextAuth route handler
      checkout/route.ts   # Stripe checkout session creation ($5 USD)
      verify/route.ts     # Verify Stripe payment status
  auth.ts                 # NextAuth config
  middleware.ts           # Route protection middleware
  components/
    Navbar.tsx            # Shared navbar (client component, session-aware, hidden on /app/*)
public/
  logo.svg               # Monochrome logo (white bg, dark frame)
  favicon.svg            # Monochrome favicon
  robots.txt              # Allows all, sitemap link
```

## Design

- **Color scheme:** Monochrome — black (#080808) backgrounds, white text, grey (zinc) accents. No purple/blue gradients on marketing pages.
- **Navbar:** Fixed top, dark translucent bg with backdrop blur, border-b. Shows on all pages EXCEPT /app/[id] showcase pages (they have their own controls bar). Contains logo + "AppFrame", nav links (Home, Pricing), and login/user avatar button.
- **Buttons:** White on black (primary) or ghost style (bg-white/[0.04] border).

## Key Features

- **App search:** Search iTunes API by name or paste App Store URL/ID
- **Showcase generation:** 5 themes (noir, cosmic, ocean, ember, arctic) with phone mockups
- **Download:** html2canvas-pro renders the showcase to PNG at 2x scale
- **Watermark:** Free users get a large "@AppFrame" watermark centered on the card (low opacity, -15deg rotation), rendered inside the DOM so it appears in both preview and download. Pro removes it.
- **Editable fields:** App name and Developer name are customizable via text inputs in the right sidebar "Content" section
- **Examples carousel:** Homepage shows a horizontal scroll-snap carousel of 5 popular app mini-previews (WhatsApp, Instagram, Spotify, Notion, Duolingo) between "How it works" and pricing CTA
- **Card styling:** Showcase card uses rounded-3xl, CSS noise/grain texture overlay, subtle gradient overlay and inner shadow for depth
- **Pro:** $5 one-time via Stripe, stored as localStorage flag + server verification
- **SEO:** Full OpenGraph/Twitter cards, dynamic sitemap, per-app OG images (app icon)
- **Navbar:** Shared across all pages except showcase, with auth state awareness

## Themes (AppShowcase only)

noir, cosmic, ocean, ember (dark), arctic (light) — these are user-selectable in the showcase component and are NOT affected by the monochrome marketing design.

## Auth Flow

1. Middleware redirects unauthenticated users from /app/* to /login
2. /login uses server action to call signIn("google")
3. Logged-in users redirected away from /login to /

## Pro Flow

1. User clicks "Buy Pro" in AppShowcase -> POST /api/checkout -> Stripe checkout
2. Success redirect to /pro/success?session_id=...
3. /pro/success calls POST /api/verify to confirm payment
4. Pro status stored in localStorage (appframe_pro, appframe_email)

## Environment Variables

- `STRIPE_SECRET_KEY`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
