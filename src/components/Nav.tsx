import { useEffect, useState } from "react";
import { profile } from "../data/profile";
import Button from "./ui/Button";

const LINKS = [
  { label: "Projects", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "About", href: "#about" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  /* Close the mobile panel when the viewport grows past the 720px breakpoint. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 720px)");
    const onChange = () => {
      if (mq.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-page/85 backdrop-blur-md">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-4">
        <a
          href="#top"
          className="flex items-center gap-3 rounded-xl"
          onClick={() => setOpen(false)}
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-logo bg-accent-strong font-display text-base font-extrabold text-white"
          >
            VV
          </span>
          <span className="font-display text-2xl font-extrabold tracking-[-0.03em] text-ink">
            Venugopal
          </span>
        </a>

        <div className="flex items-center gap-2">
          <nav aria-label="Primary" className="hidden min-[720px]:block">
            <ul className="flex items-center gap-1">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center rounded-pill px-4 text-base font-medium text-muted transition-colors duration-200 hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Button href="#contact" variant="nav" className="px-6">
            Get in touch
          </Button>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-pill border border-outline bg-card text-ink min-[720px]:hidden"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="w-full min-[720px]:hidden"
        >
          <ul className="mb-1 flex flex-col gap-1 rounded-card border border-line bg-card p-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-[44px] items-center rounded-frame px-4 text-base font-medium text-ink hover:bg-page"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="px-4 py-2 font-mono text-[13px] text-muted">
              {profile.location}
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
