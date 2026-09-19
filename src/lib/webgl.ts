export function webglSupported(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return (
      !!(window.WebGL2RenderingContext && c.getContext("webgl2")) ||
      !!(c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
