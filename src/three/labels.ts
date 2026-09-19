"use client";

import * as THREE from "three";

const cache = new Map<string, THREE.CanvasTexture>();

interface LabelOpts {
  bg?: string;
  fg?: string;
  width?: number;
  height?: number;
}

/**
 * Renders text onto a rounded-rect CanvasTexture. Auto-shrinks to fit.
 * Call after document.fonts.ready for correct font metrics; cached by key.
 */
export function makeLabelTexture(text: string, opts: LabelOpts = {}): THREE.CanvasTexture {
  const key = `${text}|${opts.bg ?? "#fff"}|${opts.fg ?? "#16161a"}|${opts.width ?? 256}|${opts.height ?? 128}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const W = opts.width ?? 256;
  const H = opts.height ?? 128;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Rounded rect background
  const r = 28;
  ctx.fillStyle = opts.bg ?? "#ffffff";
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(W, 0, W, H, r);
  ctx.arcTo(W, H, 0, H, r);
  ctx.arcTo(0, H, 0, 0, r);
  ctx.arcTo(0, 0, W, 0, r);
  ctx.closePath();
  ctx.fill();

  // Auto-shrink text
  let size = 44;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  do {
    ctx.font = `600 ${size}px "Plus Jakarta Sans", sans-serif`;
    size -= 2;
  } while (ctx.measureText(text).width > W * 0.82 && size > 12);

  ctx.fillStyle = opts.fg ?? "#16161a";
  ctx.fillText(text, W / 2, H / 2 + 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cache.set(key, tex);
  return tex;
}

/** Rounded-rect alpha mask texture for the medallion photo plane. */
export function makeRoundedRectMask(radiusFraction = 0.12, size = 512): THREE.CanvasTexture {
  const key = `mask|${radiusFraction}|${size}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const r = size * radiusFraction;
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(size, 0, size, size, r);
  ctx.arcTo(size, size, 0, size, r);
  ctx.arcTo(0, size, 0, 0, r);
  ctx.arcTo(0, 0, size, 0, r);
  ctx.closePath();
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  cache.set(key, tex);
  return tex;
}

/** Cover-fit crop with face focus. focus: {x, y} in 0..1, y=0 is top. */
export function coverFit(
  tex: THREE.Texture & { image: { width: number; height: number } },
  planeAspect: number,
  focus: { x: number; y: number }
): void {
  const imgAspect = tex.image.width / tex.image.height;
  if (imgAspect > planeAspect) {
    tex.repeat.set(planeAspect / imgAspect, 1);
    tex.offset.set((1 - tex.repeat.x) * focus.x, 0);
  } else {
    tex.repeat.set(1, imgAspect / planeAspect);
    tex.offset.set(0, (1 - tex.repeat.y) * (1 - focus.y)); // UV y origin is bottom
  }
}
