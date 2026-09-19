# The Neural Corridor — Venugopal V's 3D Portfolio

A production-ready, static-export 3D portfolio. The visitor flies a camera along a glowing rail
through nine stations — each one a career milestone rendered in procedural Three.js geometry.
All resume content lives in semantic, server-rendered HTML; the 3D world is progressive
enhancement that fades in after first paint, and falls back to a polished 2D "simple view"
whenever WebGL is missing, broken, or declined.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Static export to `out/` (also type-checks) |
| `npm run start` | Serves `out/` statically (production preview) |
| `npm run lint` | ESLint (Next core-web-vitals + TS) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run analyze` | Bundle analysis (`ANALYZE=true next build`) |

Everything ships: `npm run lint`, `npm run typecheck`, and `npm run build` all pass with zero
errors. Deployment output is a plain `out/` folder — no server required.

## Editing your content

**One file: `src/content/data.ts`.** The DOM, the JSON-LD, the metadata — everything reads from
it. There are no invented facts; if a field is `null`, nothing renders.

- **Add a project:** append to `projects` with a unique `id`, `name`, `subtitle`, `stack`,
  `bullets`, and `repoUrl` (leave `null` to hide the repo link — all three are `null` now).
- **Add skills:** append to the right `skills` category; the 3D constellation adds a node.
- **Show your phone:** set `showPhone: true`. The built site contains **no phone number** while
  it is `false` (verified in CI-style checks below).
- **Replace the resume PDF:** `public/Venugopal_V_Resume.pdf` is currently a generated
  placeholder (from `scripts/make-resume.mjs`). Drop in your real PDF with the same filename.
- **Dates for QuadEdutor / Nitroware:** add a `period` string when you have them; sections
  render no date until then. There is deliberately **no Achievements section**.

Regenerate the OG image any time with `node scripts/make-og.mjs` (edit the script to restyle it).

## Architecture

```
Layer 0  <Canvas>            fixed, z-0 — the 3D world (lazy, fades in after idle)
Layer 1  <main> sections     9 semantic sections (100svh each), the scroll driver
Layer 2  Nav / Drawer /      fixed UI: dot-rail, mobile top bar, DetailDrawer,
         toggles             simple-view + quality-tier toggles
```

- **Scroll → camera:** native scroll position feeds a damped progress value (maath `damp3`)
  along two Catmull-Rom curves (position + look-at). Waypoint *index* parametrization means
  each 100svh section maps 1:1 to a station. Scroll-snap is `proximity`, never mandatory.
- **Tiers:** one-time hardware probe (`src/lib/quality.ts`) → high/medium/low → dpr, particle
  count, antialias, Bloom. drei `<PerformanceMonitor>` steps the tier down/up at runtime
  (never above detected). Manual override in the nav persists to `localStorage`.
- **Fallbacks:** no WebGL / context lost / scene error / Save-Data + reduced-motion → simple
  view (CSS constellation background, always-visible cards, zero 3D code loaded). Toggle lives
  in the nav and persists.
- **Accessibility:** skip link, one `<h1>`, landmark nav, focus-trapped drawer
  (`aria-modal`), keyboard section nav (`↑/↓/PageUp/PageDown/Home/End`), 2px cyan focus rings,
  reduced-motion honored everywhere, canvas `aria-hidden`, all content reachable without JS.
- **SEO:** every word is in the static HTML (verified), Person JSON-LD, OG/Twitter cards with
  a real 1200×630 `og.png`, `sitemap.xml`, `robots.txt`, canonical via `NEXT_PUBLIC_SITE_URL`.

## Deployment

Set `NEXT_PUBLIC_SITE_URL=https://<final-domain>` in your host's environment (or `.env.local`
for local builds — canonical/sitemap/OG URLs derive from it).

### Vercel (primary)

```bash
npm i -g vercel && vercel        # or: push the repo and import it in the dashboard
```

`vercel.json` already sets security headers and immutable caching for `/_next/static/*`.

### Netlify / Cloudflare Pages

Build command `npm run build`, publish directory `out`. `public/_headers` (copied into `out/`)
carries the same headers.

### GitHub Pages

```bash
GH_PAGES=true GH_PAGES_REPO=<repo-name> NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo-name> npm run build
# publish the out/ folder (e.g. via gh-pages branch or Actions)
```

`next.config.mjs` applies `basePath`/`assetPrefix` automatically when `GH_PAGES=true`.

## Deployment checklist

Run after every change; the first items are automated:

- [x] `npm run lint && npm run typecheck && npm run build` pass; `out/` generated
- [x] Built HTML contains all resume text (verified: name, 3 employers, 3 projects,
      all 7 skill categories, both schools, languages)
- [x] `Venugopal_V_Resume.pdf` present in `/public` and linked *(placeholder — replace it!)*
- [x] Phone number absent from built output while `showPhone: false`
- [x] Repo links render only for non-null `repoUrl` (currently none)
- [x] sitemap.xml and robots.txt generated
- [ ] No console errors in Chrome/Safari/Firefox desktop, Chrome Android, Safari iOS *(manual)*
- [ ] `--disable-webgl` shows the full simple view *(manual)*
- [ ] JS disabled: content fully readable *(manual — the export works; verify your build)*
- [ ] Lighthouse mobile: Perf ≥ 85, A11y ≥ 95, SEO 100, Best Practices ≥ 95 *(run against the
      deployed URL or `npm run start`)*
- [ ] OG/Twitter preview validated (LinkedIn Post Inspector, opengraph.xyz)
- [ ] JSON-LD validated (Rich Results Test / validator.schema.org)
- [ ] Custom domain + HTTPS, `NEXT_PUBLIC_SITE_URL` set, canonical correct
- [ ] Submit to Google Search Console (Bing Webmaster Tools too); link from GitHub/LinkedIn

## Items that need your input

1. **`repoUrl` for the three projects** in `src/content/data.ts` (GitHub links) — links appear
   in the DetailDrawer the moment you fill them in.
2. **Final domain** → set `NEXT_PUBLIC_SITE_URL` and update `metadataBase` fallback.
3. **`showPhone`** — currently `false`; flip in `data.ts` to expose your number.
4. **Real resume PDF** → replace `public/Venugopal_V_Resume.pdf`.
5. **Search Console** → verify ownership after deploy (a `<meta name="google-site-verification">`
   can be added to `src/app/layout.tsx` metadata once you have the token).
