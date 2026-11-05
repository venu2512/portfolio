# PORTFOLIO-BLUEPRINT.md

**Subject:** portfolio for **Venugopal V** — `src/content/data.ts` is the single source of truth for every
fact on the page. This blueprint is written for a **100 % original** site: MetaMask's structure and
*measured rules* are referenced (`docs/METAMASK-TEARDOWN.md`, sections cited as `TD §x`), while palette,
typography, illustration, 3D and all copy come from this project.

**Hard content rules applied here**

- Only facts present in `src/content/data.ts` or stated by the owner in the brief.
- No invented metrics, dates, awards or testimonials. Derived numbers are computed (`deriveStats()`).
- Status wording: internship **completed** (May–August 2026), **not working anywhere now**,
  open to full-time roles and internships. Never "Present"/"Currently".
- The FAQ "technical stack" answer must not mention blockchain (the current answer in `data.ts` does not).
- Target roles: **AI Engineer, ML Engineer, Data Analyst, Full Stack Developer**.

Legend for every section below: **Pattern** (what it is lifted from) → **Layout / wireframe** →
**Copy slots** (data source) → **Motion** → **3D slot + fallback**.

---

## 1. Section map

| # | Section | TD pattern basis | Purpose |
|---|---|---|---|
| 0 | Announcement pill (dismissible) | TD §1 #1, TD §2 row 0 (floating update bar, white holder r12, 38 px) | State availability before anything else |
| 1 | Navbar | TD §3 (fixed 98 px transparent header, one persistent pill CTA, 3-group mega menu) | Navigate the page; keep one conversion action visible |
| 2 | Hero | TD §2 row 1 (oversized display headline, accent element, one primary + one secondary CTA, media) | Name + role + availability + proof of work, all above the fold |
| 3 | Stack marquee | not MetaMask — inspo `marquee-logos` tag + `find_components` (logo-cloud) | Show the toolset as a texture, not a wall of text |
| 4 | Proof strip | TD §2 row 4 (4 cards, 336.25 px each, 12 px gap, 24 px claim titles, each linking to evidence) | Numbers with a source, immediately after the promise |
| 5 | About | TD §7 "honesty designed in" + inspo `letter`/`manifesto` restraint | Short, factual positioning statement |
| 6 | Capability tiles (four roles) | TD §1 #4 + §2 rows 1–3 (pinned bento: 4 tiles, 347 px wide, r40, colour-blocked, one outcome line each) | Map resume bullets to the four target roles |
| 7 | Experience | TD §2 rows 2–3 (each story = one ground colour + a small set of equal-weight items) | Three roles, most recent first |
| 8 | Skills | TD §4.4 (radius/colour tokens read as a system) | Skill inventory by area, filterable |
| 9 | Projects | TD §2 bento tiles + TD §1 #5 (each card links onward) | Three projects, each one outcome line + stack |
| 10 | Education | TD §1 #7 (question headline + reassurance + single CTA in a 680×481 card) | Two credentials |
| 11 | FAQ | TD §8 FAQ accordion (`button[aria-expanded]` + `inert` panel) and TD §9 qualified-claim pattern | Answer recruiter questions honestly |
| 12 | Contact CTA | TD §2 row 4 "Get started" (104 px headline + pill CTA on a dark ground, the loudest single moment) | One clear ask |
| 13 | Footer | TD §1 #8 grouped sitemap + TD §8 sr-only landmark heading | Route to everything + legal/back-to-top |

Composition order is the page order in `src/app/page.tsx`; the four-role tile block is the one
structural addition (new component, sits between `About` and `Experience`).

---

## 2. Section specs

### 0 — Announcement pill

**Pattern.** TD §2 row 0: a floating, white, 12 px-radius bar at the bottom of the first viewport with a
12 px `type-label-caption` label, a one-line claim and a close control — not a full-width strip at the
top of the page.

**Layout.** Fixed, `bottom: 20px`, centred, `max-width: fit-content`, radius `999px`, `box-shadow:
--shadow-pop`. Collapses to the first line only if it would wrap under 360 px.

```
DESKTOP                                       360px
┌──────────────────────────────────────┐      ┌──────────────────────────┐
│ ● Open to full-time roles — Résumé ✕ │      │ ● Open to roles — CV  ✕  │
└──────────────────────────────────────┘      └──────────────────────────┘
        fixed, bottom 20px, pill                     same, shrunk copy
```

**Copy slots.** `profile.openToShort` ("Open to full-time roles and internships") + link label
"Résumé" → `profile.resumePdf`. Dismiss state persisted in `localStorage` (key `vv.announce`).

**Motion.** Enters with `translateY(12px) → 0` + `opacity` over 300 ms using `--spring`; on dismiss,
`opacity → 0`, `scale(0.96)`, then unmount. Reduced motion: opacity only.

**3D slot.** None.

---

### 1 — Navbar

**Pattern.** TD §3: fixed, transparent, 98 px tall at desktop, **no shrink and no shadow** (measured),
one persistent primary pill (`GET METAMASK`, 155×42, radius 100 px), grouped dropdowns on the left/middle,
a utility control on the right (MetaMask: language switcher; here: theme + 3D toggles, TD §3.1).
Mobile: hamburger only — logo + single primary pill survive (TD §3.3).

**Layout.** Current `.navbar` + `.wrap` (max-width 72 rem = 1152 px) is correct. Add a "Roles" dropdown
that mirrors the *structure* (not the content) of TD §3.2: one trigger button + a panel with a left
card grid and a right rail, keyboard-operable via `aria-expanded` / `aria-controls`.

```
DESKTOP (>=1024px)
┌────────────────────────────────────────────────────────────────────────────┐
│ [VV] Venu   About Experience Skills Projects Education FAQ ▾Roles   [Contact]│  ← 1 primary
└────────────────────────────────────────────────────────────────────────────┘
                                   panel (Roles dropdown)
                                   ┌──────────────────┬───────────────────┐
                                   │ AI Engineer      │ Explore more      │
                                   │ ML Engineer      │  • Résumé (PDF)   │
                                   │ Data Analyst     │  • GitHub         │
                                   │ Full Stack Dev   │  • LinkedIn       │
                                   └──────────────────┴───────────────────┘

<=768px
┌─────────────────────────┐
│ [VV] Venu        ☰      │   ← 1 primary pill only in the sheet
└─────────────────────────┘   full-screen sheet: 7 anchors + Contact + toggles
```

