import { profile, type ProjectCard } from "../data/profile";
import Button from "./ui/Button";
import Card from "./ui/Card";
import Reveal from "./Reveal";

const AGENT_CHIPS = Array.from({ length: 8 }, (_, index) => `Agent ${index + 1}`);

export default function Projects() {
  const { featuredProject, projects } = profile;

  return (
    <section id="work" className="section-y">
      <div className="container-x">
        <Reveal>
          <p className="label">Selected work</p>
          <h2 className="mt-4 max-w-[720px] text-h2-sm md:text-h2">
            Systems I have designed, built and shipped.
          </h2>
        </Reveal>

        {/* Featured project - dark card with the agent chip panel */}
        <Reveal className="mt-12">
          <article className="overflow-hidden rounded-card-xl bg-dark text-white min-[900px]:grid min-[900px]:grid-cols-[1.1fr_1fr]">
            <div className="p-7 md:p-12">
              <p className="font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-dark-eyebrow">
                {featuredProject.eyebrow}
              </p>
              <h3 className="mt-4 text-[28px] md:text-project-title">
                {featuredProject.title}
              </h3>
              <p className="mt-4 max-w-[520px] text-[17px] text-dark-text md:text-lg">
                {featuredProject.text}
              </p>

              <ul className="mt-6 hidden flex-wrap gap-2 min-[900px]:flex">
                {featuredProject.stack.map((item) => (
                  <li
                    key={item}
                    className="rounded-pill bg-dark-soft px-4 py-2 text-sm font-medium text-white"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 font-mono text-[13px] text-dark-text min-[900px]:hidden">
                {featuredProject.stack.join(" · ")}
              </p>

              <div className="mt-8">
                <Button
                  href={featuredProject.cta.href}
                  variant="invert"
                  className="w-full sm:w-auto"
                >
                  {featuredProject.cta.label}
                </Button>
              </div>
            </div>

            <div
              aria-hidden="true"
              className="hidden min-h-[340px] items-center justify-center p-10 min-[900px]:flex"
              style={{ background: "var(--feature-panel-gradient)" }}
            >
              <ul className="flex flex-wrap items-center justify-center gap-3">
                {AGENT_CHIPS.map((chip, index) => (
                  <li
                    key={chip}
                    className="rounded-frame px-4 py-2.5 text-[15px] font-semibold text-white"
                    style={{
                      background:
                        index % 2 === 0
                          ? "rgba(255,255,255,.18)"
                          : "rgba(255,255,255,.28)",
                    }}
                  >
                    {chip}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </Reveal>

        {/* Three supporting project cards */}
        <ul className="mt-6 flex flex-wrap gap-6">
          {projects.map((project: ProjectCard, index) => (
            <Reveal
              key={project.title}
              as="li"
              delay={index * 0.08}
              className="flex-1 basis-[340px]"
            >
              <Card interactive className="flex h-full flex-col rounded-card-lg p-6 md:p-9">
                <div
                  aria-hidden="true"
                  className="h-[90px] w-full rounded-banner md:h-[140px]"
                  style={{ background: project.gradient }}
                />
                <h3 className="mt-6 text-[26px] md:text-[28px]">{project.title}</h3>
                <p className="mt-3 text-[17px] text-muted">{project.text}</p>
                <p className="mt-6 font-mono text-[13px] text-violet md:mt-auto md:pt-6">
                  {project.stack}
                </p>
                {project.href ? (
                  <div className="mt-5">
                    <Button href={project.href} variant="secondary">
                      View project
                    </Button>
                  </div>
                ) : null}
              </Card>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
