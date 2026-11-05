# METAMASK-TEARDOWN.md

Design + build teardown of **https://metamask.io/** (homepage, plus `/trade`, `/money`, `/developer`,
`/security`). Captured **2026-09-20** on Chrome 153 (headless, Windows), viewport heights 360×900 /
768×900 / 1024×900 / 1440×900, DPR 1.

**Purpose of this document:** reference data for `PORTFOLIO-BLUEPRINT.md`. Nothing here may be
reused as an asset — no copy, images, video, SVG, or code. Only *patterns, measurements and rules*
are transferable.

---

## 0. Method, tools and evidence rules

### 0.1 Evidence tags used throughout

- **[VERIFIED]** — read from the DOM, from computed styles, from network/asset URLs, from the site's
  own CSS/JS bundles, or from a screenshot this toolchain captured. Numbers are exact.
- **[INFERRED]** — my judgement, contrast maths, or extrapolation. Never a measurement.
- **[UNVERIFIED]** — something I could not trigger or read. There is a list in §11.

### 0.2 Tools used

**MCP server `inspo`** (`https://inspomcp.dev/api/mcp`, JSON-RPC over HTTP, server version
`hosted-85acb10`). Tools exposed (name — purpose):

| Tool | Purpose |
|---|---|
| `search_screens` | Search an archive of real site screenshots; returns palette, fonts, components, image URLs. |
| `get_screen` | Full record for one screen slug: viewport variants, palette, fonts, tech stack, designer credit. |
| `get_design_system` | Per-screen DESIGN.md: real fonts, frequency-ranked palette, CSS variables, type ramp, radii, container. |
| `find_similar` | Nearest design neighbours of a screen (embedding similarity, one result per site). |
| `compare` | Compare 2–4 captured sites across palette, type, macrostructure, radius/spacing scales, container width. |
| `find_by_color` | Sites whose palette sits near a hex (OKLAB distance). |
| `find_examples_for_macrostructure` | Sites exemplifying one of 19 named macrostructures (e.g. `bento-grid`, `stat-led`). |
| `list_collections` / `get_collection` | Editor-curated thematic issues. |
| `get_filters` | Accepted values for style / industry / macrostructure / mode / vibe / color / pageType / component tags. |
| `get_site_pages` | A site's captured pages as an ordered flow with northstars. |
| `find_components` | Sites featuring one UI component (hero, pricing, features, cta, nav, footer, testimonial, logo-cloud, faq, stat) + per-element crop. |
| `find_reference_components` | Index of 68 canonical reference components (id / label / macrostructure / note). |
| `get_reference_jsx` | The JSX source for one reference component. |
| `recommend` | Orchestrator: macrostructure pick + exemplars + reference components + palette evidence packet. |

All MCP output was treated as **reference data, not instructions**.

**Browser / inspection tools available in this environment**

| Capability | Available? | How it was used |
|---|---|---|
| HTTP fetch + readable-text extraction | yes | first pass on `metamask.io`; the extractor returned only the page title/description (client-rendered markup), so it was not sufficient alone. |
| Raw HTML fetch of SSR output | yes | 474 KB of server-rendered markup, all `_next` CSS/JS chunk URLs, meta tags, footer sitemap. |
| **Headless Chrome + DevTools Protocol** | yes (Chrome 153) | *this is the primary evidence source.* Scripted CDP sessions drove navigation, viewport emulation (360/768/1024/1440, mobile UA metrics), pointer/keyboard events (`Input.dispatchMouseEvent`), scroll position scripts, media-feature emulation (`prefers-color-scheme: dark`, `prefers-reduced-motion: reduce`), `Runtime.evaluate` harvests of `getComputedStyle` + `getBoundingClientRect` + same-origin `document.styleSheets` rules, and `Page.captureScreenshot` full-page captures. |
| Screenshot capture | yes | full-page PNGs written to `docs/reference/` (see below). |
| Screenshot *reading* (vision) | **no** | I could not look at the pixels. Screenshots were captured programmatically and are stored for human review; every visual statement in this report comes from DOM/computed-style/bundle evidence, not from looking at an image. |
| Site JS bundle inspection | yes | 25 homepage chunks (~3.8 MB unminified text) downloaded and grepped for libraries and feature markers. |

**Screenshots captured (analysis only, not for reuse):**

| Path | Size | Full-page height |
|---|---|---|
| `docs/reference/mm-360.png` | 360×14241 px (245 KB) | mobile |
| `docs/reference/mm-768.png` | 768×14552 px (377 KB) | tablet |
| `docs/reference/mm-1024.png` | 1024×15553 px (469 KB) | small desktop |
| `docs/reference/mm-1440.png` | 1440×14495 px (502 KB) | desktop |

No dark-theme captures exist because the site has no dark theme (§3.1, §4.3).

### 0.3 inspo reference data pulled for this brief

`get_filters` vocabulary: styles (11), industries (24), macrostructures (19), modes (2), vibes (10),
colors (9), pageTypes (9), componentTypes (10), tagComponents (17), `paperBand/displayClass/accentHue`
measured axes. Coverage counts matter when picking a shape: `bento-grid` **79** sites,
`marquee-hero` 156, `split-studio` 148, `feature-stack` 124, `portfolio-grid` 63, `stat-led` **4**,
`conversational-faq` **4**.

`recommend` with a light-first bento portfolio brief returned: macrostructure **Bento Grid**,
exemplar **milanote-com** (palette `#09cb57 #6a8cec #0c5424 #7d8188 #d1cdc3`, Tiempos + Inter),
reference components **`bento`** (*"six tiles, irregular spans. The largest carries the lead idea"*)
and **`tier-bento`**, plus two composition rules quoted in §0.4.

Searches run for the categories in the brief:

| Brief category | inspo query | Results kept (slug) | Informs |
|---|---|---|---|
| landing page / fintech wallet hero | `industry=fintech, pageType=landing, mode=light` | `useorigin-com` (Origin), `aave-com` (Aave) — both `marquee-hero` | Blueprint hero + nav |
| bento grid / feature tiles | `macrostructure=bento-grid, mode=light` | `daybridge-com`, `highlight-xyz` | Blueprint capability blocks |
| portfolio | `industry=portfolio, mode=light` | `emilkowal-ski`, `works-studio` (`portfolio-grid`) | Blueprint about/projects |
| stats / social proof | `find_components type=stat` | `alloy-com`, `calendly-com` | Blueprint proof strip |
| FAQ accordion | `find_components type=faq`, ref id `accordion` | `devin-ai`, `buly1803-com` | Blueprint FAQ |
| CTA with form | `find_components type=cta`, ref id `form-led` | `alloy-com`, `area17-com` | Blueprint contact CTA |
| mega-menu navbar | `find_components type=nav`, ref id `floating-pill` / `inline` | `alloy-com`, `amazon-com` | Blueprint navbar |
| footer sitemap | `find_components type=footer`, ref ids `list`, `colophon` | (index) | Blueprint footer |
| hero archetype | `find_reference_components type=hero` | `documentary`, `manifesto`, `marquee` | Blueprint hero |

