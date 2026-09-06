import { useState, useEffect, useRef } from "react";

export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const p = docHeight > 0 ? window.scrollY / docHeight : 0;
        setProgress(Math.min(1, Math.max(0, p)));
        rafRef.current = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        // Reset the guard — StrictMode's double-mount (dev) runs
        // effect → cleanup → effect on one instance; leaving the stale id
        // here permanently disabled the hook after remount (round-16).
        rafRef.current = 0;
      }
    };
  }, []);

  return progress;
}
