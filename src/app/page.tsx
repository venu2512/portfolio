import Nav from "../components/Nav";
import Section from "../components/Section";
import HudCard from "../components/HudCard";
import DetailDrawer from "../components/DetailDrawer";
import SceneLoader from "../components/SceneLoader";
import KeyboardNav from "../components/KeyboardNav";
import StoreBootstrap from "../components/StoreBootstrap";
import HeroInner from "../components/HeroInner";
import ExpChip from "../components/ExpChip";
import ProjChip from "../components/ProjChip";
import {
  profile,
  experience,
  projects,
  skills,
  education,
} from "../content/data";

export default function Page() {
  const name = profile.name;

  return (
    <>
      <div className="simple-bg" aria-hidden="true" />
      <SceneLoader />
      <Nav />
      <StoreBootstrap />
      <KeyboardNav />

      <main id="main">
        {/* ---------------- HERO ---------------- */}
        <Section id="hero" index={0} label="Portfolio" title={`${name} — ${profile.role}`}>
          <HeroInner />
        </Section>

        {/* ---------------- ABOUT ---------------- */}
        <Section id="about" index={1} label="About" title="Summary & Languages">
          <HudCard>
            <p className="text-sm md:text-base leading-relaxed text-[#c9d4f0]">
              {profile.summary}
            </p>
            <p className="mono-label mt-4 mb-2">Languages</p>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((l) => (
                <span key={l.name} className="chip chip-cyan">
                  {l.name} · {l.level}
                </span>
              ))}
            </div>
            <p className="mono-label mt-4">Location</p>
            <p className="text-sm text-[#c9d4f0]">{profile.location}</p>
          </HudCard>
        </Section>

        {/* ---------------- EXPERIENCE ---------------- */}
        <Section
          id="exp-kreupai"
          index={2}
          label="Experience · 01"
          title="AI/ML Engineer Intern at KreupAI Technologies"
        >
          <HudCard>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="chip chip-amber">May 2026 – Present</span>
              <span className="chip chip-amber">Current</span>
            </div>
            <Bullets items={experience[0]?.bullets ?? []} />
            <p className="mono-label mt-4 mb-2">Tools & agents</p>
            <div className="flex flex-wrap gap-2">
              {(experience[0]?.tools ?? []).map((t) => (
                <ExpChip key={t} kind="experience" id="kreupai" label={t} />
              ))}
            </div>
          </HudCard>
        </Section>

        <Section
          id="exp-quadedutor"
          index={3}
          label="Experience · 02"
          title="Data Science Intern at QuadEdutor Pvt. Ltd."
        >
          <HudCard>
            <Bullets items={experience[1]?.bullets ?? []} />
          </HudCard>
        </Section>

        <Section
          id="exp-nitroware"
          index={4}
          label="Experience · 03"
          title="AI & ML Intern at Nitroware Technologies"
        >
          <HudCard>
            <Bullets items={experience[2]?.bullets ?? []} />
          </HudCard>
        </Section>

        {/* ---------------- SKILLS ---------------- */}
        <Section id="skills" index={5} label="Skills" title="Technical Skills">
          <HudCard>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-4">
              {skills.map((s) => (
                <div key={s.id}>
                  <p className="mono-label mb-1">{s.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.items.map((item) => (
                      <span key={item} className="chip">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </HudCard>
        </Section>

        {/* ---------------- PROJECTS ---------------- */}
        <Section id="projects" index={6} label="Projects" title="Selected Projects">
          <HudCard>
            <div className="grid gap-5">
              {projects.map((p) => (
                <article key={p.id}>
                  <h3 className="font-semibold text-[#e6ecff]">
                    {p.name}{" "}
                    <span className="text-sm font-normal text-[#9aa7c7]">— {p.subtitle}</span>
                  </h3>
                  <Bullets items={p.bullets} compact />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.stack.map((s) => (
                      <span key={s} className="chip chip-cyan">
                        {s}
                      </span>
                    ))}
                    <ProjChip kind="project" id={p.id} label="Details" />
                  </div>
                </article>
              ))}
            </div>
          </HudCard>
        </Section>

        {/* ---------------- EDUCATION ---------------- */}
        <Section id="education" index={7} label="Education" title="Education">
          <HudCard>
            <div className="grid gap-4">
              {education.map((e) => (
                <div key={e.id}>
                  <h3 className="font-semibold text-[#e6ecff]">{e.school}</h3>
                  <p className="text-sm text-[#c9d4f0]">{e.credential}</p>
                  <p className="mono-label mt-1">{e.period}</p>
                </div>
              ))}
            </div>
          </HudCard>
        </Section>

        {/* ---------------- CONTACT ---------------- */}
        <Section id="contact" index={8} label="Contact" title="Get in Touch">
          <HudCard>
            <p className="text-sm text-[#c9d4f0]">Open to: {profile.openTo}</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a className="btn" href={`mailto:${profile.email}`}>
                Email
              </a>
              <a
                className="btn btn-violet"
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                className="btn btn-violet"
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <a className="btn" href={profile.resumePdf} download>
                Download Resume (PDF)
              </a>
            </div>
            <p className="mono-label mt-6">{profile.location}</p>
            {/* phone intentionally not rendered while showPhone is false */}
          </HudCard>
        </Section>
      </main>

      <DetailDrawer />
      <footer className="relative z-[1] px-6 py-10 text-center">
        <p className="mono-label">
          {profile.name} · {profile.location} · Open to: {profile.openTo}
        </p>
      </footer>
    </>
  );
}

function Bullets({ items, compact = false }: { items: string[]; compact?: boolean }) {
  return (
    <ul className={`space-y-2 text-sm leading-relaxed text-[#c9d4f0] ${compact ? "mt-2" : "mt-4"}`}>
      {items.map((b, i) => (
        <li key={i} className="flex gap-2">
          <span aria-hidden="true" style={{ color: "#22d3ee" }}>
            ▸
          </span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
