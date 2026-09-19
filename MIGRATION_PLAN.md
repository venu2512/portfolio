# MIGRATION_PLAN.md

Audit date: 2026-09-19. State at audit: the repo already contains a partially completed
migration (new 2D components + `src/three/` View architecture exist uncommitted; old
`src/scene/` camera-rail world deleted). `npm run lint`, `npm run typecheck` pass clean.
Verdicts below are measured against the spec (Sections 2–12), not just against the old
"Neural Corridor" build.

**Key findings from audit (driving the phases):**

1. **`<View.Port />` is never rendered** — `src/three/CanvasRoot.tsx` mounts `<View track={...}>`
   wrappers but no `<View.Port />`, so nothing would ever draw. Must be fixed (phase 6).
2. **View registry ids don't match the selectors** — slots register with React `useId()` values
   (e.g. `«r0»`) while `CanvasRoot` matches with `id.endsWith("hero")` etc. Must register with
   stable ids (`hero`, `experience`, `skills`, `cta`, `project-<pid>`) (phase 6).
3. **`#app-root` is a zero-size wrapper div** (`Boot.tsx`), so `eventSource` pointer mapping has
   no geometry and R3F pointer events can never reach the scenes. App root must wrap the page
   content (phase 6).
4. **Content violates §3.1/3.2** — `data.ts` still says "May 2026 – Present", `current: true`,
   "Currently" card in About, old FAQ wording, heroChips contain "Ethereum", projects/skills
   not in target-role order (phase 2).
5. `package.json` already has the §2 dependency set (lenis, sharp, plus-jakarta-sans present;
   postprocessing already removed). No `motion` import anywhere — nothing to swap. One stale
   `@fontsource/plus-jakarta-sans/600.css` import violates the pinned 400/500/700/800 set (phase 3).
