import { profile, skills, education } from "../content/data";
import photoMeta from "../content/photo-meta.json";

export default function JsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://venugopal.dev";
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: siteUrl,
    ...(photoMeta.hasPhoto ? { image: `${siteUrl}/profile/generated/profile-960.jpg` } : {}),
    sameAs: [profile.linkedin, profile.github],
    alumniOf: education.map((e) => e.school),
    knowsAbout: skills.flatMap((s) => s.items),
    knowsLanguage: profile.languages.map((l) => l.name),
    // phone intentionally omitted (showPhone: false)
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}
