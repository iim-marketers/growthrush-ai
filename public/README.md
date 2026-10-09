# Where to put your images and logos

Everything here is served from the site root, so `public/logos/foo.svg` is
`/logos/foo.svg` in code.

## `logos/` — the logo wall

11 client logos in a static wall under the hero — 6 across on desktop, 4 on
tablet, 3 on mobile (`src/components/landing/logo-grid.tsx`).

**These are real brands.** Only list a company here that has actually agreed to
be named as a client — a logo on this page reads as an endorsement.

To swap: drop your logo in as `logos/<name>.webp`, then point at it in
`showcaseBrands` in `src/lib/landing-data.ts`. Convert PNGs with
`cwebp -lossless -z 9 in.png -o out.webp`.

- **Supply the artwork already re-inked to flat white on transparent.** The wall
  sits on the dark page background and the component applies no filter, because
  no filter can do this correctly: a mark like Haldiram's or Joy is white type
  knocked out of a coloured shape, and `invert` would fill the type back in. The
  rule to apply when converting: anything that is not near-neutral-white becomes
  opaque white, and anything that is becomes transparent — that keeps the
  knockout as a hole. Prepare it as a greyscale-plus-alpha PNG (`LA` mode), then
  convert to WebP.
- **Aspect ratio does not need to match.** Each logo is fitted into a
  fixed-height box with `object-contain`, so a square mark and a long wordmark
  land at the same optical weight. Just crop the file tight to the artwork —
  built-in whitespace is what makes one logo look smaller than its neighbours.
- Roughly 640x256 is plenty of resolution; the largest on-screen box is about
  150x64 CSS px.
- Any count works. The final row centres itself, so there is no need to pad the
  list out to a multiple of six.

## `images/` — photography

Stock placeholders from [Lorem Picsum](https://picsum.photos) (Unsplash-sourced).
Replace them with real photos of your customers and their businesses.

| File | Used in | Suggested subject |
| --- | --- | --- |
| `case-coaching.webp` | Results cards | The coaching business |
| `case-salon.webp` | Results cards | The salon |
| `case-restaurant.webp` | Results cards | The restaurant |
| `feature-creatives.webp` | What you get | Creative / content production |
| `feature-targeting.webp` | What you get | Local customers, neighbourhood |
| `feature-whatsapp.webp` | What you get | Someone on their phone |
| `feature-optimisation.webp` | What you get | Analytics, dashboards |
| `feature-budget.webp` | What you get | Planning, desk |
| `feature-reporting.webp` | What you get | Reports, charts |

Case-study images render at 3:2, feature images at 16:9 — supply roughly
1200x800 and 800x600. Both sit under a dark gradient so text stays readable;
mid-tone photos work better than very bright ones. Convert to WebP with
`cwebp -q 82 in.jpg -o out.webp`.

Paths are set in `src/lib/landing-data.ts` (`caseStudies[].image`,
`features[].image`).

## `brand/`

The site uses the `.webp` wordmarks and mark. `wordmark.png` and
`wordmark-light.png` stay as PNG for the invoice email and the share-image
generator, neither of which can use WebP.

## Icons

`icon-256.png` is the PWA icon. The favicon, SVG icon and Apple touch icon live
in `src/app/` (`favicon.ico`, `icon.svg`, `apple-icon.png`) — Next.js picks those
up by filename.
