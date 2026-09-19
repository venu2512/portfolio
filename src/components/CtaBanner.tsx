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

export default function CtaBanner() {
  const toast = useToast();

  const onCopy = async () => {
    const ok = await copyEmail(profile.email);
    toast(ok ? "Email copied to clipboard" : "Copy failed — email is " + profile.email);
  };

  return (
    <section id="contact" className="wrap section">
      <Reveal>
        <div className="card overflow-hidden relative" style={{ background: "var(--primary)" }}>
          <div className="grid md:grid-cols-5 gap-6 items-center">
            <div className="md:col-span-3 p-8 md:p-12" style={{ color: "#fff" }}>
              <h2 className="h2">Let&apos;s build something intelligent.</h2>
              <p className="mt-4 text-white/85 max-w-md">{profile.openTo}.</p>
              {/* No phone JSX anywhere while the number is private (§3.3):
                  re-add only together with a `phone` field in data.ts. */}
              <div className="mt-8 flex flex-wrap gap-3">
                <Magnetic>
                  <button type="button" onClick={onCopy} className="btn bg-white !text-[#c2410c] hover:!bg-white/90">
                    Copy email
                  </button>
                </Magnetic>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">LinkedIn</a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">GitHub</a>
                <a href={profile.resumePdf} download className="btn btn-secondary">Download resume</a>
              </div>
            </div>
            <div className="md:col-span-2 pr-4 hidden md:block">
              <CtaSlot />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
