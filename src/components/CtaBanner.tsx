"use client";

import { profile } from "../content/data";
import Magnetic from "./Magnetic";
import Reveal from "./Reveal";
import { useToast } from "./Toast";
import CtaSlot from "./three/CtaSlot";

async function copyEmail(email: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(email);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = email;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * The page's single loud moment (teardown §2 row 4 "Get started": the loudest
 * ground, the largest heading, one primary action). Full-bleed accent band —
 * the only orange ground on the page, so it stays the only one.
 */
export default function CtaBanner() {
  const toast = useToast();

  const onCopy = async () => {
    const ok = await copyEmail(profile.email);
    toast(ok ? "Email copied to clipboard" : "Copy failed — email is " + profile.email);
  };

  return (
    <section id="contact" className="band band-primary" aria-labelledby="contact-heading">
      <div className="wrap">
        <Reveal className="grid md:grid-cols-5 gap-8 items-center">
          <div className="md:col-span-3">
            <p className="mono-label">Contact</p>
            <h2 id="contact-heading" className="h2 mt-2">
              Let&apos;s build something{" "}
              <em className="accent" style={{ color: "inherit" }}>
                intelligent
              </em>
              .
            </h2>
            <p className="section-lead mt-3">{profile.openTo}.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <button
                  type="button"
                  onClick={onCopy}
                  className="btn bg-white !text-[#c2410c] hover:!bg-white/90"
                >
                  Copy email
                </button>
              </Magnetic>
              {profile.showPhone && profile.phone ? (
                <a href={`tel:${profile.phone}`} className="btn btn-secondary">
                  {profile.phone}
                </a>
              ) : null}
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                LinkedIn
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                GitHub
              </a>
              <a href={profile.resumePdf} download className="btn btn-secondary">
                Download resume
              </a>
            </div>
            <p className="mono-label mt-6">
              {profile.location} · {profile.languages.map((l) => l.name).join(" · ")}
            </p>
          </div>
          <div className="md:col-span-2 hidden md:block">
            <CtaSlot />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
