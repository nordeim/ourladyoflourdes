import { useState, useEffect, useRef } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/utils/cn";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const progress = useScrollProgress();
  const [visible, setVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - progress * circumference;

  useEffect(() => {
    const onScroll = () => {
      const shouldShow = window.scrollY > 480;
      setVisible((prev) => {
        if (prev && !shouldShow) {
          // Release focus if button is hiding while focused
          const btn = buttonRef.current;
          if (btn && btn === document.activeElement) {
            btn.blur();
          }
        }
        return shouldShow;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      ref={buttonRef}
      data-testid="back-to-top"
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-oll-blue-900 text-oll-cream shadow-oll transition-all",
        visible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <svg
        data-testid="back-to-top-progress"
        className="absolute inset-0 h-12 w-12 -rotate-90"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="rgba(212,173,66,0.2)"
          strokeWidth="2"
        />
        <circle
          cx="20"
          cy="20"
          r="18"
          fill="none"
          stroke="#d4ad42"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          data-progress
        />
      </svg>
      <ArrowUp className="relative h-4 w-4" />
    </button>
  );
}
