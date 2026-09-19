// Pure data — imported by eager components (Nav, KeyboardNav, StoreBootstrap),
// so it must NOT import three.js. Curve building lives in scene/rail.ts.

export interface Waypoint {
  id: string; // section anchor id
  navLabel: string; // nav + aria label
  camPos: [number, number, number];
  lookAt: [number, number, number];
  /** Station world position (where set pieces sit). */
  station: [number, number, number];
}

// S-curve on X/Z, ~18-24 units between stations. Stations sit BEHIND the
// camera rail (rail Z > station Z) so the camera looks back at each station.
// Portrait mobile: the whole rig is pulled back +2 Z at runtime.
export const waypoints: Waypoint[] = [
  { id: "hero",       navLabel: "Start",       camPos: [0, 2.2, 34],   lookAt: [0, 1.5, 0],    station: [0, 0, 0] },
  { id: "about",      navLabel: "About",      camPos: [7, 2.8, 13.5], lookAt: [-1, 1.2, -6],  station: [-1, 0, -6] },
  { id: "exp-kreupai", navLabel: "KreupAI",    camPos: [12, 2.6, -7],  lookAt: [1, 2.2, -25],  station: [1, 0, -25] },
  { id: "exp-quadedutor", navLabel: "QuadEdutor", camPos: [8, 2.4, -27], lookAt: [-2, 1.5, -45], station: [-2, 0, -45] },
  { id: "exp-nitroware", navLabel: "Nitroware",  camPos: [-3, 2.8, -46.5], lookAt: [-3, 2, -66], station: [-3, 0, -66] },
  { id: "skills",     navLabel: "Skills",     camPos: [-12, 3.0, -66], lookAt: [-3, 1.8, -85], station: [-3, 0, -85] },
  { id: "projects",   navLabel: "Projects",   camPos: [-13, 2.6, -86], lookAt: [-2, 1.5, -105], station: [-2, 0, -105] },
  { id: "education",  navLabel: "Education",  camPos: [-8, 3.2, -106], lookAt: [0, 1.6, -124], station: [0, 0, -124] },
  { id: "contact",    navLabel: "Contact",    camPos: [0, 2.4, -124], lookAt: [0, 1.6, -144], station: [0, 0, -144] },
];

export const CAM_Z_OFFSET_PORTRAIT = 2;
