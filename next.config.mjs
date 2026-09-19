/** @type {import('next').NextConfig} */
const isGhPages = process.env.GH_PAGES === "true";
const repoName = process.env.GH_PAGES_REPO || "<repo-name>";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  poweredByHeader: false,
  turbopack: { root: import.meta.dirname },
  // Belt-and-braces: keep 3D libraries out of any server bundle path.
  // (The dynamic import is already ssr:false; this guarantees it.)
  serverExternalPackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
    "maath",
    "postprocessing",
  ],
  ...(isGhPages
    ? { basePath: `/${repoName}`, assetPrefix: `/${repoName}/` }
    : {}),
};

export default nextConfig;