**Copy slots.** Anchors: About, Experience, Skills, Projects, Education, FAQ (existing `LINKS`).
Roles rail: the four owner-provided role names. Primary CTA: label "Contact" → `#contact`.
Sheet footer: `profile.email`, `profile.github`, `profile.linkedin`.

**Motion.** Unchanged (IO-driven `aria-current`); dropdown uses the TD §5.2 M2 shape — panel
`opacity`+`translateY(-8px→0)` over 150 ms with a spring ease, and *no* 1 s close delay (TD's 1 s delay
is hostile to keyboard users; intentional departure).

**3D slot.** None (Navbar sits above the canvas, `z ≥ 45`).

---

### 2 — Hero

**Pattern.** TD §2 row 1 + TD §0.4 fold rule: nav, headline, supporting line, CTAs and hero visual
complete inside the first viewport; display type sized to 2–3 balanced lines; modest top spacing.

**Layout / wireframe.** `grid md:grid-cols-2`, existing `min-h-[100svh]`, medallion in the right column.

```
DESKTOP 1440x900 — everything above the fold
┌────────────────────────────────────────────────────────────────────────────┐
│ [VV] Venu    About Experience Skills Projects Education FAQ       [Contact] │ 96px
├────────────────────────────────────────────────────────────────────────────┤
│  ( ● Open to full-time roles and internships )    ← pill, openToShort       │
│                                                                             │
│  Venugopal V  ▪                          ┌───────────────────────────────┐  │
│  ← h1 clamp(3.2rem, 7.5vw, 6.5rem)       │  3D PHOTO MEDALLION           │  │
│    + orange accent square (existing      │  cursor-following (see §4)    │  │
│      .accent-dot)                        │  1:1 slot, ~min(38vh, 420px)   │  │
│                                          │  fallback: framed portrait    │  │
│  Full-time roles and internships in      │  + 5 floating skill chips     │  │
│  AI, ML, Data Analytics, and Full Stack  └───────────────────────────────┘  │
│  Development  ← openTo (owner wording)                                      │
│                                                                             │
│  [ View my work ]  [ Download resume ]   GH  IN  @                          │
│  ↓ Scroll                                                                    │
└────────────────────────────────────────────────────────────────────────────┘

360px — same order, 1 column, medallion after the CTAs, still inside 100svh
┌──────────────────────────┐
│ ( Open to full-time … )  │
│ Venugopal V ▪            │  h1 wraps at the space (2 lines)
│ Full-time roles and      │
│ internships in AI, ML,   │
│ Data Analytics, and Full │
│ Stack Development        │
│ [View my work]           │
│ [Download resume]        │
│ ┌──────────────────────┐ │
│ │  medallion (fallback │ │
│ │  or 3D)              │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

**Copy slots.** eyebrow pill `profile.openToShort`; `h1` `profile.headline` ("Venugopal V"); accent mark
= existing `.accent-dot`; supporting line `profile.openTo`; primary CTA "View my work" → `#projects`;
secondary CTA "Download resume" → `profile.resumePdf`; icon buttons → `profile.github`,
`profile.linkedin`, `mailto:profile.email`; scroll cue → `#about`.

> **Owner decision (flagged, not invented):** `profile.tagline` and the first sentence of
> `profile.summary` both mention blockchain applications. The brief asks that blockchain be kept out of
> the *stack* answer and that the page stay honest. Recommendation: keep the hero supporting line as
> `profile.openTo` (blockchain-free, owner-provided) and leave the blockchain mention where it is
> factual and contextual (CertChain project, Blockchain skill group). Do not silently rewrite résumé
> sentences — that is the owner's call.

**Motion.** Existing line-mask reveal (`html.enhanced .line-mask > span` translateY 110 % → 0), staggered
120 ms per block, plus 3D fade-in. Reduced motion: no masks, no stagger, no 3D animation.

**3D slot + fallback.** `HeroSlot` → §4.1.

---

### 3 — Stack marquee

**Pattern.** Not a MetaMask pattern. Basis: inspo `marquee-logos` reference component and
`find_components type=logo-cloud`; TD §9's "numbers instead of adjectives" is honoured by labelling it
"Tools I actually use", not "Trusted by".

**Layout.** Two opposite-direction rows, `pause on hover`, `aria-hidden="true"` on the duplicate row.

**Copy slots.** `skills[*].items` + `profile.heroChips` (all existing). No new strings.

**Motion.** 40 s linear loop; `prefers-reduced-motion` renders a static wrapped row (already
implemented in `TechMarquee.tsx`).

**3D slot.** None.

---

### 4 — Proof strip

**Pattern.** TD §2 row 4 + TD §1 #5: exactly **four** cards, narrow (TD: 336.25 px, 12 px gap, 24 px
claim titles), each card **linkable to the evidence behind the claim**. TD §9 shows the claim formula
*"figure + source/timeframe"*, and TD §7's footnote band shows how claims stay auditable — copy that
*shape*, not the numbers.

**Layout.** 4 columns ≥1024 px, 2 columns 640–1023 px, 1 column below.

```
DESKTOP
┌───────────────┬───────────────┬───────────────┬───────────────┐
│ 3             │ 3             │ 7             │ 2027          │
│ Internships   │ Projects      │ Skill areas   │ B.Tech        │
│ derived ↓     │ → #projects   │ → #skills     │ → #education  │
└───────────────┴───────────────┴───────────────┴───────────────┘
  12px gaps, r20 cards, 24px figure, mono caption

360px: 2x2 grid, same cards
```

**Copy slots.** `deriveStats()` → `{ value: experience.length, label: "Internships" }`,
`{ projects.length, "Projects" }`, `{ skills.length, "Skill areas" }`,
`{ 2027, "B.Tech graduation" }` (education[0].period and the B.Tech credential are in `data.ts`).
Card links: `#experience`, `#projects`, `#skills`, `#education`.

