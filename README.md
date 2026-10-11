# Venugopal V — Portfolio

A clean, bright, professional portfolio for **Venugopal V**. No 3D, no WebGL:
big display type, generous spacing, rounded cards and soft gradients.

Built with **Vite + React 18 + TypeScript (strict) + Tailwind CSS**, with
Framer Motion (scroll reveals only) and `react-helmet-async` for SEO tags.
Static build, deploys to Vercel as `npm run build` → `dist`.

---

## Run it

```bash
npm install
npm run dev        # local dev server
npm run build      # type-check + production build (must pass with zero errors)
npm run preview    # serve the production build locally
npm run check:ssr  # renders the whole page in Node and asserts content/SEO/contrast (137 checks)
```

## Edit content

Every word on the site comes from **`src/data/profile.ts`** — a single source
of truth. Change a value there and the whole page follows. Do not hard-code
copy inside components.

## Change the accent colour

Open `src/styles/tokens.css` and edit the one variable:

```css
:root {
  --accent: #d9480f;
}
```

That single knob drives the logo tile, primary buttons, section labels,
stat 1 and the accent dots. Accent *text* and *button fills* use
`--accent-strong`, a dark derivative computed from `--accent` with
`color-mix(in srgb, var(--accent) 86%, #000000)` so text keeps WCAG AA
contrast (≥ 4.5:1) on white. Because it is derived, changing `--accent` still
recolors everything. The favicon and `og-image.png` use the literal `#D9480F`
and need a manual update if you change the accent.

## Add a photo

Drop a file named `photo.jpg` (or `photo.jpeg` / `photo.png` / `photo.webp`)
into `public/`. It is detected at **build time** (`import.meta.glob`), rendered
`object-fit: cover` in the hero arch frame, and requested only when it exists —
so there is never a broken image or a 404. Without a photo, the frame shows a
`[ YOUR PHOTO ]` label. Rebuild after adding the file.

## Swap the resume

`public/resume.pdf` is currently a small placeholder PDF so the "Download
resume" button works. Replace it with your real resume (keep the filename).
The button links to `/resume.pdf` with the `download` attribute.

## Deploy

Vercel defaults (also in `vercel.json`):

- Build command: `npm run build`
- Output directory: `dist`

After deploying, update the canonical host:

1. `SITE_URL` in `src/data/profile.ts`
2. `public/robots.txt` (Sitemap line)
3. `public/sitemap.xml`

## Placeholders (clearly marked, never fabricated)

| Placeholder | Where | Notes |
| --- | --- | --- |
| `[ YOUR PHOTO ]` | Hero arch frame | Shows until `public/photo.jpg` is added |
| `public/resume.pdf` | "Download resume" buttons | Ships a stub PDF; swap for the real file |
| `SITE_URL` | `src/data/profile.ts` | Fake canonical host until Vercel deploy; used for canonical, OG, robots, sitemap |
| `og-image.png` | `public/og-image.png` | 1200×630 PNG, generated from `design/og-image.svg`; re-render or replace as desired |
| Per-project repo/live links | Project cards | A button renders only when a `href` exists in `profile.projects[*]`; none do today (featured project links to the GitHub profile) |
| Phone number | — | Intentionally not shown |

Other spec decisions recorded in the pull request:

- **Accent contrast**: the spec's `#D9480F` gives 3.94:1 as text on the page
  and 4.30:1 behind white, both under the required 4.5:1. `--accent-strong`
  (a `color-mix` derivative of the same knob) is used for accent text and
  accent button fills. The raw accent stays for decorative dots and the
  large-type stat number (56px needs only 3:1).
- **Sticky nav**: kept translucent and sticky for usable long-page navigation
  (was unspecified).
- **Section labels** are written in sentence case in the markup and uppercased
  via CSS, so screen readers announce them naturally.
- **OG image / favicon** use font-system fallbacks and the literal accent hex.

## Structure

```
src/
  main.tsx, App.tsx
  data/profile.ts            # all content
  styles/tokens.css          # --accent and friends
  components/                # Nav, Hero, Stats, Projects, Experience,
                             # Skills, About, Contact, Footer, Reveal
  components/ui/             # Pill, Button, Card
scripts/
  ssr-check.tsx              # Node render + content/SEO/contrast assertions
  vite.ssr.config.ts         # one-off config for check:ssr
public/                      # favicon.svg, og-image.png, resume.pdf (stub),
                             # robots.txt, sitemap.xml, photo.jpg (optional)
design/og-image.svg          # source art for og-image.png
```