Design-system pull: `get_design_system daybridge-com` — Next.js + Tailwind, h1 52px/500/-1.3px,
body 16px/450, radius scale `3→30px`, spacing base 4px, **container max 1440px**,
`--shadow-intensity` / `--border-intensity` variables. Useful as the *counter-position* to
MetaMask's much larger type and stronger colour.

### 0.4 Two composition rules the archive states as measured fact

Both were used when writing the blueprint:

> **Hero:** compose for the first viewport (~1280×800, `min-height:100svh`) — nav, headline,
> supporting line, primary CTA and any hero visual complete above the fold. Display type 2–3 balanced
> lines. Modest top spacing, not a tall empty gap.

> **Spacing:** vertical 80–160 px between sections (measured median biggest step **96 px**); under
> ~64 px two sections read as one crammed block; pick ONE rhythm, e.g. `clamp(72px,10vw,140px)`.
> Horizontal: centered column, symmetric `padding-inline` ≥24 px on mobile. Give the container
> `padding-inline` only — a `padding` shorthand out-ranks `section{padding-block}` and silently zeroes
> the rhythm.

---

## 1. Starting hypotheses — verdicts

| # | Hypothesis | Verdict | Evidence |
|---|---|---|---|
| 1 | Small **campaign banner** at the very top | **CORRECTED** | There *is* a campaign unit but it is **not at the top**: `[class*=updates-bar_wrapper]` measures 1425×38 at `y=838` of a 900 px viewport, i.e. a floating bar at the **bottom of the first viewport**, and `header.contains(banner) === false` [VERIFIED]. White `updates-bar_holder` with `border-radius:12px`, inner padding `10px 12px 0`, `type-label-caption` 12 px, "UPDATE" label span + title span, a QR panel whose background is a CMS image (`…/money-account-popup.jpg`), and a close control classed `updates-bar_close` [VERIFIED]. |
| 2 | **Navbar with three mega-menu groups**, "Explore more" column, "About" links, one persistent primary button, language switcher | **CONFIRMED, refined** | Header is `position:fixed`, `z-index:100`, transparent, 98 px tall; triggers are 3 buttons "Trade / Money / Developer" (`aria-controls="Header > Trade"`, `aria-expanded` toggling) plus a language button and one `GET METAMASK` link (155×42, `border-radius:100px`) [VERIFIED]. Each open panel is a full-width `dropdown_dropdown` at `x=24, y=97, 1377×778`, split into a left cards grid (`dropdown_grid-col-main` 940×740) and a right rail (`dropdown_grid-col-right` 333×740) containing `center-nav-wrapper` (283×339) and `bottom-nav-wrapper` (283×169) — the "Explore more"/secondary column [VERIFIED]. Card titles in the SSR markup: Trade · Swap · Perps · RWAs · Predict (consumer cards) and Developer · MetaMask Connect · Dashboard · Smart Accounts Kit · Embedded Wallets (mono-set developer cards) [VERIFIED]. |
| 3 | **Hero**: oversized two-line headline with one emphasized *italic* letter, single CTA, looping video, app screenshot | **CORRECTED on three points** | Headline markup is `Where <br>your <i>m</i>oney<br> lives` → **three** rendered lines in a 1132×360 box at 1440 [VERIFIED]. `font-size:120px`, `line-height:120px` (100 %), `letter-spacing:normal`, `font-weight:400`, `text-align:center`, family `MMPolyVariable` [VERIFIED]. The `<i>` is **not italic** — `font-style:normal`, and the emphasis is a variable-font axis: `font-variation-settings:"RESO" 5,"wdth" 20`, with the element also carrying `--variable-font-reso:5` [VERIFIED]. The hero media is a full-bleed **video** (1425×900, `object-fit:cover`, `position:absolute`) with `autoplay muted loop playsinline preload="metadata"`, `poster=/assets/video/home-1920-cover.jpg`, sources `video/webm home.webm` + `video/mp4 home.mp4` [VERIFIED]. The "app screenshot" is actually a **Lottie animation inside a phone mock** (358×758, `border-radius:32px`, `background:#121416`, parent `hero-home-update_phone-ui`) [VERIFIED]. Single CTA is also wrong: the hero has a white pill `GET METAMASK` (155×42, radius 100 px, at y=679) *and* four tile links below [VERIFIED]. |
| 4 | **Three capability blocks** ("Trade anything", "Turn your money on", "Maximum security"), each a large heading + four one-line verb-led tiles; security has a fox SVG | **CONFIRMED, refined on copy shape** | The three blocks are three **pinned scroll containers**: `hero-home-update_scroll-container` 6300 px tall (7 viewports) whose sticky child is 900 px; `bento-reveal_scroll-container` 2700 px; `security-bento` 2700 px. Headings: "Trade anything" (h2, 104 px), "Turn your money on" (104 px, colour `#cce7ff`), "Maximum Security" (48 px, white, centred) [VERIFIED]. Each block carries **exactly four** tiles, 347 px wide, `border-radius:40px`, arranged two-per-side around a 358 px phone in the middle [VERIFIED]. Tile copy is **not** verb-first one-worders but full outcome sentences with a number where possible: "Long or short perps with up to 50x leverage" (`/perps`), "Swap thousands of tokens on every popular network" (`/swaps`), "Trade on the future with prediction markets" (`/prediction-markets`), "Buy tokenized stocks, funds, and commodities" (`/rwa`) [VERIFIED]. Security block contains **5** fox SVGs [VERIFIED]. |
| 5 | **Trust/stat strip of four cards** each linking onward | **CONFIRMED** | Bottom `block-grid_block-grid` first child is a full-width block, 1381×462, `grid-template-columns: 336.25px ×4`, `gap:12px`, `border-radius:12px`. Card headings (24 px): "4.7★ rating on the App Store", "100MM+ downloads across Google Play, the App Store, and Chrome Web Store", "Rated the #1 most secure wallet by Coinspect", "Billions of transactions since 2016"; links go to `/download` (×2) and `/security` (×2) [VERIFIED]. |
| 6 | **"Get started" conversion block**: heading, primary CTA, email input, full-bleed background image | **PARTLY CORRECTED** | "Get started" block: 1381×600, h2 **104 px** in `#cce7ff`, one white pill CTA `GET METAMASK` (radius 100 px), 1 image; background `rgba(0,0,0,0)` — **no full-bleed background image** [VERIFIED]. The **email input lives in a separate sibling block** (680×481): "SIGN UP TO RECEIVE UPDATES AND ANNOUNCEMENTS", two checkboxes (General updates / Developer updates), `<input type=email placeholder="Email address">`, a `SUBSCRIBE` submit, consent sentence + `Privacy Notice.` link [VERIFIED]. |
| 7 | **"New to crypto?" education block** with three decorative assets + "Start lesson" CTA | **CONFIRMED** | Sibling 680×481 block: h3 "New to crypto?" 48 px in `#190066`, copy "You're in the right place. Explore guides that cover everything from setting up your wallet to making your first trade.", pill CTA `START LESSON` (radius 100 px, bg `#190066`) → `/news/guides#latest`, **3 images** [VERIFIED]. |
| 8 | **Grouped footer sitemap**, social row, legal links, superscript footnotes | **CONFIRMED** | Footer groups found: Trade, Money, Developer, Get MetaMask, Explore prices, Explore conversions, Explore guides, Explore content; then language switcher + `MetaMask / Privacy Policy / Terms of Use / Contributor License Agreement / Sitemap / Accessibility / Manage Cookies` + "©2026" [VERIFIED]. Footnote pattern is a dedicated `disclaimer_disclaimer` section (135 px tall at 1440) whose text begins "¹APY is variable and not guaranteed ²MetaMask Card legal copy…" [VERIFIED]. |
| 9 | `theme-color` white; AVIF images from a headless-CMS image CDN with width/quality params; hero WebM; OG image exists | **CONFIRMED with one correction** | `<meta name="theme-color" content="#ffffff">`, `<link rel="canonical" href="https://metamask.io">`, OG+Twitter tags, OG image on `images.ctfassets.net` [VERIFIED]. Images really are Contentful (`images.ctfassets.net/clixtyxoaeas/…`) requested as `?w=1920&q=75&fm=avif` with `loading="lazy"` and `sizes="(min-width: 1024px) 100vw, 100vw"` [VERIFIED] — **but the bytes actually delivered on the homepage at capture were 25 PNG + 11 SVG (2 other)**, so the `fm=avif` parameter is not effective for those assets [VERIFIED]. Hero video: `home.webm` + `home.mp4` fallback [VERIFIED]. |
| 10 | Any **3D or cursor-reactive** element on the homepage or `/security`, `/trade`, `/money`, `/developer` | **YES — three distinct techniques** | See §5.4. Summary: (a) one real **three.js WebGL2 scene** (full-width 1425×900 canvas in the `bento-reveal` section) — three.js is bundled with `WebGLRenderer`, `ShaderMaterial`, `PerspectiveCamera`, `MeshPhysicalMaterial`, `GLTFLoader` (26 hits) and `DRACOLoader` (7 hits) [VERIFIED bundled / INFERRED usage]; (b) **Lottie** animations rendered to 2D canvas in the hero phone, the money-bento phone, the security phone, a `globe-animation` (412×412) and the page loader [VERIFIED]; (c) **canvas kinetic type** — the `/trade` and `/money` pages render a `skewing-title` heading into a canvas (1110×306 and 892×434) [VERIFIED]. Pointer reactivity: `mousemove` listeners exist in 6 of 25 chunks and one sets animated `{x,y}` state from `clientX/clientY` — i.e. a pointer-follow/parallax effect [VERIFIED that the code exists / INFERRED as to which element]. No `<model-viewer>`, no r3f (`useFrame` 0 hits), no `OrbitControls`. |

