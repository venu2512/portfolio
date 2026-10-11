import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import "./styles/index.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container #root was not found.");
}

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