**Claim-honesty rule (TD §9).** Every card carries a `mono-label` caption that states how the number is
derived ("3 roles on the résumé", "counted from Projects", "7 skill groups", "PPG Institute of
Technology"). No invented aggregation.

**Motion.** Existing `useCountUp` on first view; reduced motion → final value immediately.

**3D slot.** None.

---

### 5 — About

**Pattern.** TD §7 "trust placed where doubt appears" + TD §9 plain, second-person-free voice; the
inspo `manifesto`/`letter` restraint (no illustration, typography does the work).

**Layout.** Two columns at desktop (copy 60 % / Status card 40 %), single column mobile.

**Copy slots.** heading "About"; body `profile.summary`; Status card: "Status" / `profile.openToShort`,
"Institution" → `education[0].school`, "Based in" → `profile.location`, "Languages" →
`profile.languages` (`Tamil (Native) · English (Professional) · Telugu (Conversational)`).

**Motion.** `Reveal` on scroll (existing). No 3D.

---

### 6 — Capability tiles (four target roles) — **the new structural piece**

**Pattern.** TD §1 #4 + TD §2 rows 1–3: a single block of **exactly four** equal tiles, each one
sentence, each linking onward; TD's tiles are 347 px wide with a 40 px radius and a flat colour ground
per tile (TD §4.4 radius histogram, §4.1 tile tokens).
**Intentional differences:** the portfolio does **not** pin-scroll the block (TD §2 row 1–3 pins for
6300/2700/2700 px — a performance risk for a personal site, TD §7) and uses **20 px** card radius, not
40 px, to match `--radius-card`.

**Layout.** `grid md:grid-cols-2` (2×2) with a hairline `--line` border and pastel grounds; the role
name is the tile title, the résumé-derived line is the sentence, the source skills render as chips.

```
DESKTOP — "What I do" block, 2x2, cards r20, 1px hairline, pastel washes
┌─────────────────────────────────────┬─────────────────────────────────────┐
│ AI Engineer                         │ ML Engineer                         │
│ Five enterprise AI agents on a      │ LLM fine-tuning with QLoRA for      │
│ production multi-agent platform     │ efficient, low-resource deployment  │
│ [Multi-Agent Systems][Prompt Eng.]  │ [QLoRA][TensorFlow][Scikit-learn]   │
│ → #experience                       │ → #projects                         │
├─────────────────────────────────────┼─────────────────────────────────────┤
│ Data Analyst                        │ Full Stack Developer                │
│ Cleaning, EDA and visualisation on  │ MERN app with REST APIs, shipped to │
│ real-world datasets                 │ Vercel and Render                   │
│ [Pandas][Power BI][Plotly]          │ [React.js][Node.js][MongoDB]        │
│ → #experience                       │ → #projects                         │
└─────────────────────────────────────┴─────────────────────────────────────┘

360px: single column, same card anatomy
```

**Four-tile mapping — every line traceable to a résumé bullet (no invented claims):**

| Tile | Line on the tile (≤60 chars) | Source in `data.ts` | Links to |
|---|---|---|---|
| **AI Engineer** | "Five enterprise AI agents on a production multi-agent platform" | `experience[kreupai].bullets[0]` ("Contributed to the AISA AI Workforce Platform by developing enterprise-grade AI solutions") + `bullets[1]` ("Developed five AI agents: AI Contract Analyst, AI Executive Assistant, AI Procurement Officer, AI QA Coordinator, and AI Payroll Agent") + `bullets[3]` ("AI agent orchestration, prompt engineering, backend integration, testing, and deployment") | `#experience` |
| **ML Engineer** | "LLM fine-tuning with QLoRA for efficient, low-resource deployment" | `projects[legal-ai].bullets[0]`; plus `experience[nitroware].bullets[0]` ("Designed and trained ML models for real-world applications") and `bullets[1]` ("Improved model performance through systematic tuning and optimization") | `#projects` |
| **Data Analyst** | "Cleaning, EDA and visualisation on real-world datasets" | `experience[quadedutor].bullets[0]`, `[1]`, `[2]` | `#experience` |
| **Full Stack Developer** | "MERN app with REST APIs, shipped to Vercel and Render" | `projects[cloud-nova].bullets[0]` + `[1]` | `#projects` |

Chips per tile are drawn from `skills` groups (`ai`, `lang`, `web`, `viz`, `tools`) — no new vocabulary.

**Section headline candidates (owner picks one; no facts involved):** "What I do", "Four roles, one
résumé", or the role names only with no headline (inspo `index-first` restraint).

**Motion.** Staggered reveal 90 ms per tile; hover raises the card 2 px using `--spring` (not the TD
tile `aspect-ratio` spring, which is scroll-driven and unnecessary here). Reduced motion: opacity only.

**3D slot.** None — this block stays as flat colour so the medallion and keycap cloud remain the only
3D moments (TD §7 warning about over-weighting a personal site).

---

### 7 — Experience

**Pattern.** TD §2 rows 2–3: each story owns a full ground colour and holds a small set of equal-weight
items with short outcome lines. Portfolio translation: one card per role, most recent first, with the
period rendered in `mono-label` (TD §4.2's mono-for-labels habit).

**Layout.** Vertical stack; each card = header row (role · org · period) + bullet list + tool chips.
The current role uses the `--navy` band treatment (an own-token echo of TD's `#190066` ground).

```
┌───────────────────────────────────────────────────────────────────────────┐
│ AI/ML Engineer Intern · KreupAI Technologies LLC        May–Aug 2026      │  ← navy band
│ • Contributed to the AISA AI Workforce Platform …                         │
│ • Developed five AI agents: AI Contract Analyst, AI Executive Assistant,  │
│   AI Procurement Officer, AI QA Coordinator, and AI Payroll Agent.        │
│ • Developed AI-powered modules for the Daftar Accounting platform …       │
│ • Worked on AI agent orchestration, prompt engineering, backend …         │
│ [6 tool chips]                                                            │
├───────────────────────────────────────────────────────────────────────────┤
│ Data Science Intern · QuadEdutor Pvt. Ltd.              (no dates on résumé)│
│ … 3 bullets · [Explore]                                                   │
├───────────────────────────────────────────────────────────────────────────┤
│ AI & ML Intern · Nitroware Technologies    … 2 bullets                     │
└───────────────────────────────────────────────────────────────────────────┘
```

**Copy slots.** `experience[*].org/title/bullets/tools`; period via `experiencePeriod(job)`.
QuadEdutor and Nitroware have `startDate: null` → `experiencePeriod` returns `""`, so the blueprint
requires the date slot to render **nothing** rather than a placeholder (no invented dates).

**Motion.** Existing reveal + flash-bullet plumbing. No 3D.

---

### 8 — Skills

**Pattern.** TD §4.4/§4.1 (a measured radius + colour system applied consistently) and TD §7's
"content depth" habit; the keycap cloud itself is this project's own invention (inspo has no equivalent).

**Layout.** Filter chips (All + 7 groups) above a keycap grid; the 3D cloud is a slot.

**Copy slots.** `skills[*].label/items`; `keycapLabel()` for short keycap text; full item text stays in
the DOM list (already implemented).

**Motion.** Filter cross-fade 150 ms; 3D cloud drag/spin as below.

**3D slot + fallback.** `SkillsSlot` → §4.3.

---

### 9 — Projects

**Pattern.** TD §1 #5 and TD §2 row 4: a small number of cards, each **one outcome line**, each card
**a link to more**. TD tiles carry a single sentence and a flat ground — the portfolio's project card
keeps the sentence, adds a stack chip row and a repo link (`null` hides the link).

```
┌───────────────────────────────────┬───────────────────────────────────┐
│ Legal AI Chatbot                  │ Cloud Nova                        │
│ Domain-specific legal assistant   │ Full Stack Web Application        │
│ Fine-tuned Gemma with QLoRA for   │ MERN app with REST APIs, shipped  │
│ low-resource deployment           │ to Vercel (web) and Render (API)  │
│ [Gemma][QLoRA][Python]            │ [MongoDB][Express][React][Node]   │
│ 3D slot / fallback illustration   │ 3D slot / fallback illustration   │
└───────────────────────────────────┴───────────────────────────────────┘
┌───────────────────────────────────┐
│ CertChain  ·  Blockchain Certificate Verification System                │
│ Tamper-proof smart contracts on Ethereum (Sepolia) + QR verification …  │
└───────────────────────────────────┘
```

**Copy slots.** `projects[*].name/subtitle/stack/bullets/repoUrl`; the dialog shows the full bullet list.

**Motion.** Card tilt (existing, pointer:fine only) capped ≤6 px; dialog uses native `<dialog>` focus
return. Reduced motion: no tilt.

**3D slot + fallback.** `ProjectSlot` per project → §4.4.

---

### 10 — Education

**Pattern.** TD §1 #7 / §2 row 4: a question-or-plain headline, one reassuring sentence, one action —
inside a single card (TD's card was 680×481 with a 48 px headline).

**Layout.** Two cards side by side at desktop (already `Education.tsx`), stacked on mobile.

**Copy slots.** `education[0]` (PPG Institute of Technology, Coimbatore · B.Tech in Artificial
Intelligence and Data Science · 2023 – 2027) and `education[1]` (MSR Matric Hr. Sec. School, Madurai ·
Higher Secondary Certificate · 2020 – 2023). CTA: "Download résumé" → `profile.resumePdf`.

**Motion.** Reveal only.

---

### 11 — FAQ

**Pattern.** TD §8: `button[aria-expanded]` control with the panel `aria-hidden="true"` **and** `inert`
while closed. Implementation note: this project already uses native `<details>` (`Faq.tsx`), which is
strictly better for accessibility — **keep `<details>`**, and take from TD only the *presentation*
(custom typographic +/− affordance instead of a chevron, mono question numbering) and the honesty
pattern (TD §9 superscripts → here, each answer names its source: résumé, GitHub, or the owner).

**Layout.** Single column, max 72 rem, one open at a time (existing).

**Copy slots.** `faq[*].q/a` — all seven entries. If the owner adds a blockchain question, the **stack
answer stays as written** (no blockchain in the stack answer — current `data.ts` complies).

**Motion.** `<details>` open/close + 150 ms fade on the panel; reduced motion unchanged (no animation).

---

### 12 — Contact CTA

**Pattern.** TD §2 row 4 "Get started": the page's single loudest moment — a dark ground, a very large
headline, one pill CTA (TD measured 104 px headline, white 100 px-radius pill, dark `#190066` ground).
The portfolio's equivalent ground is its **own** `--navy: #171033`.

```
┌──────────────────────────────────────────────────────────────────────────┐
│  --navy band, r20, centred                                                │
│                     Let's build something          ← h2                  │
│     Full-time roles and internships in AI, ML, Data Analytics, and        │
│     Full Stack Development            ← profile.openTo                    │
│   [ Copy email ]  [ LinkedIn ]  [ GitHub ]  [ Download résumé ]           │
│   Madurai, Tamil Nadu, India · Tamil · English · Telugu                   │
└──────────────────────────────────────────────────────────────────────────┘
```

**Copy slots.** `profile.email` (copy-to-clipboard, no `mailto:`-only trap), `profile.linkedin`,
`profile.github`, `profile.resumePdf`, `profile.location`, `profile.languages`.
No phone number while `showPhone: false` (README §3.3 guard stays intact).

**Motion.** Band reveals with a single 400 ms opacity/translate; buttons keep ≤6 px magnetic pull on
fine pointers. Reduced motion: none.

**3D slot.** `CtaSlot` (small ring/medallion echo) → §4.5.

---

### 13 — Footer

**Pattern.** TD §1 #8 / §8: **grouped** link lists (MetaMask ships 8 groups), a social row, a legal row,
an sr-only heading for the landmark, and a year. Portfolio translation: 4 groups, one social row, one
legal row — no price/converter/guide groups exist here.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│ VV  Venugopal V — AI/ML Engineer                      [3D toggle] [Back to top]│
│ ──────────────────────────────────────────────────────────────────────────── │
│ Explore      Work            Skills          Contact                        │
│ About        Projects        AI/ML           Email (copy)                   │
│ Experience   Résumé (PDF)    Languages       GitHub                         │
│ Education    GitHub          Web Dev         LinkedIn                       │
│ FAQ          LinkedIn        Visualisation   Résumé (PDF)                   │
│ ↗ Back to top                                                            │
│ © 2026 Venugopal V · Built with Next.js, React Three Fiber · No fabricated   │
│ metrics on this page                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Copy slots.** All links from `data.ts` + anchors; the colophon line names the real stack
(`package.json`) and states the honesty rule. `<h2 class="sr-only">Site footer</h2>` for the landmark.
`© 2026` is the current year only (no invented history).

**Motion.** Existing back-to-top + progress ring. No 3D beyond the toggle.

---

## 3. Reference vs. portfolio tokens (side by side)

Left column = measured MetaMask values (`TD §4`, `docs/reference/metamask-reference-tokens.json`);
right column = this project's tokens in `src/app/globals.css`. "Diff" says why they differ — each
difference is deliberate, and none of the rights reuse MetaMask assets.

| Axis | MetaMask reference | This portfolio | Diff — why |
|---|---|---|---|
| Root font size | `10px` (so 1rem = 10px) | browser default `16px` | Simpler mental model; the type scale is authored in `clamp()` instead of fixed rem steps. |
| Container | `--site-container-max-width: 1920px`; effective 1377 px at 1440 | `.wrap` `max-width: 72rem` = **1152 px**, `padding-inline: 1.5rem/2.5rem` | A portfolio reads better as a narrower column; the inspo spacing guidance asks for symmetric inline padding ≥24 px, which `.wrap` satisfies. |
| Page ground | `#ffffff` | `--bg: #fcf9f4` (warm paper) | Warmer ground so the fox-orange and pastels read as one family instead of tech-white. |
| Ink | `#0a0a0a` | `--ink: #15151a` | Slightly softer black; same contrast class. |
| Accent | `--consumer-orange: #ff5c16` | `--primary: #f6851b` | A different, warmer orange that belongs to this project. **Originality note:** `#f6851b` sits in the same orange family the fox mark uses; if more distance is wanted, shift hue/lightness by a few degrees and re-check `--primary-soft`. |
| Dark ground | `#190066` (money section), `#0a0a0a` (buttons) | `--navy: #171033` | Own navy; used once (Experience's current role + Contact band), which is the TD "one loud ground" rule without copying the value. |
| Pastel tiles | `#e5ffc3`, `#cce7ff`, `#eac2ff`, `#ffa680` (functional tokens styled inline) | `--lavender #e4dbff`, `--blush #ffdde6`, `--sky #d5e9ff`, `--cream #fff3d6` | Same *technique* (pastel per-category tile grounds), own hues, mapped through Tailwind `@theme` so they are real utilities. |
| Display scale | `type-display-l` = 48 px → **104 px**; hero h1 **120 px** | `.h1` `clamp(3.2rem, 7.5vw, 6.5rem)` ≈ 51 → **104 px**; `.h2` `clamp(2.2rem, 4.6vw, 3.9rem)` ≈ 35 → 62 px | Capped below the TD hero so a four-word personal name never eats the fold (TD §0.4 rule kept, magnitude reduced). |
| Body base | 24 px desktop / 20 px mobile | 16 px with `text-lg` (18 px) for lead paragraphs | 24 px body is a brand-scale decision; at portfolio length it reads shouty. |
| Type families | `MMEuclidCircularB`, `MMSansVariable`, `MMSansMono`, `MMPolyVariable` (variable display w/ `RESO`+`wdth`) | **Plus Jakarta Sans** (`--font-sans`) + **JetBrains Mono** (`--font-mono`) | Own faces; the *roles* are copied (one sans for UI, one mono for labels, one italic/accent word in the display line) not the faces. |
| Display emphasis | variable-font axis `"RESO" 5, "wdth" 20` on one letter, `font-style: normal` | `.accent` (italic + `--primary`) and `.accent-dot` (a small orange square after the name) | MetaMask's axis trick is unavailable with a static webfont; the italic word + orange square reproduce the *gesture* (one accent moment per heading) — and the square is this project's own signature. |
| Card radius | tiles **40 px**, blocks **12 px**, pills 100 px, nav buttons 4 px | `--radius-card: 20px`, pills `999px` | One radius for cards keeps the system legible at portfolio scale; 40 px tiles belong to a consumer app board. |
| Shadow | `0 2.4rem 3rem rgba(0,0,0,.1)`; `2.3rem 3.75rem 5.2rem rgba(0,0,0,.15)` | `--shadow-card` (3-stop: 2 / 30 / 60 px) and `--shadow-pop` | Softer, layered, warm-neutral: same "lift without a border" effect, tuned for a light paper ground. |
| Grid rhythm | 22 px grid padding/gap, 12 px card gaps, 16 px tile rows | `--radius-card`-consistent gaps via Tailwind (`gap-6`, `gap-3`) | The TD numbers are internal to a marketing grid; the portfolio keeps a 4/8-based rhythm. |
| Section rhythm | pinned scroll containers 6300/2700/2700 px; 22 px grid seams | `.section { padding-block: 3rem }` desktop / `2.5rem` mobile — **a seam is 2 × padding-block = 96 px / 80 px**, inside the archive's 80–160 px band | **Corrected during implementation:** the repo models the *seam* (two neighbouring paddings), not a single section's padding, so it was already compliant. `.wrap` stays `padding-inline`-only, which is what keeps this true. No change made. |
| Motion | one `--motion: 0/1` multiplier; durations `calc(var(--motion) * speed)`; `linear()` springs 150/950 ms; Lenis | `--spring: cubic-bezier(0.4,1.35,0.5,0.97)`; reveal gated behind `html.enhanced`; Lenis on fine pointers only | Same *architecture* (one dial, spring easings, opt-in enhancement, `prefers-reduced-motion` honoured) with this project's own curve and no scroll-pinning. |
| Pointer effects | `mousemove` listeners in 6 bundles | Magnetic buttons (≤6 px), cursor dot, card tilt — all `pointer:fine` and reduced-motion gated | Same idea, explicitly capped so it never fights scrolling. |
| 3D | three.js WebGL2 background layer + Lottie product UI + canvas kinetic type | **Cursor-following photo medallion**, experience stage, draggable keycap cloud, per-project mini objects, rendered through drei `<View>`s into DOM slots | Original concept: the 3D here is *about the person* (a portrait medallion) and is progressive enhancement with a full 2D fallback — MetaMask's 3D is decorative background. |

---

## 4. 3D `View` slots, fallbacks and the medallion concept

All slots follow the project's existing architecture (one shared lazy `<Canvas>`, drei `<View track>`
per placeholder, zustand registry, tier-capped active views, `data-mode="simple"` fallback). Nothing
below adds a second canvas.

### 4.1 `HeroSlot` — the cursor-following photo medallion (the signature)

- **Concept.** A circular medallion of the owner's portrait (`profile.photo.cutout` preferred, else
  `profile.photo.src`) with a soft procedural rim and a 3D "chit" behind it; the whole object rotates
  toward the pointer with a spring, and returns to a calm 3/4 pose when the pointer leaves.
- **Materials/geometry.** Rounded cylinder + a plane textured with the cutout, `MeshPhysicalMaterial`
  (tier `high`) / `MeshStandardMaterial` (tier `low`), ContactShadows on `high`, `BlobShadow` on `low`,
  DPR capped by `src/lib/quality.ts`.
- **Fallback (no WebGL / Save-Data / context lost / reduced motion).** The existing framed portrait with
  5 floating chips (`profile.heroChips`) and the monogram badge when no photo exists
  (`photo-meta.json → hasPhoto:false` today).
- **Reduced motion.** Static 3/4 pose, no pointer tracking, no idle float.

### 4.2 `ExperienceSlot` — role stage

- **Concept.** Three calm plates (one per employer) with the active company lifted; no pulsing beacon
  (removed by an earlier decision — keep it removed).
- **Fallback.** The plain experience cards in the DOM list; the canvas is `aria-hidden`.

### 4.3 `SkillsSlot` — keycap cloud

- **Concept.** Draggable keycap cloud built from `skills[*].items` with the filter state mirrored from
  the DOM chips (`filterMirror.ts` exists).
- **Fallback.** The same chip grid with working filters (already implemented as the `simple` view).

### 4.4 `ProjectSlot` — one mini object per project

- **Concept.** Three procedural mini-objects derived from each project's stack (e.g. a stacked-plate
  motif for Legal AI Chatbot, a layered-box motif for Cloud Nova, a chained-link motif for CertChain) —
  **no logos, no third-party marks, no copied artwork**.
- **Fallback.** A flat illustration per project (already present) with the same caption and stack chips.

### 4.5 `CtaSlot`

- **Concept.** A small matte ring/orbit echoing the medallion, low key, no text in 3D.
- **Fallback.** Nothing (band works with DOM only).

**Budget rules.** Max 2 active views at `medium`, 1 at `low`; no postprocessing; no textures over
1024 px; no `OrbitControls`; all 3D off when `prefers-reduced-motion` is set. This keeps the 3D layer
inside the "progressive enhancement" promise in the README.

---

## 5. Motion spec (portfolio)

| # | Element | Trigger | Property | Duration / easing | Reduced motion |
|---|---|---|---|---|---|
| P1 | Section reveal (`Reveal`) | in-view (IO) | `opacity`, `translateY(14px→0)` | 500 ms, `--spring` | no transform; content visible immediately (already gated behind `html.enhanced`) |
| P2 | Hero line mask | in-view | `translateY(110% → 0)` | 700 ms, stagger 90 ms | none (no mask) |
| P3 | Capability tiles | in-view | `opacity`, `translateY(10px→0)` | 450 ms, stagger 90 ms | opacity only |
| P4 | Stat count-up | in-view | text content | 900 ms | final value immediately |
| P5 | Card hover | pointer | `translateY(-2px)`, shadow | 300 ms, `--spring` | none; and `pointer:fine` only |
| P6 | Magnetic buttons | pointer | `translate(x,y)` ≤6 px | 200 ms | none |
| P7 | Nav dropdown | click / Enter | `opacity`, `translateY(-8px→0)` | 150 ms spring | opacity only |
| P8 | Mobile sheet | click | `opacity` + `translateY(8px→0)` | 220 ms | instant |
| P9 | FAQ panel | `<details>` toggle | `opacity` | 150 ms | none |
| P10 | Marquee | autoplay | `translateX` loop | 40 s linear | static wrapped row |
| P11 | Medallion pointer follow | pointer | spring-rotated quaternion, ≤18° | frame-driven | static pose |
| P12 | Keycap cloud drag | drag | spin/velocity decay | frame-driven | static grid |
| P13 | Announcement pill | load / dismiss | `opacity` + `translateY`/`scale` | 300 ms | opacity only |
| P14 | Smooth scroll | wheel | scroll offset | Lenis inertia | native scroll (`scroll-behavior: auto`) |

**One dial.** Add a single `--motion: 1` / `0` custom property (TD §5.1) and multiply the durations
above by it, so a future audit has one switch instead of fourteen `@media` blocks.

---

## 6. Portfolio tokens

### 6.1 `docs/reference/portfolio-tokens.json` (see file) — `@theme` snippet for Tailwind v4

```css
/* src/app/globals.css — already live; this is the canonical block */
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface2: var(--surface-2);
  --color-ink: var(--ink);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-primary: var(--primary);
  --color-primary-soft: var(--primary-soft);
  --color-lavender: var(--lavender);
  --color-blush: var(--blush);
  --color-sky: var(--sky);
  --color-cream: var(--cream);
  --color-navy: var(--navy);
  --color-navy-ink: var(--navy-ink);
  --font-sans: "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --radius-card: 20px;
}
```

Values (light first; dark theme exists in this project, unlike the reference site — TD §4.1 noted the
reference has **no** dark mode, so dark here is a deliberate extra):

| Token | Light | Dark | Role |
|---|---|---|---|
| `--bg` | `#fcf9f4` | `#0e0e11` | Page ground |
| `--surface` | `#ffffff` | `#17171c` | Cards, sheet |
| `--surface-2` | `#f5f0e9` | `#1f1f26` | Soft fills, inputs |
| `--ink` | `#15151a` | `#f4f2ee` | Body text |
| `--muted` | `#6f6e78` | `#a0a0ab` | Secondary text |
| `--line` | `rgba(21,21,26,.09)` | `rgba(255,255,255,.1)` | Hairlines |
| `--primary` | `#f6851b` | `#ff8c3a` | **The one accent** |
| `--primary-soft` | `#ffe6cf` | `#3a2314` | Accent wash |
| `--lavender` / `--blush` / `--sky` / `--cream` | `#e4dbff` / `#ffdde6` / `#d5e9ff` / `#fff3d6` | darker equivalents | Pastel washes (one per category) |
| `--navy` / `--navy-ink` | `#171033` / `#f1eeff` | `#14102e` / `#eeeaff` | The single loud ground |
| `--shadow-card` / `--shadow-pop` | 3-stop warm-neutral layers | darker stops | Elevation |
| `--radius-card` | `20px` | `20px` | Cards, tiles, blocks |
| `--spring` | `cubic-bezier(.4,1.35,.5,.97)` | same | The one easing |

---

## 7. Prioritised implementation list

Each item is sized for **one commit**.

### P0 — correctness and the rules that are currently broken

1. ~~**Section rhythm fix.**~~ **Retracted — already compliant.** The repo's comment in
   `globals.css` states the seam model explicitly (2 × `3rem` = 96 px desktop, 2 × `2.5rem` = 80 px
   mobile), which sits inside the archive's 80–160 px band. Changing it would have been churn. The only
   thing to keep true is that `.wrap` never uses a `padding` shorthand that would zero `.section`'s
   `padding-block` — the comment already warns about it. *Screenshot it once at each breakpoint to
   confirm nothing has drifted.* **Status: no change needed.**
2. **Fold audit.** Screenshot 1280×800, 1440×900, 390×844 with the hero at `scrollY=0`; confirm nav +
   eyebrow + h1 + supporting line + both CTAs + medallion are inside `100svh` (TD §0.4). Adjust hero
   top padding or the medallion's `max-height`, not the type scale.
3. **Four-role capability block.** New `src/components/Roles.tsx` (2×2 pastel cards, chips, anchors) with
   the four lines from §2.6 of this document, wired into `page.tsx` after `About`.
4. **Proof-strip evidence captions.** Add the `mono-label` derivation line to each stat card and link each
   card to `#experience` / `#projects` / `#skills` / `#education` (TD §9 claim formula).
5. **Résumé PDF gate.** Replace `public/Venugopal_V_Resume.pdf` with the real, updated PDF (production
   build already fails without it) — owner action, still P0 because it blocks deploy.

### P1 — the moves that make it feel like the reference without copying it

6. **Announcement pill.** Floating, dismissible, `localStorage`-persisted, copy from
   `profile.openToShort` (TD §2 row 0 shape; own visual treatment).
7. **Nav dropdown parity.** Add the two-column "Roles" dropdown (left: four roles; right: résumé, GitHub,
   LinkedIn) with `aria-expanded`/`aria-controls` and keyboard handling; **drop** TD's 1 s close delay.
8. **One motion dial.** Introduce `--motion` and multiply the fourteen durations in §5 by it.
9. **Heading anchors + sr-only footer heading.** Every section h2 gets a `#slug` anchor link
   (`aria-label="Direct link to …"`), footer gets `<h2 class="sr-only">Site footer</h2>` (TD §8).
10. **Dark-theme parity pass.** Audit every new component in `[data-theme="dark"]` (the reference site has
    no dark mode, so this is our own responsibility) and check the accent on `--bg` for contrast.
11. **Derived-stats footnote.** One line under the proof strip explaining that all four figures are
    computed from `data.ts` (TD §9 qualified-claim habit) — zero invented numbers.

### P2 — polish and reach

12. **Marquee semantic upgrade.** Label it "Tools I use", `aria-hidden` the duplicate row, ensure the
    static reduced-motion fallback wraps.
13. **Kinetic headline flourish (optional).** If a scroll-linked headline effect is wanted, do it in CSS
    with `scroll-timeline` behind a feature query — **do not** bundle GSAP/ScrollTrigger (TD §7 warning).
14. **Project mini-objects.** Three procedural three.js mini-objects + their flat fallbacks (§4.4).
15. **OG/Twitter refresh + JSON-LD Person re-check** against the final copy (no phone while
    `showPhone: false`).
16. **Lighthouse pass** on the deployed URL (mobile Perf ≥85, A11y ≥95, SEO 100) and the manual matrix in
    the README checklist (no-JS, `--disable-webgl`, coarse pointer).

---

## 8. Implementation status

Two passes shipped. `npm run typecheck`, `npm run lint` and `npm run build` all pass, and the result
was verified in a headless browser against the running dev server (computed styles + full-page
captures at 1440 and 360 in `docs/reference/portfolio-*.png`).

### Pass 2 — full visual restyle (visible change)

| Change | Measured result | Where |
|---|---|---|
| **Full-bleed colour bands** replace the single white page: navy → warm wash ×3 → paper → orange | `#about` bg `rgb(23,16,51)`, `#roles`/`#skills`/`#education` bg `rgb(245,240,233)`, `#contact` bg `rgb(246,133,27)`, others transparent | `.band` / `.band-warm` / `.band-navy` / `.band-primary` in `globals.css`; every section now = outer band + inner `.wrap` |
| **Colour-blocked tile system** (one flat ground per tile, index numbers, one arrow) | `border-radius: 28px` on **23** tiles via `.tile`; 1 navy lead tile in Projects | `.tile`, `.tile-lavender/sky/blush/cream/soft/navy/primary`, `.tile-index`, `.tile-arrow`, `.tile-sub` |
| **Bigger display type** | `.h2` measured **70.4 px** at 1440 (was 62.4 px) | `.h2` → `clamp(2.4rem, 5.2vw, 4.4rem)` |
| **Wider section rhythm** | `padding-block` **64 px** desktop / **48 px** mobile → 128 px / 96 px seams | `.band, .section` (still inside the archive's 80–160 px band) |
| **Shared section head** with eyebrow + self-link anchor on all 7 sections | 7 `.section-anchor` links render | new `src/components/SectionHead.tsx` |
| Four-role capability block | 4 tiles on the warm band, links to `#experience` / `#projects` | `Roles.tsx` + `roles` in `data.ts` |
| Proof strip = 4 pastel tiles, each linking to its evidence, with derivation captions + footnote | 4 `.stat-card`s | `StatsStrip.tsx`, `deriveStats()` |
| Experience / Education / Skills / Projects / FAQ restyled onto tiles + bands | — | respective components |
| Two radii now documented: `--radius-card` 20 px (cards) and `--radius-tile` 28 px (big blocks) | — | `globals.css` |

At the end of pass 2 there was still a horizontal scrollbar at mobile widths — disclosed and fixed in pass 4
(`scrollWidth == clientWidth` now holds at 360/390/768/900/1440). The page height dropped from 14 462 px
to **9 490 px** at 1440 because content is denser (bands replaced padding stacks); after pass 4 the
full-page captures measure **9 783 px** at 1440 and 14 474 px at 390.

### Pass 3 — hero, navbar, announcement (the top of the page)

| Change | Measured result | Where |
|---|---|---|
| Hero display type raised to the reference's scale | `.h1` = **120 px** at 1440, `line-height 0.98`, 3 lines / 235 px tall (was 104 px max) | `.h1` → `clamp(3.4rem, 8.6vw, 7.5rem)` |
| Hero moved onto a full-bleed tint wash with its own rhythm | `padding-block` **88 px / 72 px** desktop, 96 px / 64 px mobile | `.band.hero-band` (two classes — a single class lost the cascade to `.band`, caught in verification) |
| **Fold verified**: nav → headline → lead → dateline → CTAs → medallion all above the fold | at 1440×900: h1 263–498, lead 522–586, dateline 606–640, frame 245–664, CTA 673–718, scroll cue 843–859 — all < 900 | `min-h-[calc(100svh-4.5rem)]` subtracts the navbar row |
| Hero supporting line is now the blockchain-free `profile.openTo` + a mono dateline | `hero-dateline` renders "Madurai… · AI engineer · Open to full-time roles and internships" | `Hero.tsx` |
| Medallion sits in a hairline frame (`.hero-frame`) instead of floating, with the 5 `heroChips` always visible beneath it | 5 chips + the 4 fallback chips inside the slot | `Hero.tsx` |
| **Roles mega-menu** in the navbar: 4 role links (title + outcome line) left, real destinations right | opens with `aria-expanded=true`/`aria-controls="roles-panel"`; panel 512×392, white, radius 20 px, `--shadow-pop`; 9 links; Esc closes and returns focus, outside pointerdown closes, **no 1 s close delay** | `Navbar.tsx` + `.nav-drop*` |
| Announcement restyled from a black band to a surface strip with a mono label | bg `rgb(255,255,255)`, hairline bottom border | `.announce`, `.announce-link`, `.announce-close` |

**Deviation from §2.0, with the reason:** the announcement stays at the top instead of becoming a floating bottom pill. A bottom-left pill would overlap the toast (bottom-centre) and the back-to-top button (bottom-right) on a 360 px screen. The restyle keeps the reference's *label + claim + dismiss* anatomy; only the position differs.

### Pass 4 — review fixes (section naming, mobile overflow, project dialog)

| Change | Measured result | Where |
|---|---|---|
| Capability section renamed to **"Areas of interest"** | eyebrow `Focus`, heading `Areas of interest`, permalink `#roles`; nav + footer labels read `Interests` while the `#roles` anchor stays valid for every existing link | `Roles.tsx`, `Navbar.tsx`, `Footer.tsx` (`LABELS`) |
| **Fixed a horizontal scrollbar on every phone** — the Skills grid track was forced to 574 px inside a 342 px container | root cause: the résumé line *"Git (branching, merging, pull requests, rebasing, conflict resolution)"* is 508 px and chips were `white-space: nowrap`, so the implicit grid track could not shrink below its min-content. Now `grid-template-columns` = `342px` at 390 and `526px 526px` at 1440; `scrollWidth == clientWidth` at **360/390/768/900** | `.chip` (`max-width: 100%`, `white-space: normal`, `overflow-wrap: break-word`) + `min-width: 0` on `.tile`/`.reveal` |
| Navbar desktop row moved from `md` to `lg` | at 768–1023 the eight links plus the right rail overran the viewport by 6 px (`scrollWidth` 906 at vw 900); those widths now get the mobile sheet, matching the reference's own nav change at 1025 | `Navbar.tsx` (`hidden lg:flex`, `lg:hidden`) |
| **Restored the project dialog** — the tile's "View details" opened nothing because the rewrite left `ProjectDialog` mounted nowhere (lint caught it as unused) | verified with real CDP input: click → `dialog.open=true`, name `Legal AI Chatbot`, 2 bullets, 4 chips, focus lands on the close button, `body.overflow=hidden`; Escape → unmounted, focus back on `BUTTON:View details`, scroll unlocked | `Projects.tsx` |

### Pass 1 — content and honesty

| Blueprint item | Status | Where |
|---|---|---|
| One motion dial (§7 P1 #8) | **partly shipped** | `--motion: 1` / `0` with a `prefers-reduced-motion` override; consumed by tiles/stat cards, older components keep hard-coded durations |
| sr-only footer landmark heading (§7 P1 #9) | **shipped** | `Footer.tsx` |
| Section rhythm (§7 P0 #1) | **retracted, no change needed** | seam model was already 96/80 px |
| Résumé PDF gate (§7 P0 #5) | **already satisfied** | `prebuild` reported `[check-resume] OK — real resume PDF found.` |

### Still open

| Item | Why |
|---|---|
| Fold audit (§7 P0 #2) | **done at 1440×900** (numbers above). At 390 px the mobile emulation reported an unreliable `innerHeight`, so the phone fold still wants a human look — `docs/reference/hero-390.png` is captured for that. |
| Dark-theme parity pass (§7 P1 #10) | the tile/band system reads correctly by construction (pastel tokens flip), but it has **not** been looked at in dark mode |
| Project mini-objects (§4.4), Lighthouse (§7 P2) | unchanged from §7 |
| Screenshots for review | `docs/reference/hero-1440.png`, `hero-390.png` (first 1800 px), `portfolio-1440.png` (1440×9783), `portfolio-360.png` (390×14474), `interests-1440.png` (the renamed section), `projects-grid-1440.png` |

## 9. Executive summary (10 lines)

1. **Copy the rules, not the surface:** four-tile blocks, one accent, numbers with sources, a disclaimer
   line for every qualified claim — all measurable in the reference and free of its assets.
2. **The four target roles become the page's spine:** one capability tile per role (AI Engineer, ML
   Engineer, Data Analyst, Full Stack Developer), each line traceable to a résumé bullet.
3. **Proof before the ask:** derived stats sit between the hero and the experience, and the contact band
   is the single loudest moment on the page — exactly once.
4. **One 3D idea, done properly:** the cursor-following photo medallion is the signature; every other
   slot is optional and every one has a full 2D fallback that renders without WebGL.
5. **Type and colour do the hierarchy:** `clamp()` display type over a warm paper ground, one orange
   accent, four pastel washes, 20 px cards — no decoration, no gradients, no third-party marks.
6. **Risk — performance:** copying the reference's 3 pinned scroll containers, background video, 21
   stylesheets and ad pixels would sink a personal site; the blueprint keeps pinning at zero and 3D at
   ≤2 active views.
7. **Risk — originality:** the accent `#f6851b` sits in the fox-orange family; if the owner wants more
   distance, shift its hue/lightness and re-check `--primary-soft` before shipping.
8. **Risk — content honesty:** the page states only what `data.ts` supports; two experience entries have
   no dates, so the date slot must render nothing, and no metric may be added to make the proof strip
   look stronger.
9. **Blockers are small and named:** section rhythm (48 px → 72–140 px), the fold audit, the four-role
   block, the stat-card evidence captions, and the real résumé PDF.
10. **Everything here is owner-editable in one file** (`src/content/data.ts`) — the blueprint never asks
    for a fact that is not already on the résumé.
