# Where to put your images and logos

Everything here is served from the site root, so `public/logos/foo.svg` is
`/logos/foo.svg` in code.

## `logos/` — the logo wall

21 client logos in a static grid under the hero — 7 columns on desktop, 4 on
tablet, 3 on mobile (`src/components/landing/logo-grid.tsx`).

**These are invented businesses, not real customers.** They were generated as
placeholders so the section renders — a live marketing page must not imply that
real brands are clients.

To swap: drop your logo in as `logos/<name>.svg` (or `.png`), then point at it in
`showcaseBrands` in `src/lib/landing-data.ts`. Keeping the existing filenames
means you don't touch any code.

- Best format: SVG with the artwork in **white** — the grid renders it muted and
  greyscaled, brightening on hover. An `<img>`-referenced SVG cannot inherit
  `currentColor` from the page, so the colour has to be baked into the file.
- **Use one shared aspect ratio for every logo.** These all use a `240x42`
  viewBox with the artwork centred inside, and the grid sizes them by width
  (`max-w-[150px]`). That is what keeps them at an identical scale — if one file
  has a tighter viewBox it will render visibly larger than its neighbours.
- 21 logos fills the 7-column grid exactly (3 full rows). A different count
  still works, the last row just won't be full.

## `images/` — photography

Stock placeholders from [Lorem Picsum](https://picsum.photos) (Unsplash-sourced).
Replace them with real photos of your customers and their businesses.

| File | Used in | Suggested subject |
| --- | --- | --- |
| `case-coaching.jpg` | Results cards | The coaching business |
| `case-salon.jpg` | Results cards | The salon |
| `case-restaurant.jpg` | Results cards | The restaurant |
| `feature-creatives.jpg` | What you get | Creative / content production |
| `feature-targeting.jpg` | What you get | Local customers, neighbourhood |
| `feature-whatsapp.jpg` | What you get | Someone on their phone |
| `feature-optimisation.jpg` | What you get | Analytics, dashboards |
| `feature-budget.jpg` | What you get | Planning, desk |
| `feature-reporting.jpg` | What you get | Reports, charts |

Case-study images render at 3:2, feature images at 16:9 — supply roughly
1200x800 and 800x600. Both sit under a dark gradient so text stays readable;
mid-tone photos work better than very bright ones.

Paths are set in `src/lib/landing-data.ts` (`caseStudies[].image`,
`features[].image`).

## Icons

`icon-256.png` is the PWA icon. The favicon, SVG icon and Apple touch icon live
in `src/app/` (`favicon.ico`, `icon.svg`, `apple-icon.png`) — Next.js picks those
up by filename.
