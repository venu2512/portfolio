// Module-scope mirror of the skills filter, set by the DOM SkillsSlot and read
// by the 3D KeycapCloud (avoids importing the component from the scene tree).
// The DOM side sets .current AND notifies; the canvas side subscribes instead
// of polling (§8.3).

type Listener = (filter: string) => void;

export const skillsFilterRef = { current: "all" };

const listeners = new Set<Listener>();

export function setSkillsFilter(filter: string): void {
  skillsFilterRef.current = filter;
  listeners.forEach((l) => l(filter));
}

export function onSkillsFilterChange(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