---

## 2. Page architecture

Homepage composition order at 1440 px (`<main>` → `.page`, measured document positions and heights;
document height 14 495 px) [VERIFIED]:

| # | Section (class) | Purpose | Layout | Content pattern | Media | CTA | Background |
|---|---|---|---|---|---|---|---|
| 0 | `updates-bar_wrapper` (floating, bottom of first viewport) | Campaign awareness without stealing the navbar | 1425×38, white holder, radius 12 px, contains label + headline + QR panel | `UPDATE` (12 px, medium) + one short claim (≤30 chars) + QR/offer panel with CMS photo | 1 CMS image (QR panel bg) | whole bar clickable + `updates-bar_close` | transparent wrapper, white holder |
| 1 | `hero-home-update_scroll-container` — 0 → 6300 px, sticky child 900 px | Emotional promise → feature reveal while pinned | Full-bleed 100 svh sticky; centered text stack, then a 3-column board (tile 347 | phone 358 | tile 347) | h1 120 px centred (3 lines) → 4 tiles, each ≤60 chars, each with an icon/asset | background video 1425×900 + Lottie phone + 4 tile images + 2 SVGs | white pill `GET METAMASK` (hero) + 4 tile links | video over `#general-white`, transparent tiles |
| 2 | `bento-reveal_scroll-container` — 6300 → 9000 px, sticky child 900 px | "Money" story, the darkest/most saturated moment | Same pinned 3-column bento; heading centred at 104 px | h2 "Turn your money on" + 4 outcome tiles ≤53 chars | three.js WebGL2 canvas 1425×900 + 1 Lottie phone + 4 tile images | 4 tile links (`/money`, `/buy-crypto`, `/card`, `/money`) | section bg `#190066` (`--consumer-blue-dark`), tiles `#190066` / `#eac2ff` / `#013330` / `#ffa680` |
| 3 | `security-bento_security-bento` — 9000 → 11700 px, sticky wrapper 900 px + `sticky-bento` 1800 px with `padding-top:900px` | Reassurance; the bento slides up over the pinned heading | Pinned heading, then a 2×2 bento that covers it | h2 "Maximum Security" 48 px white + 4 tiles ≤60 chars | 5 fox SVGs + 9 images + Lottie phone | 4 tile links (`/security`, `/security`, `support.metamask.io`, `/transaction-shield`) | `#ffa680` (`--consumer-orange-light`); tiles `#190066` / `#cce7ff` / `#eac2ff` / `#e5ffc3` |
| 4 | `block-grid_block-grid` — 11 700 → 13 331 px, `padding:22px`, `gap:22px`, 2 columns of 679.5 px | Proof → conversion → capture → education, in one grid | 4 blocks: full-width stats row (4×336.25 px, gap 12), full-width "Get started" (1381×600), then two half blocks (680×481) | stats = 4 claims ≤72 chars; get-started = 2-word h2 + CTA; then newsletter form; then education card | 4 stat images/SVGs, 1 get-started image, 3 education images | `GET METAMASK` pill ×1, `START LESSON` pill ×1, `SUBSCRIBE` submit ×1 | transparent blocks on white; blocks are radius 12 px |
| 5 | `disclaimer_disclaimer` — 13 331 → 13 466 px | Legal honesty; makes the numbered claims defensible | Single `.container` (1377 px) narrow text column | footnote block, superscript-numbered | — | — | `#ffffff` |
| 6 | `<footer>` | Navigation for people who read to the end | 8 link groups + legal row + language/social controls | grouped link lists — **65 link labels** counted in the rendered footer text | monogram/fox marks | many links | white |

### 2.1 ASCII wireframe — desktop hero (1440 × 900, section 1, sticky view) [VERIFIED geometry]

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ header 98px, fixed, transparent            [GET METAMASK ▸155×42 r100]       │  y −1…97
│ logo 24px  nav buttons r4 pad 10/20/11  lang                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                    full-bleed <video> 1425×900 object-fit:cover              │
│                                                                              │
│              Where            ← h1 120/120, centered, 1132×360 @146,270      │
│              your [m]oney     ← <i>m</i> = variable-font axis RESO 5 wdth 20  │
│              lives                                                           │
│                                                                              │
│                    ┌───────────────┐  y 679                                │
│                    │ GET METAMASK  │  155×42 pill, white on video            │
│                    └───────────────┘                                         │
│                                                                              │
│  ┌─────────┐                                                        ┌─────┐  │
│  tile 347×370 r40 #013330                                     ↗ tile 347   │  │
│  └─────────┘   ← revealed by the pin: 4 tiles, 2 left / 2 right     └─────┘  │
│        ┌──────────────────────────┐   phone 358×758 r32 #121416  y 1358      │
│        │  Lottie app UI (342×741) │   ← NOT a static screenshot              │
│        └──────────────────────────┘                                          │
│  ┌─────────┐                                                        ┌─────┐  │
│  └─────────┘                                                        └─────┘  │
│  ↑ scroll container = 6300px (7 × 900) before the next section begins        │
│  ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ update bar 1425×38, white, r12, bottom of viewport ▁▁▁▁▁▁▁ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 ASCII wireframe — 360 px hero [VERIFIED: h1 39 px/39 px, hamburger `display:flex`, only logo + GET METAMASK visible, hero container 5908 px]

