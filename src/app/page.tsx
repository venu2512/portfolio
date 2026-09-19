import ToastProvider from "../components/Toast";
import Boot from "../components/Boot";
import Intro from "../components/Intro";
import ScrollProgress from "../components/ScrollProgress";
import Cursor from "../components/Cursor";
import AnnouncementBar from "../components/AnnouncementBar";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import TechMarquee from "../components/TechMarquee";
import StatsStrip from "../components/StatsStrip";
import About from "../components/About";
import Experience from "../components/Experience";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Education from "../components/Education";
import Faq from "../components/Faq";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <ToastProvider>
      <noscript>
        <div style={{ padding: "0.75rem 1.25rem", textAlign: "center", background: "var(--surface-2)" }}>
          JavaScript is disabled — all content is still readable, but animations, the 3D views and
          smooth scrolling are off.
        </div>
      </noscript>
      <Boot />
      <Intro />
      <ScrollProgress />
      <Cursor />
      {/* #app-root wraps the page so the fixed 3D canvas can use it as its
          event source: pointer coordinates map to real page geometry, and
          hover/click reach the 3D objects inside the view slots. */}
      <div id="app-root">
        <AnnouncementBar />
        <Navbar />
        <main>
          <Hero />
          <TechMarquee />
          <StatsStrip />
          <About />
          <Experience />
          <Skills />
          <Projects />
          <Education />
          <Faq />
          <CtaBanner />
        </main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
