import type { Metadata, Viewport } from "next";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";
import { profile } from "../content/data";
import JsonLd from "../components/JsonLd";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venugopal.dev";
const description =
  "AI & Data Science student building multi-agent AI systems, ML solutions, and blockchain apps — open to internships in Data Science, AI, and Blockchain.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Venugopal V | AI/ML Engineer · Multi-Agent Systems · Data Science · Blockchain",
  description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: profile.name,
    title: "Venugopal V | AI/ML Engineer · Multi-Agent Systems · Data Science · Blockchain",
    description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Venugopal V | AI/ML Engineer · Multi-Agent Systems · Data Science · Blockchain",
    description,
    images: ["/og.png"],
  },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#05060d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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