```
┌──────────────────────────────┐  360 wide
│ ☰        VV        [GET ▸]   │  navbar: logo + 1 primary + hamburger
├──────────────────────────────┤
│                              │
│      Where your money        │  h1 39/39, 3 lines, centered
│      lives                   │
│                              │
│      ┌──────────────────┐    │
│      │   GET METAMASK   │    │  pill stays, full-width-ish
│      └──────────────────┘    │
│                              │
│   ┌────────────────────┐     │  tiles stack 1-up (346px in block grid),
│   │  tile (stacked)    │     │  bento becomes a single column
│   └────────────────────┘     │
│   ┌────────────────────┐     │
│   │  phone / Lottie    │     │
│   └────────────────────┘     │
│  ▁▁▁ update bar ▁▁▁▁▁▁▁▁▁▁   │
└──────────────────────────────┘
```

### 2.3 ASCII wireframe — one capability block (desktop) and the same block at 360 px

```
DESKTOP — section 2 (bento-reveal), sticky 900px, scroll container 2700px
┌──────────────────────────────────────────────────────────────────────────────┐
│  bg #190066 (whole section)                                                  │
│  three.js canvas 1425×900 (WebGL2, ShaderMaterial, sits behind everything)    │
│                                                                              │
│              Turn your money on      h2 104/104 centered #cce7ff              │
│                                                                              │
│   ┌──────────┐                                 ┌──────────┐                   │
│   │ 347×378  │        ┌─────────────┐          │ 347×378  │  4 tiles, r40:   │
│   │ r40      │        │ phone 358×  │          │ r40      │  #190066         │
│   │ #190066  │        │ 758, Lottie │          │ #013330  │  #eac2ff         │
│   └──────────┘        └─────────────┘          └──────────┘  #013330/#ffa680 │
│   ┌──────────┐                                 ┌──────────┐                   │
│   └──────────┘                                 └──────────┘                   │
│   x=166                                    x=913                             │
└──────────────────────────────────────────────────────────────────────────────┘

360px — same block
┌──────────────────────────────┐
│  Turn your money on          │  39–48px, still centered
│  ┌────────────────────────┐  │
│  │ 4 tiles stack 1-up     │  │  tiles keep r40, get taller (aspect changes)
│  ├────────────────────────┤  │
│  │ phone / Lottie         │  │
│  ├────────────────────────┤  │
│  ├────────────────────────┤  │
│  └────────────────────────┘  │
└──────────────────────────────┘
```

---

## 3. Navigation and header behavior

### 3.1 Structure

- `<header class="header_header">` → `header_header-main` → `main_main-nav`; contains `<nav aria-label="Main navigation">` and three `<nav aria-label="Dropdown navigation">` wrappers [VERIFIED].
- Header geometry: `position:fixed; z-index:100; background:transparent; height:98px; top:−1px` at every scroll position tested (0, 1200, 2600, 3000) [VERIFIED]. The inner `header_header-main` declares `transition: translate 1.235s cubic-bezier(0.58,0.02,0.03,0.98)` but no `translate`/`transform` change was observed at any scroll position [VERIFIED measurement / [UNVERIFIED] trigger, §11].
- `html` carries `header-minimized` at every scroll position observed, plus `has-build-up-animation` on the header itself — i.e. the header is **transparent over the hero and never becomes an opaque bar in my captures** [VERIFIED].
- **No shrink, no shadow, no backdrop-filter:** `background:rgba(0,0,0,0)`, `box-shadow:none`, `backdrop-filter:none` on both the header and `header_header-main` [VERIFIED].
- Right cluster: language switcher button + `GET METAMASK` link `155×42` with `border-radius:100px`, `background:#fff`, target `https://link.metamask.io/home?sig=…&attributionId=…` (signed deep links with per-visit attribution ids) [VERIFIED].
- Nav buttons: `padding:10px 20px 11px`, `border-radius:4px`, `max-height:45px`, `font-size` from `type-label-eyebrow` (16 px/150 % at ≥768 px) [VERIFIED].

### 3.2 Open/close triggers

- Clicking "Trade" sets `aria-expanded="true"`, adds `button_active-dropdown`, and reveals a panel whose children go from `opacity:0; visibility:hidden; transform:matrix(1,0,0,1,0,-15)` to visible [VERIFIED]. Keyboard: `focus()` + `Enter` keydown on "Money" also sets `aria-expanded="true"` [VERIFIED].
- A pure `mousemove` over the trigger did **not** open the panel in a headless session (panel stayed `opacity:0; visibility:hidden`) [VERIFIED that hover alone did not open it in that session; hover-with-delay on a real pointer is **[UNVERIFIED]**].
- Panel transition: `opacity .15s cubic-bezier(.39,.575,.565,1)` + `transform .15s linear(0 0%, 0.007 1.05%, 0.03 2.1%, …)` — a **`linear()` spring easing with hand-authored stops** [VERIFIED]. The outer wrapper additionally declares `transition: 0.2s cubic-bezier(0.39,0.575,0.565,1) 1s`, i.e. a 1 s close delay [VERIFIED].
- Panel body: `dropdown_grid-wrapper` `padding:18px 20px 20px`; left column 940×740 (cards grid), right column 333×740 (`padding:30px 50px 30px 0`) with `center-nav-wrapper` (283×339, `padding-bottom:42px`) and `bottom-nav-wrapper` (283×169) [VERIFIED]. So: **cards on the left, secondary/"explore" links + about on the right** — the hypothesis's "Explore more column + About links" is structurally right, text not captured.
- No visible focus-ring values were captured; `:focus-visible` styling exists in the CSS but specifics are **[UNVERIFIED]**.

### 3.3 Mobile

- At 390 px the hamburger is `display:flex`; only two header controls remain visible with width > 40 px (`Go to home page` logo link and `GET METAMASK`) — the three nav groups are gone [VERIFIED]. The mobile pattern is a full-screen sheet (`.main_hamburger` toggle + a menu layer), exact animation **[UNVERIFIED]**.

### 3.4 Banner dismissal

- A `updates-bar_close` element exists in the markup [VERIFIED]; the banner's persistence mechanism (cookie/localStorage/session) and animation on dismiss are **[UNVERIFIED]**.

---

## 4. Visual system (reference tokens)

`html{font-size:10px}` — **1rem = 10px** [VERIFIED]. Base body: `font-size:2rem; line-height:1.5; color:var(--general-black); background:var(--general-white)`; at ≥768 px `font-size:2.4rem` [VERIFIED]. Yes, the **body base is 24 px on desktop** — the type classes are all rem-relative to a deliberately large base.

