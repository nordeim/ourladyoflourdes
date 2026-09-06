import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/utils/cn";
import type { TimelineEntry } from "@/data/content";

interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

/**
 * Scroll choreography: the rail draws downward once the list enters the
 * viewport and each entry rises in with a staggered delay.
 * Transform/opacity only — the global prefers-reduced-motion neutralizer
 * flattens every transition, and the observer short-circuits to the drawn
 * state when reduced motion is requested or IO is unavailable.
 */
export function Timeline({ entries, className }: TimelineProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = listRef.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={listRef} className={cn("relative", className)}>
      <div
        data-testid="timeline-rail"
        aria-hidden="true"
        className={cn(
          "absolute bottom-2 left-4 top-0 w-px origin-top bg-gradient-to-b from-oll-blue-400 via-oll-gold-400/70 to-oll-gold-500 transition-transform duration-[1100ms] ease-out sm:left-1/2",
          drawn ? "scale-y-100" : "scale-y-0",
        )}
      />
      <div className="space-y-12">
        {entries.map((entry, i) => {
          const isLeft = i % 2 === 0;
          return (
            <Reveal key={`${entry.year}-${entry.title}`} delay={i * 80}>
              <div
                className={`relative flex items-start gap-6 sm:gap-0 ${
                  isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div
                  className={`hidden sm:block sm:w-1/2 ${
                    isLeft ? "sm:pr-12 sm:text-right" : "sm:pl-12 sm:text-left"
                  }`}
                >
                  <span className="font-display text-4xl font-bold text-oll-blue-700">
                    {entry.year}
                  </span>
                </div>
                <div className="absolute left-4 top-1 z-10 -translate-x-1/2 sm:left-1/2">
                  <div className="dot-pulse h-4 w-4 rounded-full bg-oll-gold-400" />
                </div>
                <div
                  className={`pl-10 sm:w-1/2 ${
                    isLeft ? "sm:pl-12 sm:text-left" : "sm:pr-12 sm:text-right"
                  }`}
                >
                  <span className="font-display text-2xl font-bold text-oll-blue-700 sm:hidden">
                    {entry.year}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-oll-blue-900">
                    {entry.title}
                  </h3>
                  <p className="mt-2 text-oll-charcoal leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
