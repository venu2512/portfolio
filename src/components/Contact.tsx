import { profile } from "../data/profile";
import Button from "./ui/Button";
import Reveal from "./Reveal";

export default function Contact() {
  return (
    <section id="contact" className="pb-16 md:pb-24">
      <div className="container-x">
        <Reveal>
          <div
            className="rounded-block px-6 py-9 text-white md:px-14 md:py-[72px]"
            style={{ background: "var(--contact-gradient)" }}
          >
            <h2 className="max-w-[780px] text-contact-sm md:text-contact">
              Let&rsquo;s build something intelligent.
            </h2>
            <p className="mt-5 max-w-[620px] text-[17px] text-dark-text md:text-[19px]">
              Hiring for an AI, ML or full-stack role, or have a product idea? I would like
              to hear about it.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button
                href={`mailto:${profile.email}`}
                variant="primary"
                className="w-full sm:w-auto"
              >
                {profile.email}
              </Button>
              <div className="flex gap-3">
                <Button
                  href={profile.linkedin}
                  variant="glass"
                  className="flex-1 bg-white/[0.12] sm:flex-none"
                >
                  LinkedIn
                </Button>
                <Button
                  href={profile.github}
                  variant="glass"
                  className="flex-1 bg-white/[0.12] sm:flex-none"
                >
                  GitHub
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
