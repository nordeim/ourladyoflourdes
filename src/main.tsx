import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// Pre-mount path-style deep-link redirect for static hosts
const { pathname, hash, search } = window.location;
if (pathname !== "/" && !hash.startsWith("#/")) {
  import("@/utils/deepLinks").then(({ resolveHashRedirect }) => {
    const redirect = resolveHashRedirect(pathname, hash);
    if (redirect) {
      window.location.replace(redirect + search);
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
