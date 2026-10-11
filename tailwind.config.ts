import type { Config } from "tailwindcss";

/**
 * Design tokens for the Venugopal V portfolio.
 * The single tweakable knob is the accent colour: it lives as a CSS variable
 * in `src/styles/tokens.css` and is referenced here as `var(--accent)`.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#F5F5F7",
        card: "#FFFFFF",
        line: "#E4E4EA",
        ink: "#14141A",
        muted: "#4A4A57",
        outline: "#D5D5DE",
        accent: "var(--accent)",
        "accent-strong": "var(--accent-strong)",
        violet: "#5B3DF0",
        blue: "#0B7BD6",
        green: "#1F7A45",
        "green-dot": "#1F9D55",
        dark: "#14141A",
        "dark-soft": "#2A2A33",
        "dark-text": "#C9C9D4",
        "dark-eyebrow": "#FFB48F",
        /* Skill chip pairs */
        "tone-violet-bg": "#EFEBFF",
        "tone-violet-text": "#3A22B8",
        "tone-orange-bg": "#FFE9DE",
        "tone-orange-text": "#9C3208",
        "tone-blue-bg": "#DFF1FF",
        "tone-blue-text": "#075A9C",
        "tone-green-bg": "#DDF3E6",
        "tone-green-text": "#14653A",
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "ui-sans-serif", "system-ui", "sans-serif"],
        body: ['"Hanken Grotesk"', "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        hero: ["76px", { lineHeight: "1.0", letterSpacing: "-0.035em", fontWeight: "800" }],
        "hero-sm": ["46px", { lineHeight: "1.03", letterSpacing: "-0.03em", fontWeight: "800" }],
        h2: ["52px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "h2-sm": ["32px", { lineHeight: "1.1", letterSpacing: "-0.025em", fontWeight: "800" }],
        h3: ["44px", { lineHeight: "1.08", letterSpacing: "-0.03em", fontWeight: "800" }],
        "h3-sm": ["30px", { lineHeight: "1.12", letterSpacing: "-0.025em", fontWeight: "800" }],
        contact: ["64px", { lineHeight: "1.0", letterSpacing: "-0.035em", fontWeight: "800" }],
        "contact-sm": ["36px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        "project-title": ["40px", { lineHeight: "1.05", letterSpacing: "-0.03em", fontWeight: "800" }],
        stat: ["56px", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "800" }],
        /* Mobile stat number */
        "stat-sm": ["40px", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "800" }],
      },
      borderRadius: {
        pill: "999px",
        card: "24px",
        "card-lg": "28px",
        "card-xl": "32px",
        block: "36px",
        frame: "18px",
        logo: "12px",
        banner: "20px",
      },
      maxWidth: {
        content: "1200px",
      },
      boxShadow: {
        float: "0 18px 40px rgba(40,30,80,.16)",
        lift: "0 18px 40px rgba(20,20,26,.08)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
