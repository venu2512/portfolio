"use client";

import photoMeta from "../content/photo-meta.json";
import { profile } from "../content/data";

interface PhotoMeta {
  hasPhoto: boolean;
  hasCutout?: boolean;
  width?: number;
  height?: number;
  blurDataURL?: string;
  dominantColor?: string;
}

const meta = photoMeta as PhotoMeta;

const SIZES = [480, 960, 1440];

function srcset(base: string, ext: string): string {
  return SIZES.map((w) => `${base}-${w}.${ext} ${w}w`).join(", ");
}

interface PhotoProps {
  className?: string;
  priority?: boolean; // hero: fetchpriority high, no lazy
  rounded?: string; // tailwind border-radius class override
  monogramSize?: string; // font size for fallback
}

/**
 * Renders the profile photo from generated sizes, or a monogram badge when
 * no photo exists. Never upscales; uses explicit dimensions to avoid CLS.
 */
export default function Photo({
  className = "",
  priority = false,
  rounded = "rounded-[28px]",
  monogramSize = "text-5xl",
}: PhotoProps) {
  if (!meta.hasPhoto) {
    return (
      <div
        aria-label={profile.photo.alt}
        role="img"
        className={`flex items-center justify-center rounded-full ${rounded.includes("full") ? "" : "aspect-square"} ${className}`}
        style={{
          background: "linear-gradient(135deg, var(--primary), #ff9a4d)",
          color: "#fff",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <span className={`font-extrabold ${monogramSize}`} style={{ letterSpacing: "-0.04em" }}>
          {profile.monogram}
        </span>
      </div>
    );
  }

  const w = meta.width ?? 960;
  const h = meta.height ?? 1200;
  const base = "/profile/generated/profile";
  const style: React.CSSProperties = {
    objectPosition: `${profile.photo.focus.x * 100}% ${profile.photo.focus.y * 100}%`,
  };
  if (meta.blurDataURL) style.backgroundImage = `url(${meta.blurDataURL})`;
  style.backgroundSize = "cover";
  style.backgroundPosition = "center";

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={srcset(base, "avif")} sizes="(max-width: 768px) 90vw, 480px" />
      <source type="image/webp" srcSet={srcset(base, "webp")} sizes="(max-width: 768px) 90vw, 480px" />
      <img
        src={`${base}-960.jpg`}
        srcSet={srcset(base, "jpg")}
        sizes="(max-width: 768px) 90vw, 480px"
        alt={profile.photo.alt}
        width={w}
        height={h}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={`object-cover ${rounded}`}
        style={style}
      />
    </picture>
  );
}
