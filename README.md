# Venugopal V — 3D Portfolio

A clean, light, product-style portfolio inspired by the clarity of metamask.io (none of its
assets): oversized typography, pill buttons, pastel bento cards, one bold orange accent — with
elegant procedural 3D moments (a cursor-following profile medallion, an experience stage, a
draggable keycap cloud) rendered through drei `<View>`s into DOM placeholders.

All resume content lives in semantic, server-rendered HTML; the 3D layer is progressive
enhancement that loads after first paint and falls back to a polished 2D "simple view"
whenever WebGL is missing, broken, declined, or capped by the performance tier.

## Quickstart

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (also regenerates photo variants + OG via `predev`) |
| `npm run build` | Static export to `out/` (photo pipeline + resume gate run first) |
| `npm run start` | Serves `out/` statically (`npx serve out`) |
| `npm run lint` | ESLint (Next core-web-vitals + TS, flat config) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run photo` | Regenerate profile image variants + `og.png` |
| `npm run check-resume` | Verify the resume PDF gate (runs inside `prebuild`) |
| `npm run analyze` | Bundle analysis (`ANALYZE=true next build`) |

Everything ships: `npm run lint`, `npm run typecheck`, and `npm run build` pass with zero
errors. Deployment output is a plain `out/` folder — no server required.

## Editing your content

**One file: `src/content/data.ts`.** The DOM, the JSON-LD, the metadata — everything reads from
it. There are no invented facts; if a field is `null`, nothing renders.

- **Add a project:** append to `projects` with a unique `id`, `name`, `subtitle`, `stack`,
  `bullets`, and `repoUrl` (leave `null` to hide the repo link — all three are `null` now).
- **Add skills:** append to the right `skills` category; the keycap cloud adds a key.
- **Show your phone:** set `showPhone: true`. The built site contains **no phone number** while
  it is `false` (the contact section has no phone JSX at all).
- **Replace the resume PDF:** `public/Venugopal_V_Resume.pdf` is currently a placeholder.
  **Production builds fail until you drop in the real PDF** (same filename) — the gate is
  `scripts/check-resume.mjs` (fails on missing / < 20 KB / placeholder-marker files; warns in dev).
- **Profile photo:** drop `public/profile/profile.jpg` (min 1200px short side, face in the
  upper half, plain background) and optionally `public/profile/profile-cutout.png`
  (transparent). `scripts/optimize-photo.mjs` emits AVIF/WebP/JPG at 480/960/1440 (each
  ≤ 200 KB, EXIF stripped), a blur placeholder, and the 1200×630 `og.png` (photo + name +
  role on orange; monogram variant when no photo). Without a photo the site uses the "VV"
  monogram badge everywhere.
- **KreupAI end date:** set `endDate` on the KreupAI entry; until then the UI renders
  "May 2026 – Completed" (never "Present").
- There is deliberately **no Achievements section** and no fabricated metrics.

## Architecture

```
Layer 0  <Canvas>            fixed overlay (z 30, pointer-events none) rendering drei <View>s
Layer 1  DOM page            semantic sections; normal scrolling; 3D slots are aspect-ratio
                             placeholders with always-rendered fallbacks
Layer 2  Nav / dialog /      sticky pill navbar, announcement bar, toast, cursor,
         toggles             theme + 3D toggles (z ≥ 45, above the canvas)
```

- **Shared canvas, many views:** one lazy-loaded `<Canvas>` (`ssr:false`, mounted after
  idle) renders `<View.Port />`; each `<View track={placeholder}>` brings its own camera and
  the `<Studio/>` light rig. Slots register stable ids + visibility (200px IO margin) in a
  zustand store; only visible views mount, capped by tier (`low` = hero only, `medium` = 2).
- **Pointer events** reach the 3D objects through `eventSource=#app-root` (the page wrapper),
  so scrolling and text selection keep working; placeholders use `touch-action: pan-y`.
- **Tiers:** one-time hardware probe (`src/lib/quality.ts`) → high/medium/low → dpr, shadows
  (ContactShadows vs BlobShadow), materials (Physical vs Standard), max active views. drei
  `<PerformanceMonitor>` steps down on decline; after 3 flip-flops the session locks to the
  lower tier (adaptation pauses rather than disabling).
- **Fallbacks:** no WebGL / context lost (2 s restore grace) / scene error / Save-Data →
  simple view (`data-mode="simple"`): placeholders show their DOM fallbacks (framed photo with
  floating chips, SVG illustrations per role, chip grid with the same filters, CSS shapes).
  The toggle lives in the footer and persists.
- **Motion:** Lenis (fine pointer only, reduced-motion safe) with `scrollTo(el, offset:-80)`;
  reveal-on-scroll gated behind `html.enhanced` (no-JS shows everything); magnetic buttons,
  card tilt, cursor dot, count-ups — all disabled under reduced motion or coarse pointers.
- **Accessibility:** skip link, single `<h1>`, landmark nav, focus-trapped mobile sheet,
  native `<dialog>` with focus return, native `<details>` FAQ, canvas `aria-hidden`, 2px
  orange focus rings, all content reachable without JS.
- **SEO:** every word is in the static HTML (verified), Person JSON-LD (no phone), OG/Twitter
  cards with the generated `og.png`, `sitemap.xml`, `robots.txt`, canonical via
  `NEXT_PUBLIC_SITE_URL`.

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

## Repo settings (set in the GitHub UI)

- **Description:** "Portfolio of Venugopal V — AI/ML engineer. Next.js + Three.js, light bento
  design, cursor-following 3D medallion."
- **Suggested topics:** `nextjs`, `threejs`, `react-three-fiber`, `portfolio`, `typescript`

## Deployment checklist

Run after every change; the first items are automated:

- [x] `npm run lint && npm run typecheck && npm run build` pass; `out/` generated
- [x] Built HTML contains all resume text (name, 3 employers, 3 projects, all 7 skill
      categories, both schools, full FAQ text)
- [x] No "Present"/"Currently"/live-beacon wording for KreupAI anywhere
- [ ] `Venugopal_V_Resume.pdf` real PDF committed *(build fails until then — placeholder present)*
- [ ] `public/profile/profile.jpg` (+ optional cutout) added; photo pipeline verified in all
      three modes *(currently monogram mode)*
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

1. **Real resume PDF** → replace `public/Venugopal_V_Resume.pdf` (production builds fail
   until you do). Update it for the completed KreupAI internship.
2. **Profile photo** → `public/profile/profile.jpg` + optional `profile-cutout.png`.
3. **`repoUrl` for the three projects** in `src/content/data.ts` (each has a
   `// OWNER: add GitHub URL` marker) — Legal AI Chatbot, Cloud Nova, CertChain.
4. **KreupAI `endDate`** → set it in `data.ts`; renders "May 2026 – Completed" until then.
5. **Final domain** → set `NEXT_PUBLIC_SITE_URL` and update `metadataBase` fallback.
6. **`showPhone`** — currently `false`; flip in `data.ts` to expose your number.
7. **Location** — `data.ts` says "Madurai, Tamil Nadu, India" (`// OWNER: confirm`).
8. **Search Console** → verify ownership after deploy (a `<meta name="google-site-verification">`
   can be added to `src/app/layout.tsx` metadata once you have the token).
