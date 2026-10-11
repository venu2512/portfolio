import { profile, type SkillGroup } from "../data/profile";
import Card from "./ui/Card";
import Reveal from "./Reveal";

const TONE: Record<SkillGroup["tone"], string> = {
  violet: "bg-tone-violet-bg text-tone-violet-text",
  orange: "bg-tone-orange-bg text-tone-orange-text",
  blue: "bg-tone-blue-bg text-tone-blue-text",
  green: "bg-tone-green-bg text-tone-green-text",
};

function ChipList({ tone, items }: { tone: SkillGroup["tone"]; items: readonly string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className={`rounded-pill px-[14px] py-[6px] text-sm font-medium ${TONE[tone]}`}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="section-y">
      <div className="container-x">
        <Reveal>
          <p className="label">Toolkit</p>
          <h2 className="mt-4 max-w-[720px] text-h2-sm md:text-h2">What I build with.</h2>
        </Reveal>

        <ul className="mt-12 flex flex-wrap gap-5">
          {profile.skills.map((skill, index) => (
            <Reveal
              key={skill.group}
              as="li"
              delay={index * 0.06}
              className="flex-1 basis-[340px]"
            >
              <Card className="h-full p-7 md:p-8">
                <h3 className="text-[20px] md:text-[22px]">{skill.group}</h3>
                <div className="mt-5">
                  <ChipList tone={skill.tone} items={skill.items} />
                </div>

                {skill.extra ? (
                  <div className="mt-7">
                    <h3 className="text-[20px] md:text-[22px]">{skill.extra.group}</h3>
                    <div className="mt-5">
                      <ChipList tone={skill.tone} items={skill.extra.items} />
                    </div>
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
