import { profile } from "../data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-x flex flex-col gap-1 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {profile.name}</p>
        <p>{profile.location}</p>
      </div>
    </footer>
  );
}
