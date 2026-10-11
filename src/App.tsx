import { Helmet } from "react-helmet-async";
import { META_DESCRIPTION, SITE_URL, profile } from "./data/profile";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: "AI Engineer",
  url: SITE_URL,
  email: `mailto:${profile.email}`,
  sameAs: [profile.linkedin, profile.github],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Madurai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "PPG Institute of Technology",
  },
  knowsAbout: [
    "Artificial Intelligence",
    "Machine Learning",
    "Multi-Agent Systems",
    "Large Language Models",
  ],
};

export default function App() {
  return (
    <>
      <Helmet>
        <html lang="en" />
        <title>Venugopal V | AI Engineer</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href={SITE_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={profile.name} />
        <meta property="og:title" content="Venugopal V | AI Engineer" />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={`${SITE_URL}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Venugopal V, AI engineer" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Venugopal V | AI Engineer" />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <meta name="twitter:image" content={`${SITE_URL}/og-image.png`} />

        <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
      </Helmet>

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Stats />
        <Projects />
        <Experience />
        <Skills />
        <About />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