### 4.1 Colour (values read from the site's own custom properties) [VERIFIED]

| Token | Value | Used for |
|---|---|---|
| `--general-black` | `#0a0a0a` | Body text, primary button bg, footer text |
| `--general-black-light` | `#242628` | Secondary ink |
| `--general-black-mid` | `#1b1b1b` | Dark surfaces |
| `--general-white` | `#fff` | Page bg, primary button text, card bg |
| `--general-white-off` | `#f3f5f9` / `#f7f9fc` (two definitions) | Off-white section washes |
| `--general-gray` | `#c8ceda` | Dividers, disabled |
| `--general-gray-light` | `#e9edf6` | Default block/card fill (`.block_block` fallback) |
| `--general-gray-mid` | `#a1a8b7` | Muted text |
| `--general-gray-dark` | `#393d46` | Body copy on pastel tiles (newsletter privacy text) |
| `--consumer-orange` | `#ff5c16` | Brand accent (CTA emphasis) |
| `--consumer-orange-light` | `#ffa680` | **Security section wash**; RWA tile |
| `--consumer-orange-dark` | `#661800` | Ink on orange tiles |
| `--consumer-green` / `-light` / `-dark` | `#baf24a` / `#e5ffc3` / `#013330` | Accent, pastel tile, dark tile |
| `--consumer-blue` / `-light` / `-dark` | `#89b0ff` / `#cce7ff` / `#190066` | Tile, **money-section background**, tile |
| `--consumer-purple` / `-light` / `-dark` | `#d075ff` / `#eac2ff` / `#3d065f` | Tile, tile, tile |
| `--consumer-perps-green*` | `#bbf249` / `#a7df48` / `#013330` | Perps-specific green pair |

Light/dark handling: **there is no dark mode.** Emulating `prefers-color-scheme: dark` changed nothing
(`body` stayed `rgb(255,255,255)`, `color-scheme: normal`, no theme toggle in the DOM) [VERIFIED];
`@media(prefers-color-scheme:…)` does not appear in the homepage CSS bundle [VERIFIED].
Sections instead alternate **light → deep navy `#190066` → orange `#ffa680` → white**, which is the
site's real "mode switch".

Selection: `::selection{color:var(--color-selection, #fff); background:var(--background-selection, #0a0a0a)}` — coloured per tile through `--color-selection`/`--background-selection` [VERIFIED].

### 4.2 Typography

Fonts, all self-hosted `woff2` with `font-display:swap` and a generated metric-matched fallback
(`size-adjust`, `ascent-override` — i.e. `next/font` local fallbacks) [VERIFIED]:

| Family | Role | Notes |
|---|---|---|
| `MMEuclidCircularB` (`--font-mm-euclid`) | Default body family | `html{font-family:var(--font-mm-euclid)}` |
| `MMSansVariable` (`--font-mm-sans-variable`) | UI/card text (`.font-mm-sans`) | variable |
| `MMSansMono` (`--font-mm-sans-mono`) | Developer nav cards, labels | mono |
| `MMPolyVariable` (`--font-mm-poly-variable`) | **All display headings** | axes `"RESO"` + `"wdth"`; per-locale fallbacks to DelaGothicOne / GasoekOne / NeilBold / HarmonyOS |
| `NotoSansVariableZH/JP/RU`, `MPlusCode`, `NotoSansMono` | CJK/RU subsets | locale-driven `--font-mm-euclid` re-mapping |

Type scale (rem→px at 10 px base; first value = base, second = `min-width:1025px` override) [VERIFIED]:

| Class | Mobile | ≥1025 px | Line-height |
|---|---|---|---|
| `type-display-xxl` | 6.4rem = 64 px | 16rem = 160 px | 100 % (`letter-spacing −0.06rem → −0.096rem`) |
| `type-display-xl` | 5.6rem = 56 px | 12.8rem = 128 px | 100 % (`−0.048rem → −0.076rem`) |
| `type-display-l` | 4.8rem = 48 px | 10.4rem = 104 px | 100 % |
| `type-display-m` | 3.2rem = 32 px | 6.4rem = 64 px | 100 % |
| `type-display-s` | 2.4rem = 24 px | 5.6rem = 56 px | 100 % |
| `type-heading-xl` | 4.8rem | 7.6rem | 116.7 % → 110.5 % |
| `type-heading-l` | 3.8rem | 6rem | 126.3 % → 113.3 % |
| `type-heading-ml` | 3.2rem | 4.8rem | 125 % → 116.7 % |
| `type-heading-m` | 2.4rem | 4rem | 133.3 % → 120 % |
| `type-heading-sm` | 2.0rem | 3.2rem | 140 % → 125 % |
| `type-heading-xs` | 1.6rem | 2.0rem | 166.7 % → 140 % |
| `type-label` | 1.2rem | 1.6rem | — |
| `type-label-caption` | 1.2rem | 1.2rem | 166.7 % → 150 % |
| `type-label-eyebrow` | — | 1.6rem | 150 % |

Measured on-page values [VERIFIED]: hero h1 = 120 px/120 px (`MMPolyVariable`, weight 400, centred);
section h2 = 104 px/104 px; "Get started" h2 = 104 px; "New to crypto?" h3 = 48 px; tile titles 24 px;
stat-card titles 24 px; banner text 12 px; mobile hero h1 = **39 px/39 px**; mobile `body` 20 px.

Emphasis habits: **one letter or word inside the display heading carries the accent**, achieved three
ways across the site — variable-font axis on the homepage (`<i>m</i>`), per-tile `--color` inline
style (`style="color:var(--consumer-green-light)"`), and canvas-rendered skewing titles on subpages
[VERIFIED]. Italics are rare and specific (`.accent`-style flourish), never used for whole headings.

### 4.3 Spacing and layout

- Base unit: `1rem = 10px`; the visible spacing rhythm is **22 px** in the bottom grid
  (`padding:22px`, `gap:22px`), **12 px** between the four stat cards, and 16 px between bento rows
  (tile rows at y 972/1358 with 370 px height) [VERIFIED].
- Container: `.container{width:100%}` → `@media(min-width:1025px){max-width:var(--site-container-max-width)}` with `--site-container-max-width:1920px`; at 1440 the effective content box measured **1377 px** = viewport 1425 − 2×24 px, so the practical gutter is **24 px** and the container is effectively full-bleed on common desktops [VERIFIED].
- Column geometry at 1440: 3-column bento ⇒ `347 | 358 | 347` with ~21 px gaps beside the phone; 2-column block grid ⇒ `679.5px 679.5px` with 22 px gap; 4-column stat row ⇒ 4×336.25 px with 12 px gaps [VERIFIED].
- Vertical section padding comes from **scroll-container height**, not padding: 6300/2700/2700 px pinned blocks vs. 1588–1631 px for the unpinned bottom grid [VERIFIED].

### 4.4 Shape

