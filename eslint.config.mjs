import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const config = [
  {
    ignores: ["node_modules/**", "out/**", ".next/**", "scripts/**"],
  },
  ...coreWebVitals,
  ...typescript,
];

export default config;
