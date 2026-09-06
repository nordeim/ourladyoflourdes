import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SkipLink } from "@/components/SkipLink";
import { BackToTop } from "@/components/BackToTop";
import { ScrollProgress } from "@/components/ScrollProgress";

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const resolveAnchor = () => {
      // Handle both single-hash (#/path) and double-hash (#/path#anchor) forms
      const raw = window.location.hash;
      const parts = raw.split("#").filter(Boolean);
      const anchor = parts.length > 1 ? parts[parts.length - 1] : null;
      if (anchor) {
        const el = document.getElementById(anchor);
        if (el) {
          const timer = setTimeout(() => {
            el.scrollIntoView({ behavior: "auto" });
          }, 80);
          return () => clearTimeout(timer);
        }
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    // resolveAnchor returns the clearTimeout cleanup for a pending anchor
    // scroll — returning it cancels a stale scroll if the route changes
    // inside the 80ms window (round-16 audit L1).
    return resolveAnchor();
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <ScrollProgress />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none"
      >
        <div
          key={pathname}
          data-testid="page-container"
          data-route={pathname}
          className="page-in"
        >
          <Outlet />
        </div>
      </main>
      <BackToTop />
      <Footer />
    </div>
  );
}
