// Active-experience plumbing: the DOM slot's IntersectionObserver publishes
// the active card index; the canvas ExperienceStage subscribes. Kept free of
// any three.js imports so the DOM bundle never pulls the 3D chunk.
type Listener = (i: number) => void;
const listeners = new Set<Listener>();
let current = 0;

export function setActiveExperience(i: number): void {
  current = i;
  listeners.forEach((l) => l(i));
}

export function getActiveExperience(): number {
  return current;
}

export function onActiveExperience(cb: Listener): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