6. `scripts/optimize-photo.mjs` works but: OG `makeOg` has a dead composite branch, the script
   scans `.next/` and `out/` (2k+ files, and a stray index.jpeg in `.next/` crashed `emitSizes`
   during audit — sharp's auto-orientation probe chokes on that file), and `--gitignore` should
   be replaced with an explicit exclude list (phase 5).
7. `flipflops={3}` currently disables adaptation permanently after 3 declines; §10 requires
   locking to the lower tier for the session instead (phase 6).
8. `serverExternalPackages` lists removed `@react-three/postprocessing`/`postprocessing` (phase 3 cleanup).

## Verdicts

### KEPT (as-is or near-as-is)

| File | Reason |
|---|---|
| `package.json` | Already carries the §2 dependency set; lint/typecheck scripts, static export config all correct. Only stale entries removed in phase 3. |
| `next.config.mjs` | Static export + turbopack root + GH_PAGES support correct; `serverExternalPackages` list trimmed in phase 3. |
| `tsconfig.json` | strict + noUncheckedIndexedAccess as required; no changes. |
| `vercel.json` | Security headers + immutable static caching, unchanged. |
| `public/_headers` | Same headers for Netlify/CF Pages; unchanged. |
| `eslint.config.mjs` | Flat config with next/core-web-vitals + typescript; unchanged. |
| `postcss.config.mjs` | `@tailwindcss/postcss` for Tailwind v4; unchanged. |
| `src/lib/quality.ts` | Tier detection + `tierTables` match §5/§10 (blob/contact shadows, physical/standard, maxActiveViews). |
| `src/lib/webgl.ts` | WebGL support probe for simple-mode gating. |
| `src/lib/store.ts` | Zustand store carries theme/tier/webgl/simple-view/flash state used across DOM and canvas. |
| `src/lib/hooks.ts` | useReveal/useInViewMargin/useCountUp/onIdle match §5 visibility gating and §9 count-up. |
| `src/lib/scroll.ts` | Lenis, fine-pointer-only, `scrollTo(el, {offset:-80})` matches §9. |
| `src/lib/activeExp.ts` | DOM→canvas active-experience bridge (no three imports) matches the §8.2 IO pattern. |
| `src/lib/useViewRegistration.ts` | Visible-set registry concept matches §5; id scheme fixed in phase 6. |
| `src/content/photo-meta.json` | Generated artifact of the photo pipeline (hasPhoto:false currently). |
| `src/app/robots.ts`, `src/app/sitemap.ts` | §10 SEO infra, unchanged. |
| `src/types/three-jsx.d.ts` | Types drei's `roundedBoxGeometry` for the JSX namespace. |
| `src/components/Toast.tsx`, `Reveal.tsx`, `Magnetic.tsx`, `Cursor.tsx`, `ScrollProgress.tsx`, `Photo.tsx`, `JsonLd.tsx` | Match §6/§9 behavior (aria-live toast, reveal gating under html.enhanced, ≤6px magnetic, pointer:fine cursor, 3px progress + back-to-top, picture/AVIF/WebP, Person JSON-LD without phone). |
| `src/components/Navbar.tsx`, `ThemeToggle.tsx`, `ThreeDToggle.tsx`, `AnnouncementBar.tsx`, `Boot.tsx` | Sticky pill navbar w/ IO active link + focus-trapped mobile sheet, View-Transition theme toggle, 3D toggle, dismissible bar, client bootstrap w/ save-data heuristic — all match §6/§9/§10. |
| `src/components/StatsStrip.tsx` | Derived stats only (`deriveStats()`), count-up on visible. |
| `src/components/Faq.tsx` | Native details/summary accordion, one-open-at-a-time. |
| `src/components/Education.tsx` | Two-card timeline from data. |
| `src/components/Footer.tsx` | Monogram, links, socials, location, back-to-top, 3D toggle. |
| `src/components/TechMarquee.tsx` | Two opposite rows, pause on hover, reduced-motion static via CSS. |
| `src/three/Studio.tsx`, `src/three/BlobShadow.tsx`, `src/three/filterMirror.ts`, `src/three/labels.ts` | Procedural studio lighting (Lightformers only), radial-gradient blob shadow, filter mirror, cached canvas-label helper with coverFit — match §5/§7/§8. |

### REWRITTEN (already started before audit; finished in phases)

| File | Reason |
|---|---|
| `src/content/data.ts` | §3.1/3.2 content: internship completed (no "Present"/"Currently"), openTo wording, summary, ordering, heroChips, photo block, new FAQ, location comment. |
| `src/app/globals.css` | Light-first tokens match §4 palette; add `@theme inline` mapping + missing utilities (`.chip-ink`, mono-label mapping) so Tailwind classes like `chip-sky` compile. |
| `src/app/layout.tsx` | Inline theme script (light default, pre-paint), font set 400/500/700/800, title/description per §10. |
| `src/app/page.tsx` | §6 composition order (already correct); `#app-root` moves here in phase 6 to wrap page content for `eventSource`. |
| `src/components/Hero.tsx` | Eyebrow pill uses `openToShort`, CTAs per §6 (View my work / Download resume + social buttons). |
| `src/components/About.tsx` | Remove "Currently" card → §6 "Status" card (open to work + completed internship, no live dot). |
| `src/components/Experience.tsx` | Period rendering honors new `startDate`/`endDate` data; keep flash-bullet plumbing. |
| `src/components/Projects.tsx` | Add `// OWNER: add GitHub URL` comments, keep repoUrl-null gating, dialog focus handling. |
| `src/components/CtaBanner.tsx` | §6 buttons: Copy email / LinkedIn / GitHub / Download resume (drop "Email me" duplicate). |
| `src/components/three/*Slot.tsx` (5 files) | Slots get stable registry ids; otherwise keep fallbacks + visibility gating. |
| `src/three/CanvasRoot.tsx` | Render `<View.Port />`, stable-id registry, `#app-root` = page wrapper for eventSource, flipflop lock-to-lower-tier, doc header. |
| `src/three/views/HeroMedallion.tsx` | Chips from `heroChips` × skill colors (drop hardcoded list), mode B cutout plane, anisotropy cap, reduced-motion static pose. |
| `src/three/views/ExperienceStage.tsx` | Remove pulsing emissive beacon (calm static badge), QuadScene bars keep fixed artistic heights (no fake numbers), cloud tooltip/desat polish in KeycapCloud. |
| `src/three/views/KeycapCloud.tsx` | Replace filter polling with subscription, full-name tooltip, proper desaturation. |
| `scripts/optimize-photo.mjs` | Dedupe OG composite branch, restrict scan to `public/` only (skip `.next`/`out`), explicit excludes. |
| `README.md` | §11: retitle, new architecture (shared canvas + Views), scripts table, owner-input list. |
| `DECISIONS.md` | Append migration decisions (§0 logging rule). |

### DELETED

| File | Reason |
|---|---|
| `src/scene/**` (rail, CameraRig, Effects, Scene, stations, waypoints) | Already deleted pre-audit (git status confirms). Camera rail, scroll-snap, keyboard paging, Bloom — all prohibited by §2. |
| `src/components/{DetailDrawer,ExpChip,HeroInner,HudCard,KeyboardNav,Nav,ProjChip,SceneLoader,Section,SimpleViewToggle,StoreBootstrap}.tsx` | Already deleted pre-audit — old station/dot-rail UI. |
| `scripts/make-resume.mjs` | §3.3: placeholder PDF generator must go; replaced by `scripts/check-resume.mjs`. |
| `scripts/make-og.mjs` | Superseded by `optimize-photo.mjs` (§7). Was already bypassed (prebuild runs optimize-photo only); deleted in phase 5. |
| `@react-three/postprocessing`, `postprocessing` deps | Already removed from package.json pre-audit (Bloom gone). |

### ADDED

| File | Reason |
|---|---|
| `scripts/check-resume.mjs` | §3.3: prebuild gate — production builds fail on missing/<20 KB/placeholder-marker PDF; dev warns only. |
| `.github/workflows/ci.yml` | §11: lint + typecheck + build on push/PR. |
| `docs/` hero screenshots | §11 (owner adds screenshots post-deploy; placeholder structure only). |
