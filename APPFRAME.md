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
    layout.tsx            # Root layout with comprehensive SEO metadata
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
public/
  robots.txt              # Allows all, sitemap link
```

## Key Features

- **App search:** Search iTunes API by name or paste App Store URL/ID
- **Showcase generation:** 5 themes (noir, cosmic, ocean, ember, arctic) with phone mockups
- **Download:** html2canvas-pro renders the showcase to PNG at 2x scale
- **Watermark:** Free users get a small "appfra.me" watermark; Pro removes it
- **Pro:** $5 one-time via Stripe, stored as localStorage flag + server verification
- **SEO:** Full OpenGraph/Twitter cards, dynamic sitemap, per-app OG images (app icon)

## Themes

noir, cosmic, ocean, ember (dark), arctic (light)

## Environment Variables

- `STRIPE_SECRET_KEY`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
