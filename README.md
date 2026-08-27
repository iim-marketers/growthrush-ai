# growthrush.ai — Lead App

A mobile-first lead-generation app, built in Next.js. Frontend only — content comes
from static data in [`src/lib/data.ts`](src/lib/data.ts).

## Stack

- **Next.js 16** (App Router) + React 19
- **pnpm**
- **Tailwind CSS v4** (CSS-first config in `src/app/globals.css`)
- **shadcn/ui** (Radix base) + lucide-react icons
- **Inter** / **Outfit** via `next/font`

## Getting started

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # production build
```

## Screens

| Route | Screen |
| --- | --- |
| `/` | Marketing landing page — hero, logo wall, how it works, features, results, testimonials, scarcity, pricing, FAQ, CTA, footer |
| `/login` | Mobile-number sign in, Google / Apple options |

Every **Get Started** button on the landing page routes to `/login`. The login
"Continue" button is currently inert — there is no screen after it yet.

There is deliberately **no navbar**, matching the reference site: the logo sits at
the top of the hero and the page relies on repeated CTAs instead of nav links.

### Images and logos

See [`public/README.md`](public/README.md) for what lives where and how to swap
it. In short: client logos in `public/logos/`, photography in `public/images/`,
and the paths are wired up in `src/lib/landing-data.ts`.

The logo wall is a **static grid** (7 columns on desktop), matching the
reference. Every logo shares a `240x42` viewBox so they all render at the same
scale — keep that ratio when you swap them in.

> **Placeholder content:** the brand names, metrics and testimonials in
> `src/lib/landing-data.ts` are illustrative, not real customers or verified
> results. Replace them with substantiated figures before going live.

### Animation

`motion` (the Framer Motion successor) drives scroll reveals below the fold via
`src/components/landing/motion-primitives.tsx`. The hero deliberately uses **CSS**
keyframes instead — above-the-fold content should not depend on JS to become
visible, which also keeps LCP clean. Everything respects `prefers-reduced-motion`.

### Icons

`src/app/favicon.ico` is a 6-size ICO (16–256px) generated from the logo mark,
alongside `icon.svg` and `apple-icon.png`. Next.js picks these up by filename.

## Structure

```
src/
  app/
    page.tsx           splash
    login/page.tsx
    globals.css        design tokens + shared utilities
    layout.tsx         fonts, metadata, mobile shell
  components/
    cta-button.tsx     full-width brand CTA
    apk-popup.tsx      install prompt (disabled)
    logo.tsx
    ui/                shadcn primitives
  lib/data.ts          static content
```

Design tokens (brand palette, glass surfaces, animations) live in
`src/app/globals.css` and are exposed as Tailwind utilities — `bg-brand`,
`text-subtle`, `glass-panel`, `animate-slide-up`.

### Responsive behaviour

The layout has three tiers:

| Width | Layout |
| --- | --- |
| `< 640px` | Single centred column, tight padding, stacked social buttons |
| `640–1023px` | Single centred column, roomier padding, social buttons side by side |
| `>= 1024px` | Two columns — pitch panel on the left, login card on the right |

Spacing is driven by CSS variables in `globals.css` rather than fixed classes, so it
adapts on both axes:

- `@media (min-width: 400px)` — more horizontal panel padding once there is width for it
- `@media (min-width: 640px)` — more outer vertical padding
- `@media (max-height: 800px)` — compacts the vertical rhythm on laptop windows
- `@media (max-height: 640px)` — compacts it further on small phones
- `@media (max-height: 480px)` — landscape phones; also drops the in-card logo

Height rules are declared after width rules so they win where both apply (a
landscape phone is wide *and* short).

`.app-shell` uses `overflow-x: clip`, not `hidden` — `hidden` computes
`overflow-y: auto`, which turns the element into a scroll container and shows a
scrollbar for purely decorative overflow. Background glows are also wrapped in
their own clipped layer so they can never drive scroll.

Headings use `clamp()` so type scales continuously rather than jumping at breakpoints.
Verified from 320×568 up to 2560×1440, plus landscape phones and tablet portrait —
no page scroll and no scrollable inner element at any of those sizes.

## Notes

- Form state is local (`useState`); nothing is persisted or sent anywhere.
- `public/lead-app.apk` is not included, so the popup's download link 404s until you add one.