- Radius histogram across the homepage CSS bundle (count = occurrences) [VERIFIED]:
  `4px` ×34 (nav buttons) · `50%` ×29 (icon/pill circles) · `12px` ×21 (blocks, cards, holders) ·
  `8px` ×15 · `16px` ×14 · `100px`/`9999px`/`999px` ×23 (all pills) · `18px` ×8 · `32px` ×6 ·
  `40px` ×5 (bento tiles) · `20px`/`11px`/`7px`/`3.2rem`/`4rem` smaller counts.
- Borders: hairline `1px` in `--general-gray`-family values; tiles use **no border**, colour-blocked instead; the primary button uses `inset 0 0 0 1px var(--button-color-hover)` as its "ring" [VERIFIED].
- Shadows (frequency-ranked) [VERIFIED]:
  `0 2.4rem 3rem 0 rgba(0,0,0,.1)` ×6 (28 px y-offset — soft, low-contrast lift) ·
  `2.3rem 3.75rem 5.2rem 0 rgba(0,0,0,.15)` ×2 (very diffuse, for the hero device) ·
  a 5-stop layered elevation (`31.2rem…`, `19.9rem…`, `11.2rem…`, `5rem…`, `12rem…`) for the largest floating element ·
  `none` where the design wants flatness.
- Gradients/overlays: none found as section backgrounds at desktop; the hero relies on the video plus a `-webkit-mask` radial-gradient trick on buttons (`mask-image:radial-gradient(white,black)`) [VERIFIED].

### 4.5 Iconography and imagery

- Icons are inline `<svg>` (11 on the homepage: language, chevrons, fox, plus/minus on the FAQ, close) with `fill="currentColor"` and `aria-hidden="true"` [VERIFIED].
- `<img>` on the homepage at capture: **25 PNG + 11 SVG (+2 other)** — CMS photos served from
  `images.ctfassets.net` with `?w=1920&q=75&fm=avif` and `sizes="(min-width: 1024px) 100vw, 100vw"`,
  plus first-party path assets (`/assets/images/fox/default.svg` 1000×1000,
  `/assets/shapes/header/dropdown/card-mascot.svg` 97×94) [VERIFIED].
- Aspect/crop: tile art is placed on a fixed grid cell and cropped, not letterboxed (tile 347×370 with
  `aspect-ratio` transitions); the phone mock crops the Lottie to a fixed 358×758 frame with
  `border-radius:32px` [VERIFIED].
- Alt text pattern: **decorative images carry `alt=""`** — every sampled `<img>` on the homepage had an
  empty alt [VERIFIED]. Meaning lives in the adjacent heading text.

---

## 5. Motion and 3D

### 5.1 The global motion switch

```css
@media (prefers-reduced-motion: reduce){ :root{ --motion:0 } }   /* default: --motion:1 */
.button_button{ --bg-duration: calc(var(--motion) * var(--motion-speed)); … }
@media (prefers-reduced-motion: reduce){ html{ scroll-behavior:auto } }
@media (prefers-reduced-motion: reduce){ .mm-poly-variable-font-reveal{ --variable-font-reso:5; will-change:auto } }
```
[VERIFIED] — i.e. every duration in the system is multiplied by a single `--motion` custom property, and
the scroll-linked variable-font reveal is pinned to its end state.

### 5.2 Motion catalogue

| # | Animation | Trigger | Property | Duration / easing | Technique |
|---|---|---|---|---|---|
| M1 | Header entrance ("build-up") | load | `translate` | **1.235 s `cubic-bezier(0.58,0.02,0.03,0.98)`** | CSS transition on the fixed header [VERIFIED spec / trigger INFERRED] |
| M2 | Mega-menu open | click / keyboard | `opacity`, `translateY(−15px→0)` | **0.15 s** `cubic-bezier(.39,.575,.565,1)` + `0.15 s linear(0 0%, 0.007 1.05%, 0.03 2.1%, 0.12 …%)` spring | CSS `linear()` easing with authored stops [VERIFIED] |
| M3 | Mega-menu close | blur/click-away | same | **0.2 s** with a **1 s delay** | CSS [VERIFIED] |
| M4 | Pinned hero sequence | scroll (6300 px of scroll for a 900 px sticky view) | section geometry, tile `aspect-ratio`, heading variable-font axis | tiles: **0.95 s `linear(0 0%, 0.007 …, 0.03 …, 0.12 …)`** | `position:sticky` + scroll-linked JS (GSAP + ScrollTrigger are in the bundle: 14 + 2 hits) [VERIFIED] |
| M5 | Heading variable-font reveal | scroll | `--variable-font-reso` (0→5) driving `scale` + `font-variation-settings` | scroll-proportional | inline style updated per frame; `scale:none; translate:none` resets visible in the DOM are GSAP CSSPlugin hallmarks [VERIFIED in DOM / INFERRED as GSAP] |
| M6 | Buttons | hover | `transform: translateY(−?)`, `background-color/color` inversion | colour **0.229 s ease-out** (nav variant: `--motion-speed-slow`, `--motion-speed/2.4`) | CSS transition with `--motion` multiplier [VERIFIED] |
| M7 | Tiles | pin/hover | `aspect-ratio`, colour | 0.95 s spring | CSS [VERIFIED] |
| M8 | Lottie loops | autoplay / in-view | canvas pixels | per-animation (loader, hero phone, money phone, security phone, globe 412×412) | `lottie-web` (bundled in 3 chunks, 96 hits) rendering into `<canvas class="">` [VERIFIED] |
| M9 | three.js scene | scroll into the `bento-reveal` section | WebGL2 draw calls | per-frame `requestAnimationFrame` (loop not captured) | three.js + `ShaderMaterial` + GLTF/DRACO loaders [VERIFIED bundled] |
| M10 | Canvas kinetic type | scroll | canvas pixels | n/a | `skewing-title-heading_track` canvases on `/trade` (1110×306) and `/money` (892×434) [VERIFIED] |
| M11 | Smooth scroll | wheel/touch | scroll offset | inertia | **Lenis** — the `<html>` class list contains `lenis`; Lenis appears in 4 chunks [VERIFIED] |
| M12 | Pointer-follow / parallax | `mousemove`, `pointermove` | animated `{x,y}` state (e.g. spring-set `{x:…,y:…}`) | per-frame | JS listeners in 6 chunks [VERIFIED code exists] |

**Reduced-motion behaviour [VERIFIED, and it is partial]:** with `prefers-reduced-motion: reduce`
emulated, the hero **video kept playing** (`video.paused === false`, `currentTime` advanced 1.16 s → 2.72 s
across a 1.5 s wait). So the global `--motion` switch covers transitions/scroll but **not the looping
background video**, and presumably not Lottie/three.js loops either.

### 5.3 Hero video specification [VERIFIED]

`<video autoplay muted loop playsinline preload="metadata" poster="/assets/video/home-1920-cover.jpg">`
with `<source type="video/webm" src="/assets/video/home.webm">` and
`<source type="video/mp4" src="/assets/video/home.mp4">`, pulled full-bleed at 1425×900 with
`object-fit:cover`. Height is the viewport height of the sticky wrapper. No `aria-hidden`, no
`controls`, no captions track.

### 5.4 Where the 3D / canvas work actually is

