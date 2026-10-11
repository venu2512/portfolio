import { profile } from "../data/profile";
import Reveal from "./Reveal";

export default function About() {
  return (
    <section id="about" className="section-y">
      <div className="container-x grid gap-12 min-[900px]:grid-cols-2">
        <Reveal>
          <p className="label">About</p>
          <h2 className="mt-4 text-[32px] md:text-h3">{profile.about.heading}</h2>
          <p className="mt-6 max-w-[560px] text-lg text-muted">{profile.about.text}</p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex flex-col gap-5">
            {profile.education.map((entry) => (
              <div key={entry.what} className="card p-7 md:px-8">
                <p className="font-mono text-sm text-muted">{entry.when}</p>
                <h3 className="mt-2 text-[22px] md:text-2xl">{entry.what}</h3>
                <p className="mt-1 text-[17px] text-muted">{entry.where}</p>
              </div>
            ))}

            <div className="card p-7 md:px-8">
              <p className="label">Languages</p>
              <p className="mt-3 text-[17px] text-muted">{profile.languages}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
