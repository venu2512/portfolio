import { profile } from "../data/profile";
import { resolveColor } from "../lib/ui";
import Button from "./ui/Button";
import Pill from "./ui/Pill";

/**
 * PLACEHOLDER - profile photo.
 * Drop a file named `photo.jpg` (or .jpeg/.png/.webp) into `public/` and it is
 * picked up here at build time. Until then the arch frame shows the
 * `[ YOUR PHOTO ]` label and the page never requests a missing file.
 */
const PHOTO_PATHS = Object.keys(
  import.meta.glob("/public/photo.{jpg,jpeg,png,webp}"),
);
const PHOTO_SRC = PHOTO_PATHS.length
  ? PHOTO_PATHS[0].replace(/^\/public/, "")
  : null;

const AGENT_POSITION = [
  { classes: "top-[90px] left-[-18px] md:left-[-28px]", hiddenOnMobile: false },
  { classes: "top-[200px] right-[-28px]", hiddenOnMobile: true },
  { classes: "top-[300px] md:top-[330px] left-[-14px] md:left-[-24px]", hiddenOnMobile: false },
  { classes: "top-[450px] right-[-28px]", hiddenOnMobile: true },
];

function PhotoSlot() {
  if (PHOTO_SRC) {
    return (
      <img
        src={PHOTO_SRC}
        width={400}
        height={580}
        alt="Portrait of Venugopal V"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full items-end justify-center pb-6">
      <span className="rounded-pill bg-white/70 px-4 py-2 font-mono text-[13px] font-medium uppercase tracking-[0.12em] text-ink">
        [ YOUR PHOTO ]
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="pt-10 md:pt-16">
      <div className="container-x grid items-center gap-14 min-[900px]:grid-cols-[1.05fr_0.95fr]">
        {/* Left: the message */}
        <div>
          <Pill dot="#1F9D55">{profile.status}</Pill>

          <h1 className="mt-6 text-hero-sm sm:text-[58px] md:text-hero">
            {profile.headline}
          </h1>

          <p className="mt-6 max-w-[540px] text-[17px] text-muted sm:text-xl">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#work" variant="primary" className="w-full sm:w-auto">
              View projects
            </Button>
            <Button
              href="/resume.pdf"
              variant="secondary"
              download
              className="w-full sm:w-auto"
            >
              Download resume
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted">
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded transition-colors hover:text-ink"
            >
              github.com/venu2512
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded transition-colors hover:text-ink"
            >
              linkedin.com/in/venugopal-v
            </a>
          </div>
        </div>

        {/* Right: arch frame + floating agent cards */}
        <div className="relative mx-auto w-full max-w-[400px]">
          <div
            className="relative h-[400px] w-full overflow-hidden md:h-[580px]"
            style={{
              borderRadius: "230px 230px 36px 36px",
              background: "var(--hero-frame-gradient)",
            }}
          >
            <PhotoSlot />
          </div>

          <div aria-hidden="true">
            {profile.floatingAgents.map((agent, index) => {
              const position = AGENT_POSITION[index] ?? AGENT_POSITION[0];
              return (
                <div
                  key={agent.name}
                  className={`absolute ${position.classes} ${
                    position.hiddenOnMobile ? "hidden md:block" : "block"
                  }`}
                >
                  <div className="agent-float" style={{ animationDelay: `${index * 1.1}s` }}>
                    <div
                      className="flex items-center gap-2.5 whitespace-nowrap rounded-frame bg-card px-[18px] py-[14px] text-[15px] font-semibold text-ink shadow-float"
                      style={{ transform: `rotate(${agent.rotate}deg)` }}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: resolveColor(agent.dot) }}
                      />
                      {agent.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
