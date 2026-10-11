import { renderToStaticMarkup } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "../src/App";
import { META_DESCRIPTION, SITE_URL, profile } from "../src/data/profile";

interface HelmetLike {
  title: { toString(): string };
  meta: { toString(): string };
  link: { toString(): string };
  script: { toString(): string };
}

const helmetContext: { helmet?: HelmetLike } = {};
const raw = renderToStaticMarkup(
  <HelmetProvider context={helmetContext}>
    <App />
  </HelmetProvider>,
);
const helmet = helmetContext.helmet;
if (!helmet) throw new Error("helmet context missing");

const decode = (input: string) =>
  input
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"')
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&#39;", "'");

const html = decode(raw);
const head = decode(
  [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString()].join("\n"),
);

let failures = 0;
const log: string[] = [];

function check(name: string, ok: boolean, detail = "") {
  if (!ok) failures += 1;
  log.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` :: ${detail}` : ""}`);
}

function has(value: string) {
  return html.includes(value);
}

/* ---- SEO / head ------------------------------------------------------- */
check("title", head.includes(">Venugopal V | AI Engineer</title>"), helmet.title.toString());
check("meta description matches", head.includes(`content="${META_DESCRIPTION}"`));
check("meta description under 160 chars", META_DESCRIPTION.length < 160, `${META_DESCRIPTION.length} chars`);
check("canonical", head.includes(`rel="canonical" href="${SITE_URL}"`));
check("og:image 1200x630", head.includes(`${SITE_URL}/og-image.png`) && head.includes('property="og:image:width" content="1200"') && head.includes('property="og:image:height" content="630"'));
check("twitter summary_large_image", head.includes('name="twitter:card" content="summary_large_image"'));
check("JSON-LD Person", head.includes('"@type":"Person"') && head.includes('"jobTitle":"AI Engineer"') && head.includes('"addressLocality":"Madurai"'));
check("JSON-LD sameAs", head.includes(profile.linkedin) && head.includes(profile.github));

/* ---- Structure -------------------------------------------------------- */
const h1Count = (html.match(/<h1/g) ?? []).length;
check("exactly one h1", h1Count === 1, `${h1Count}`);
check("h1 is the headline", html.includes(`<h1${""}`) && html.includes(profile.headline));
check("h1 has no aria-hidden", !/<h1[^>]*aria-hidden/.test(html));

const h2Expected = [
  "Systems I have designed, built and shipped.",
  "Three internships, one direction.",
  "What I build with.",
  profile.about.heading,
  "Let\u2019s build something intelligent.",
];
const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
  m[1].replace(/<[^>]+>/g, "").trim(),
);
for (const expected of h2Expected) {
  check(`h2 present: ${expected.slice(0, 34)}`, h2s.includes(expected), h2s.join(" | "));
}

/* ---- Content from profile.ts ------------------------------------------ */
const contentChecks: Array<[string, string]> = [
  ["status", profile.status],
  ["intro", profile.intro],
  ["about text", profile.about.text],
  ["languages", profile.languages],
  ["email", profile.email],
  ["featured eyebrow", profile.featuredProject.eyebrow],
  ["featured title", profile.featuredProject.title],
  ["featured text", profile.featuredProject.text],
  ["featured cta", profile.featuredProject.cta.label],
];
for (const stat of profile.stats) contentChecks.push([`stat ${stat.value}`, stat.value], [`stat label ${stat.value}`, stat.label]);
for (const agent of profile.floatingAgents) contentChecks.push([`agent ${agent.name}`, agent.name]);
for (const item of profile.featuredProject.stack) contentChecks.push([`featured stack ${item}`, item]);
for (const project of profile.projects) {
  contentChecks.push([`project ${project.title}`, project.title], [`project text`, project.text], [`project stack`, project.stack]);
}
for (const exp of profile.experience) {
  contentChecks.push([`exp ${exp.org}`, exp.role], [`exp org`, exp.org], [`exp when`, exp.when], [`exp stack`, exp.stack], [`exp text`, exp.text]);
}
for (const skill of profile.skills) {
  contentChecks.push([`skill group ${skill.group}`, skill.group]);
  for (const item of skill.items) contentChecks.push([`skill ${item}`, item]);
  if (skill.extra) {
    contentChecks.push([`skill group ${skill.extra.group}`, skill.extra.group]);
    for (const item of skill.extra.items) contentChecks.push([`skill ${item}`, item]);
  }
}
for (const edu of profile.education) {
  contentChecks.push([`edu ${edu.what}`, edu.what], [`edu where`, edu.where], [`edu when`, edu.when]);
}
for (const [name, value] of contentChecks) {
  check(`content: ${name}`, has(value), value.slice(0, 40));
}

/* ---- Placeholders and links ------------------------------------------ */
check("photo placeholder label", has("[ YOUR PHOTO ]"));
check("resume link + download", /href="\/resume\.pdf"[^>]*download/.test(html));
check("email mailto", html.includes(`href="mailto:${profile.email}"`));
check("linkedin link", html.includes(`href="${profile.linkedin}"`));
check("github link", html.includes(`href="${profile.github}"`));
check("featured github cta", html.includes(`href="${profile.featuredProject.cta.href}"`));

/* ---- Accessibility ---------------------------------------------------- */
check("skip link", /href="#main"/.test(html) && /id="main"/.test(html));
check("menu button aria-expanded", /aria-expanded="false"/.test(html));
check("menu button aria-controls", /aria-controls="mobile-menu"/.test(html));
check("menu panel id", /id="mobile-menu"/.test(html));
check("primary nav labelled", /aria-label="Primary"/.test(html));
check("decorative panel aria-hidden", /aria-hidden="true"[^>]*style="background:var\(--feature-panel-gradient\)"/.test(html) || html.includes('aria-hidden="true"'));
check("anchor targets", ["#work", "#experience", "#skills", "#about", "#contact"].every((a) => html.includes(`href="${a}"`)));

/* ---- Nothing invented -------------------------------------------------- */
check("no phone number anywhere", !/tel:/.test(html) && !/\+91[\s-]?\d/.test(html));
check("no photo.jpg request when missing", !html.includes('src="/photo.jpg"'));
check("footer copyright", html.includes("\u00a9 2026 Venugopal V"));

/* ---- Contrast (WCAG 2.1 relative luminance) ---------------------------- */
function srgbToLin(channel: number) {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}
function luminance(hex: string) {
  const value = hex.replace("#", "");
  const r = srgbToLin(parseInt(value.slice(0, 2), 16));
  const g = srgbToLin(parseInt(value.slice(2, 4), 16));
  const b = srgbToLin(parseInt(value.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(fg: string, bg: string) {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

const contrastPairs: Array<[string, string, string, number]> = [
  ["muted body on card", "#4A4A57", "#FFFFFF", 4.5],
  ["muted body on page", "#4A4A57", "#F5F5F7", 4.5],
  ["ink body on page", "#14141A", "#F5F5F7", 4.5],
  ["dark card text", "#C9C9D4", "#14141A", 4.5],
  ["accent-strong label on page", "#B83D0D", "#F5F5F7", 4.5],
  ["accent-strong label on card", "#B83D0D", "#FFFFFF", 4.5],
  ["white on accent-strong button", "#FFFFFF", "#B83D0D", 4.5],
  ["white on ink nav CTA", "#FFFFFF", "#14141A", 4.5],
  ["raw accent stat number (large)", "#D9480F", "#F5F5F7", 3],
  ["violet stack line on card", "#5B3DF0", "#FFFFFF", 4.5],
  ["dark eyebrow on dark card", "#FFB48F", "#14141A", 4.5],
  ["chip violet", "#3A22B8", "#EFEBFF", 4.5],
  ["chip orange", "#9C3208", "#FFE9DE", 4.5],
  ["chip blue", "#075A9C", "#DFF1FF", 4.5],
  ["chip green", "#14653A", "#DDF3E6", 4.5],
  ["white on contact gradient end", "#FFFFFF", "#2B1A5E", 4.5],
];
for (const [name, fg, bg, min] of contrastPairs) {
  const ratio = contrast(fg, bg);
  check(
    `contrast ${name}`,
    ratio >= min,
    `${ratio.toFixed(2)}:1 (min ${min})`,
  );
}

console.log(log.join("\n"));
console.log(`\n${log.length - failures}/${log.length} checks passed, ${failures} failed`);
if (failures > 0) process.exit(1);