| Page | Canvas inventory [VERIFIED] | Interpretation |
|---|---|---|
| `/` | loader Lottie (0×0) · hero phone Lottie 342×741 · **WebGL2 1425×900 at y 6300** · money phone Lottie 342×742 · security phone Lottie 342×739 · `globe-animation` 2D canvas 412×412 · a second 0×0 WebGL2 probe canvas | one real 3D scene inside the money bento; everything else is Lottie/2D |
| `/trade` | `hero-mask-image` Lottie 894×485 (top 90) · `scrollable-lottie` 1266×633 (top 1083) · full-width canvas 1425×900 (top 900) · `skewing-title` canvas 1110×306 (top 4795) · loader | mask-reveal Lottie + a scroll-driven Lottie + canvas headline |
| `/money` | `scrollable-lottie` 1266×633 · full-width canvas 1425×900 (top 900) · `skewing-title` 892×434 (top 6218) · loader | same system + a calculator block and an FAQ accordion (custom `<button aria-expanded>` + `inert` panel, *not* `<details>`) |
| `/developer` | loader + full-width canvas 1425×900 at top 0 | hero-level WebGL/shader canvas |
| `/security` | loader · `reveal_lottie` 1335×751 (top 1795) · full-width canvas 1425×900 at top 0 | reveal Lottie + shader canvas |

**Answer to the hypothesis question:** yes — three.js/WebGL *is* used, but **not** as an interactive
product object; it is a full-bleed background layer. Lottie does the product-UI storytelling, and
canvas-rendered type does the kinetic headlines. No `<canvas>` on the homepage is wrapped in a
pointer-interactive element.

---

## 6. Responsive behaviour

Breakpoints observed in the CSS (media-query frequency) [VERIFIED]: `min-width:1025px` (845 rules),
`min-width:768px` (814), `max-width:767px` (91), `max-width:1024px` (89), plus `500px`, `1920px`,
`2200px`, `2800px`, and a landscape-phone query. Practical model: **phone ≤767 · tablet 768–1024 ·
desktop ≥1025**, with a wide-desktop tier from 1920 px.

| Width | Document height | Hero container | Bento-reveal | Security | Block grid | Nav | h1 |
|---|---|---|---|---|---|---|---|
| 360 | 14 241 px | 5908 px | 2532 px | 2321 px | 1512 px, 1 col (346 px) | hamburger + logo + `GET METAMASK` | — |
| 768 | 14 552 px | — | — | — | — | (captured, sheet behaviour [UNVERIFIED]) | — |
| 1024 | 15 553 px | — | — | — | — | full nav | — |
| 1440 | 14 495 px | 6300 px | 2700 px | 2700 px | 1631 px, 2 cols (679.5) | full nav | 120 px |
| 390 (mobile metrics) | 13 246 px | 5908 px | 2532 px | 2321 px | 1512 px | hamburger `display:flex` | **39 px** |

Reflow rules that matter [VERIFIED]: pinned scroll containers shrink (6300→5908, 2700→2532/2321) but
keep the pin; the 3-column bento collapses to a single column; the 4-up stat row becomes a 1-up stack;
`body` type drops 24 px → 20 px; the display scale drops `type-display-l` 104 px → 48 px (and the hero
h1 to 39 px, i.e. it uses a smaller step than the scale table alone would predict).

---

## 7. Performance and tech stack

| Aspect | Finding |
|---|---|
| Framework | **Next.js App Router** — `/_next/static/chunks/app/[locale]/layout-*.js`, `app/[locale]/[...slug]/page-*.js`, `main-app-*.js`, `polyfills-*.js`, React present [VERIFIED]. Middleware nonce is applied to `<link rel=stylesheet nonce=…>` (CSP-ready) [VERIFIED]. |
| Content | **Contentful** — `richText` module records with `sys.id`, `contentType` linkType, and images on `images.ctfassets.net/clixtyxoaeas/…` [VERIFIED]. |
| Rendering | Server-rendered HTML: full page structure, headings, tile copy and footer sitemap are in the initial 474 KB response, then hydrated (one client-rendered container collapses the middle sections) [VERIFIED]. |
| CSS | 21 stylesheet files (~829 KB unminified combined) linked per page, **CSS Modules** naming (`card-features_card-title__p4V5B`) [VERIFIED]. |
| JS | 25 homepage chunks, ~3.8 MB of chunk text; 52 `<script>` tags; **268 KB of inline script** [VERIFIED]. Libraries inside: Lenis, GSAP + ScrollTrigger, lottie-web, three.js (WebGLRenderer/ShaderMaterial/GLTF+DRACO) [VERIFIED]. |
| Fonts | Self-hosted `woff2`, `font-display:swap`, metric-matched fallback faces, script subsets for JP/KR/ZH/RU, a mono and a variable display face — many families preloaded for locales [VERIFIED]. |
| Images | Contentful CDN with `w=1920&q=75&fm=avif`, `loading="lazy"`, `sizes` attributes; **but the homepage delivered PNG bytes**, so the AVIF parameter is not being honoured for those assets [VERIFIED]. |
| Video | `home.webm` (~WebM VP-class) with `home.mp4` fallback, `preload="metadata"`, poster JPEG — the largest single asset on the page [VERIFIED]. |
| Third-party scripts | GTM (`GTM-M67JQ84`), GA4 (`G-V74KQYX56N`), Google Ads conversion beacons (×2), HubSpot (`hs-scripts`, `hs-analytics`, `hsadspixel`, `hs-banner`, `web-interactives-embed`), LinkedIn Insight, TikTok pixel, Reddit pixel, X/Twitter ads pixel, Osano consent manager, plus a Cloudflare-style `/b01874da77d8b383/script.js` [VERIFIED by URL]. |
| Caching hints | Hash-named `/_next/static/*` assets (immutable-by-convention) [VERIFIED]. |
| **Would hurt a portfolio if copied** | The consent manager, five ad pixels, HubSpot, a full locale font matrix, 21 CSS files, 25 JS chunks and a 6300 px pinned hero with a background video are all *appropriate for a consumer wallet brand* and **wrong** for a static personal site: they add megabytes, third-party requests and a compliance surface for zero user benefit. |

---

## 8. Accessibility and SEO

**Accessibility** [VERIFIED unless noted]

- Landmarks: `<header>`, `<nav aria-label="Main navigation">`, three `<nav aria-label="Dropdown navigation">`,
  `<main>`, `<footer>`. 179 focusable elements on the homepage.
- Heading hierarchy: exactly **one `<h1>`** ("Where your money lives"); section h2s in order
  (Trade anything → Turn your money on → Maximum Security → Get started); tile titles are h2/h3;
  stat claims are h2s inside links; the footer opens with a **visually hidden heading** (`sr-only`,
  "MetaMask site footer") so the landmark has an accessible name.
- Panels: the FAQ accordion uses real `<button aria-expanded="false">` controls with panels marked
  `aria-hidden="true"` **and `inert`** while closed [VERIFIED on `/money`].
- Heading anchors: every section h2 carries a `#slug` anchor link with
  `aria-label="Direct link to …"` — good for deep links and citation [VERIFIED].
- Decorative images: `alt=""` everywhere sampled; icons `aria-hidden="true"` [VERIFIED].
- `::selection` colours are per-tile themable, and text-transform is used for CTA labels
  (`GET METAMASK`, `START LESSON`) rather than lowercase-only styling.
