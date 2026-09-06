import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useScrolled } from "@/hooks/useScrolled";
import { primaryNav } from "@/data/nav";
import { site } from "@/data/site";
import { Menu, X, ChevronDown } from "lucide-react";

export function Header() {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";
  const scrolled = useScrolled(16);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerWasOpenRef = useRef(false);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const solid = scrolled || !isHome || mobileOpen;

  useEffect(() => {
    setMobileOpen(false);
    setDesktopOpen(null);
  }, [pathname, hash]);

  useEffect(() => {
    if (mobileOpen) {
      drawerWasOpenRef.current = true;
      document.body.style.overflow = "hidden";
      setTimeout(() => drawerRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      if (drawerWasOpenRef.current) {
        hamburgerRef.current?.focus();
        drawerWasOpenRef.current = false;
      }
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleDrawerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setDesktopOpen(null);
        return;
      }
      if (e.key !== "Tab") return;
      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = drawer.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    []
  );

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      // Ignore the toggle itself (round-18 audit F2): pointerdown would close
      // the drawer and the button's click would toggle it straight back open,
      // leaving the menu stuck open.
      if (hamburgerRef.current?.contains(target)) return;
      if (mobileOpen && drawerRef.current && !drawerRef.current.contains(target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [mobileOpen]);

  // Escape dismisses an open desktop dropdown from anywhere on the page
  // (round-16 audit L3 — the drawer has its own Escape handling in
  // handleDrawerKeyDown; this covers the keyboard-focus-open menu).
  useEffect(() => {
    if (!desktopOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDesktopOpen(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [desktopOpen]);

  // Escape closes the mobile drawer from anywhere on the page. The drawer's
  // own handleDrawerKeyDown only fires once the drawer has self-focused (a
  // 50 ms setTimeout after open), so a user (or E2E runner) pressing Escape
  // immediately after opening was ignored — remediation E2E navigation spec
  // surfaced this gap; this window-level listener mirrors the desktopOpen
  // contract above.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        setDesktopOpen(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const isActive = (to: string) => {
    if (to.includes("#")) {
      const [path, fragment] = to.split("#");
      return pathname === path && hash === `#${fragment}`;
    }
    return pathname === to;
  };

  const isParentActive = (item: (typeof primaryNav)[number]) => {
    if (!item.children) return pathname === item.to;
    return item.children.some((c) => c.to.split("#")[0] === pathname);
  };

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-50 transition-colors duration-300",
          solid
            ? "bg-oll-blue-950/92 backdrop-blur-md"
            : "bg-transparent"
        )}
      >
      {/* Top bar */}
      <div
        className={cn(
          "hidden border-b border-oll-cream/10 lg:block",
          solid ? "border-oll-cream/10" : "border-transparent"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-2 text-xs text-oll-cream/70">
          <span>
            {site.address.street} · {site.feast.name}
          </span>
          <Link
            to="/give"
            className="link-underline text-oll-gold-300 hover:text-oll-gold-200"
          >
            Give
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <Link
          to="/"
          className="font-display text-lg font-semibold text-oll-cream"
        >
          {site.shortName}
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            if (item.children) {
              const active = isParentActive(item);
              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDesktopOpen(item.label)}
                  onMouseLeave={() => setDesktopOpen(null)}
                  onFocusCapture={() => setDesktopOpen(item.label)}
                  onBlurCapture={(event) => {
                    const next = event.relatedTarget as HTMLElement | null;
                    if (next && event.currentTarget.contains(next)) return;
                    setDesktopOpen(null);
                  }}
                >
                  <button
                    className={cn(
                      "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "text-oll-gold-300"
                        : "text-oll-cream/80 hover:text-oll-cream"
                    )}
                    aria-expanded={desktopOpen === item.label}
                    aria-current={active ? "true" : undefined}
                    onClickCapture={() => setDesktopOpen(null)}
                  >
                    {item.label}
                    <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                  {desktopOpen === item.label && (
                    <div className="menu-in absolute left-0 top-full z-50 mt-1 w-64 rounded-xl border border-oll-cream/10 bg-oll-blue-900/98 p-2 shadow-oll-lg backdrop-blur-md">
                      {item.description && (
                        <p className="px-3 py-2 text-xs text-oll-cream/50">
                          {item.description}
                        </p>
                      )}
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={cn(
                            "block rounded-lg px-3 py-2 text-sm transition-colors",
                            isActive(child.to)
                              ? "bg-oll-blue-800 text-oll-gold-300"
                              : "text-oll-cream/80 hover:bg-oll-blue-800 hover:text-oll-cream"
                          )}
                          aria-current={isActive(child.to) ? "page" : undefined}
                          onClick={() => setDesktopOpen(null)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                to={item.to!}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive(item.to!)
                    ? "text-oll-gold-300"
                    : "text-oll-cream/80 hover:text-oll-cream"
                )}
                aria-current={isActive(item.to!) ? "page" : undefined}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Hamburger */}
        <button
          ref={hamburgerRef}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          className="flex h-11 w-11 items-center justify-center rounded-md text-oll-cream lg:hidden"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>

    {/* Mobile drawer — rendered OUTSIDE <header> (round-18 audit F1):
        a `backdrop-filter` on the fixed header makes it the containing
        block for fixed descendants, so a `fixed inset-y-0` drawer nested
        here collapses to the header's height. As a sibling it resolves
        against the viewport. */}
    {mobileOpen && (
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          tabIndex={-1}
          onKeyDown={handleDrawerKeyDown}
          className="drawer-in fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-oll-blue-950 p-6 shadow-oll-lg lg:hidden"
          onClickCapture={(event) => {
            // Close only when a link was tapped (round-18 audit F3) —
            // parent category labels and the heading are not actions.
            if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
          }}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-lg font-semibold text-oll-cream">
              Menu
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-md text-oll-cream"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav aria-label="Mobile" className="space-y-1">
            {primaryNav.map((item, i) => {
              if (item.children) {
                const active = isParentActive(item);
                return (
                  <div key={item.label} className="drawer-item-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <span
                      className={cn(
                        "block px-3 py-2 text-sm font-semibold",
                        active ? "text-oll-gold-300" : "text-oll-cream/60"
                      )}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className={cn(
                            "block rounded-md px-3 py-2 text-sm transition-colors",
                            isActive(child.to)
                              ? "bg-oll-blue-800 text-oll-gold-300"
                              : "text-oll-cream/80 hover:bg-oll-blue-800 hover:text-oll-cream"
                          )}
                          aria-current={isActive(child.to) ? "page" : undefined}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <Link
                  key={item.label}
                  to={item.to!}
                  className={cn(
                    "drawer-item-in block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.to!)
                      ? "bg-oll-blue-800 text-oll-gold-300"
                      : "text-oll-cream/80 hover:bg-oll-blue-800 hover:text-oll-cream"
                  )}
                  style={{ animationDelay: `${i * 40}ms` }}
                  aria-current={isActive(item.to!) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
            {/* Give CTA in the drawer (round-18 audit F5) — the desktop top
                bar link is `hidden lg:block`, so mobile otherwise loses the
                stewardship call-to-action from the primary path. */}
            <div
              className="drawer-item-in mt-6 border-t border-oll-cream/10 pt-4"
              style={{ animationDelay: `${primaryNav.length * 40}ms` }}
            >
              <Link
                to="/give"
                className="block rounded-md px-3 py-2 text-sm font-semibold text-oll-gold-300 transition-colors hover:bg-oll-blue-800 hover:text-oll-gold-200"
              >
                Give
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
