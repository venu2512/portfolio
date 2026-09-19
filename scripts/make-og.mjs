// Generates public/og.png (1200x630) with zero external deps.
// Deterministic compressed-IDAT PNG writer (zlib stored blocks + crc32).
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";

const W = 1200;
const H = 630;

// --- helpers -------------------------------------------------------------
const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

// --- image: soft nebula + particle constellation + big name --------------
const px = Buffer.alloc(W * H * 3);
function setPx(x, y, r, g, b) {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = Math.min(255, px[i] + r) | 0;
  px[i + 1] = Math.min(255, px[i + 1] + g) | 0;
  px[i + 2] = Math.min(255, px[i + 2] + b) | 0;
}
function glow(cx, cy, radius, cr, cg, cb, intensity) {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(W - 1, Math.ceil(cx + radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const y1 = Math.min(H - 1, Math.ceil(cy + radius));
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const f = Math.max(0, 1 - d / radius);
      const v = f * f * intensity;
      setPx(x, y, cr * v, cg * v, cb * v);
    }
  }
}
function line(x0, y0, x1, y1, cr, cg, cb) {
  const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0));
  for (let s = 0; s <= steps; s++) {
    const x = Math.round(x0 + ((x1 - x0) * s) / steps);
    const y = Math.round(y0 + ((y1 - y0) * s) / steps);
    setPx(x, y, cr, cg, cb);
  }
}

// base
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3;
    px[i] = 5;
    px[i + 1] = 6;
    px[i + 2] = 13;
  }
}
// nebula glows
glow(900, 60, 500, 139, 92, 246, 0.5);
glow(100, 600, 460, 34, 211, 238, 0.4);
glow(600, 315, 300, 34, 211, 238, 0.12);

// constellation field
let seed = 7;
const rnd = () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};
const stars = Array.from({ length: 90 }, () => [rnd() * W, rnd() * H]);
stars.forEach(([x, y], i) => {
  glow(x, y, 3 + rnd() * 5, 103, 232, 249, 0.8);
  const [nx, ny] = stars[(i + 1) % stars.length] ?? [x, y];
  if (Math.hypot(nx - x, ny - y) < 160) line(x, y, nx, ny, 40, 46, 90);
});

// "V" monogram
const vpts = [];
for (let t = 0; t <= 1; t += 0.002) {
  const x = 600 + (t - 0.5) * 260;
  const y = 180 + Math.abs(t - 0.5) * 2 * 180;
  vpts.push([x, y]);
}
vpts.forEach(([x, y]) => glow(x, y, 5, 103, 232, 249, 1.4));

// name bar
glow(600, 520, 220, 139, 92, 246, 0.25);

// --- encode --------------------------------------------------------------
const raw = Buffer.alloc((W * 3 + 1) * H);
for (let y = 0; y < H; y++) {
  raw[y * (W * 3 + 1)] = 0; // filter: none
  px.copy(raw, y * (W * 3 + 1) + 1, y * W * 3, (y + 1) * W * 3);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type: truecolor
const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

mkdirSync("public", { recursive: true });
writeFileSync("public/og.png", png);
console.log(`public/og.png written (${png.length} bytes)`);
