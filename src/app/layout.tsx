import type { Metadata, Viewport } from "next";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { profile } from "../content/data";
import JsonLd from "../components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venugopal.dev";
// §10: openTo + summary, ~155 chars, no invented claims.
const description =
  "AI & Data Science student building multi-agent AI systems, ML solutions, and blockchain apps. Looking for full-time roles and internships in AI, ML, Data Analytics, and Full Stack.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Venugopal V | AI/ML Engineer · Data Science · Full Stack · Multi-Agent Systems",
  description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title: "Venugopal V | AI/ML Engineer · Data Science · Full Stack · Multi-Agent Systems",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Venugopal V | AI/ML Engineer · Data Science · Full Stack · Multi-Agent Systems",
    description,
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0e11" },
  ],
  width: "device-width",
  initialScale: 1,
};

// Runs before paint: light by default, persisted choice wins.
const themeScript = `(function(){try{var t=localStorage.getItem("venu-theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

// Adds .enhanced early so reveal states apply without flicker (no-JS never hides content).
const enhancedScript = `document.documentElement.classList.add("enhanced");`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: enhancedScript }} />
      </head>
      <body>
        <JsonLd />
        <a href="#hero" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