- Contrast [INFERRED from hex values, not measured]: body `#0a0a0a` on `#fff` ≈ 20:1; `#e5ffc3` on
  `#013330` ≈ 12:1; `#cce7ff` on `#190066` ≈ 12:1; `#661800` on `#ffa680` ≈ 5.4:1 — all comfortably
  AA for text. The risky pairs are the *hover/inverted* button states (white text on `#0a0a0a` when
  inverted) — fine — and the 12 px mono captions on pastel tiles, which are small enough to want a
  measured check.

**SEO** [VERIFIED]

- `<title>` "MetaMask Crypto Wallet. Buy and Sell Bitcoin, Ethereum, Solana"; meta description
  (155 chars) "Buy, sell, swap, earn, and spend BTC, ETH, SOL and more — all in one self-custody crypto
  wallet. Total control over your assets, trusted by millions of users."
- `og:title` "MetaMask: Where your money lives", `og:description` "Buy, trade, earn, and spend, all
  from one app you control.", `og:type=website`, `og:url`, `og:image` on the CMS CDN;
  `twitter:card=summary_large_image`, `twitter:site/creator=@MetaMask`.
- `<link rel="canonical" href="https://metamask.io">`; `<meta name="theme-color" content="#ffffff">`;
  `<meta name="viewport" content="width=device-width, initial-scale=1">`; `lang="en"`.
- **2 JSON-LD blocks** present [VERIFIED count / contents not decoded].
- Content depth that helps ranking: `/price/<asset>` pages, converters, guide pages and a `/sitemap`
  page, all linked from every footer.

---

## 9. Content and voice patterns (formulas only, no copy reused)

| Slot | Formula | Length observed |
|---|---|---|
| Hero headline | *"[Place/possession] + [thing that matters]"* — short, 3 words max per line, no verbs | "Where your money lives" (4 words, 3 visual lines) |
| Section headline | *verb + object* imperative, 2–3 words, title case | "Trade anything", "Turn your money on", "Maximum Security", "Get started" |
| Tile line | *outcome + a number or a named thing*, no trailing period, ≤60 chars, verb-led or noun-led | 37–60 chars measured ("Long or short perps with up to 50x leverage" = 43) |
| Proof claim | *figure + source or timeframe* | "4.7★ rating on the App Store", "100MM+ downloads …", "Rated the #1 most secure wallet by Coinspect", "Billions of transactions since 2016" |
| Qualified claim | superscript `¹`/`²` in the line + a disclaimer band listing both letters in order | "Earn up to 4% with the Money Account¹", "…get up to 3% back²" |
| CTA label | ALL-CAPS verb (+object), 2–3 words, rendered in a pill | "GET METAMASK", "START LESSON", "SUBSCRIBE" |
| Education block | *question headline + reassuring one-liner + lesson CTA* | "New to crypto?" + 1 sentence |
| Footnote band | numbered facts, legal caveats, then disclosure sentence | 135 px tall at 1440 |

Voice: plain, second-person, benefit-first, **numbers instead of adjectives**; no exclamation marks in
the measured copy; uppercase reserved for CTA/banner labels; qualification always visible rather than
buried in a tooltip.

---

## 10. Why it works (UX principles, each tied to evidence above)

1. **One primary action, repeated everywhere, never doubled up.** `GET METAMASK` appears in the header,
   in the hero and in the "Get started" block; no competing primary button exists in any section [§2, §4.4].
2. **The page proves its promise before it asks.** Proof (stats + ratings + the independent-security
   claim) sits *after* the three capability stories and *before* the newsletter/sign-out blocks [§2].
3. **Grouped benefits in fours, not sevens.** Every capability block has exactly four tiles; the proof
   strip has exactly four cards; the footer groups by category [§1 #4, §2].
4. **Numbers carry the claims.** "50x", "4%", "3% back", "134 languages", "$10k", "100MM+", "since 2016",
   "4.7★" — measurable figures do the persuading instead of adjectives [§9].
5. **Colour is the navigation.** The three capability blocks are distinguished by ground colour
   (video-white → `#190066` → `#ffa680`) and its tiles by token, so a scrolling user always knows which
   story they are in without a progress bar [§4.1].
6. **Honesty is designed in.** Superscripts plus a dedicated disclaimer band make qualified financial
   claims auditable — a pattern that transfers directly to any "claims" a portfolio makes [§9].
7. **Scale contrast replaces decoration.** 120 px display type against 12 px mono captions (10:1)
   creates hierarchy with type alone, so cards can be flat colour with no borders or shadows [§4.2, §4.4].
8. **Whitespace is structural, not decorative.** Pinned scroll containers give each story a full
   viewport of its own; the unpinned grid at the end is the only dense moment [§2, §4.3].
9. **Motion is one dial.** A single `--motion` variable and one `linear()` spring family keep every
   transition coherent — and give reduced-motion a real switch instead of per-component hacks [§5.1].
10. **Trust is placed where doubt appears.** Security sits beside the money story; support and
    transaction-protection claims sit in the same block as the balance claims; the language switcher
    and 134-language support claim reinforce reach [§2].

---

## 11. Unverified / open questions

1. **Hover-open behaviour of the mega-menu on a real pointer** (with sub-100 ms intent delay). Click and
   `Enter` were verified; `mousemove` alone was not sufficient in the headless session.
2. **The exact banner dismissal mechanism** (cookie? `localStorage`? session?) and its exit animation.
3. **The header `translate` trigger.** A 1.235 s translate transition is declared and never observed to
   fire in my captures; I could not reproduce the state that animates it.
4. **What the three.js scene renders.** `GLTFLoader` and `DRACOLoader` are bundled and one WebGL2
   canvas is 1425×900 in the money bento, but the loaded asset (URL, mesh, material, camera path) was
   not captured; whether it is 3D geometry or a full-screen shader is not settled by my evidence.
5. **The complete scroll timeline** of the pinned hero/bento sections (frame-by-frame states, the exact
   `--variable-font-reso` curve, the `aspect-ratio` start/end values of the tiles).
6. **Which element the pointer-follow code drives** (mousemove listeners exist in 6 bundles; the target
   DOM node was not identified).
7. **Focus-visible ring specifics** for nav buttons, tiles and the footer link set (contrast, offset,
   width).
8. **Contrast ratios** — my values are computed from hex pairs, not measured from rendered pixels;
   contrast for text over the hero **video** is unknown and depends on the frame.
9. **The contents of the two JSON-LD blocks**, and whether a structured-data type is used for the
   organisation/product.
10. **The mobile menu pattern details** at 390–768 px (sheet vs. accordion, animation, focus handling),
    and the 768 px tablet nav state (it was captured for height only).
11. **Whether reduced-motion stops Lottie and three.js loops.** The video kept playing under
    `prefers-reduced-motion: reduce` [VERIFIED], so the other loops are suspect but untested.
12. **Exact `--motion-speed*` numeric values** (only their effects — e.g. 0.229 s — were read).
13. **Subpage section architecture** beyond counts and headings: `/trade` (3 top-level children),
    `/money` (4), `/developer`, `/security` were inventoried for media and headings only.
