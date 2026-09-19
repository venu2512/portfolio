#!/usr/bin/env node
// Photo pipeline: reads public/profile/profile.jpg (+ optional profile-cutout.png),
// emits AVIF/WebP/JPG at 480/960/1440 into public/profile/generated/, a 24px
// blurred base64 placeholder, dominant color, and public/og.png (1200x630).
// Output: src/content/photo-meta.json
//
// Uses sharp (devDependency). Run: npm run photo (also wired to predev/prebuild).

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const profileDir = join(root, "public", "profile");
const genDir = join(profileDir, "generated");
const srcJpg = join(profileDir, "profile.jpg");
const srcCutout = join(profileDir, "profile-cutout.png");
const outMeta = join(root, "src", "content", "photo-meta.json");

const WIDTHS = [480, 960, 1440];
const MAX_BYTES = 200 * 1024;
const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif|tiff?)$/i;

/** Orphaned AVIF/WebP/JPG outputs no longer matching a source photo. */
function cleanOrphanGenerated() {
  if (!existsSync(genDir)) return;
  const keep = new Set();
  if (existsSync(srcJpg)) keep.add("profile");
  if (existsSync(srcCutout)) keep.add("cutout");
  for (const f of readdirSync(genDir)) {
    const m = f.match(/^(.+)-(?:480|960|1440)\.(?:avif|webp|jpg)$/);
    if (m && !keep.has(m[1])) {
      rmSync(join(genDir, f));
      log(`Removed orphan generated image ${f}.`);
    }
  }
}

function log(msg) {
  console.log(`[photo] ${msg}`);
}

async function emitSizes(input, baseName) {
  const meta = await sharp(input).metadata();
  for (const w of WIDTHS) {
    for (const [fmt, ext, opts] of [
      ["avif", "avif", { quality: 50 }],
      ["webp", "webp", { quality: 78 }],
      ["jpeg", "jpg", { quality: 80, mozjpeg: true }],
    ]) {
      const out = join(genDir, `${baseName}-${w}.${ext}`);
      let quality = opts.quality;
      // Drop quality until <= 200 KB (max 6 steps).
      for (let i = 0; i < 6; i++) {
        const pipeline = sharp(input)
          .rotate() // auto-rotate from EXIF (then stripped)
          .resize({ width: Math.min(w, meta.width ?? w), withoutEnlargement: true });
        if (fmt === "jpeg") pipeline.jpeg({ quality, mozjpeg: true });
        else if (fmt === "webp") pipeline.webp({ quality });
        else pipeline.avif({ quality });
        const buf = await pipeline.toBuffer();
        if (buf.length <= MAX_BYTES || i === 5) {
          writeFileSync(out, buf);
          break;
        }
        quality = Math.max(30, quality - 8);
      }
    }
  }
  return { width: meta.width ?? 0, height: meta.height ?? 0 };
}

async function makeOg(photoPath) {
  const W = 1200;
  const H = 630;
  const svgBase = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${W}" height="${H}" fill="#FF6A13"/>
    <circle cx="${W - 160}" cy="120" r="220" fill="#FF8A3D" opacity="0.55"/>
    <circle cx="120" cy="${H - 80}" r="180" fill="#FFE3CF" opacity="0.35"/>
  </svg>`;
  const layers = [{ input: Buffer.from(svgBase), top: 0, left: 0 }];
  if (photoPath) {
    // Pre-mask the photo buffer (rounded corners), then composite once.
    const mask = Buffer.from(
      `<svg width="360" height="360"><rect width="360" height="360" rx="64" fill="#fff"/></svg>`
    );
    const photo = await sharp(photoPath)
      .rotate()
      .resize(360, 360, { fit: "cover", position: "attention" })
      .png()
      .toBuffer();
    const masked = await sharp(photo)
      .composite([{ input: mask, blend: "destination-in" }])
      .png()
      .toBuffer();
    layers.push({ input: masked, top: 135, left: 100 });
    const nameSvg = Buffer.from(
      `<svg width="560" height="300" xmlns="http://www.w3.org/2000/svg">
        <text x="0" y="90" font-family="DejaVu Sans, Arial, sans-serif" font-size="64" font-weight="bold" fill="#FFFFFF">Venugopal V</text>
        <text x="0" y="150" font-family="DejaVu Sans, Arial, sans-serif" font-size="30" fill="#FFE3CF">AI/ML Engineer Intern</text>
        <text x="0" y="196" font-family="DejaVu Sans, Arial, sans-serif" font-size="24" fill="#FFE3CF">Multi-agent AI · Data Science · Blockchain</text>
      </svg>`
    );
    layers.push({ input: nameSvg, top: 210, left: 540 });
  } else {
    const monoSvg = Buffer.from(
      `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <rect width="1200" height="630" fill="none"/>
        <circle cx="600" cy="260" r="130" fill="#FFFFFF" opacity="0.14"/>
        <text x="600" y="310" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="110" font-weight="bold" fill="#FFFFFF">VV</text>
        <text x="600" y="420" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="40" font-weight="bold" fill="#FFFFFF">Venugopal V</text>
        <text x="600" y="470" text-anchor="middle" font-family="DejaVu Sans, Arial, sans-serif" font-size="26" fill="#FFE3CF">AI/ML Engineer Intern</text>
      </svg>`
    );
    layers.push({ input: monoSvg, top: 0, left: 0 });
  }
  await sharp({ create: { width: W, height: H, channels: 4, background: "#FF6A13" } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(join(root, "public", "og.png"));
}

async function main() {
  mkdirSync(genDir, { recursive: true });
  cleanOrphanGenerated();

  if (!existsSync(srcJpg)) {
    log("public/profile/profile.jpg NOT FOUND — writing { hasPhoto: false } and continuing.");
    log("Drop a portrait at public/profile/profile.jpg (min 1200px short side, face in upper half).");
    await writeMeta({ hasPhoto: false, hasCutout: false });
    await makeOg(null);
    log("Wrote monogram og.png.");
    return;
  }

  log(`Found profile.jpg — generating AVIF/WebP/JPG at ${WIDTHS.join("/")}px...`);
  const { width, height } = await emitSizes(srcJpg, "profile");

  // 24px blur placeholder + dominant color
  const tiny = await sharp(srcJpg).rotate().resize(24, 24, { fit: "cover" }).blur(1.5).png().toBuffer();
  const blurDataURL = `data:image/png;base64,${tiny.toString("base64")}`;
  const stats = await sharp(srcJpg).rotate().stats();
  const [dom] = stats.dominant ? [stats.dominant] : [{ r: 255, g: 106, b: 19 }];
  const dominantColor = `#${[dom.r, dom.g, dom.b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;

  const hasCutout = existsSync(srcCutout);
  await writeMeta({ hasPhoto: true, hasCutout, width, height, blurDataURL, dominantColor });
  log(`Generated (hasCutout=${hasCutout}). dominantColor=${dominantColor}`);

  await makeOg(srcJpg);
  log("Wrote public/og.png.");
}

async function writeMeta(partial) {
  // No timestamp: the file is committed, so it must stay byte-stable across
  // runs or every build would dirty the working tree.
  mkdirSync(dirname(outMeta), { recursive: true });
  writeFileSync(outMeta, JSON.stringify(partial, null, 2) + "\n");
}

main().catch((err) => {
  console.error("[photo] FAILED:", err);
  // Never fail the build because of the photo pipeline.
  mkdirSync(dirname(outMeta), { recursive: true });
  writeFileSync(outMeta, JSON.stringify({ hasPhoto: false, hasCutout: false }, null, 2) + "\n");
  process.exit(0);
});
