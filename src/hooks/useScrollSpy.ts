import { useEffect, useState } from "react";

/**
 * Track which of the given section ids is currently crossing the viewport's
 * middle band (Ministries scrollspy). A single IntersectionObserver with
 * asymmetric top/bottom insets (-45% / -50%) isolates the thin horizontal
 * band spanning 45–50% of the viewport height, just above its center, where
 * a reader's eye sits; the deepest section in document order that is crossing
 * the band wins (batched entries are resolved by document order, not delivery
 * order), and the pill holds its position when nothing intersects. Falls back
 * to the first id, tolerates ids with no matching element, and disconnects on
 * unmount. Callers may pass module-constant arrays or inline literals: the
 * effect re-runs on the joined id string, so either is safe.
 */
export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    setActive(ids[0] ?? "");
    const targets = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;

    const intersecting = new Map<string, boolean>();
    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            intersecting.set((entry.target as HTMLElement).id, entry.isIntersecting);
          }
          const current = [...ids].reverse().find((id) => intersecting.get(id));
          if (current) setActive(current);
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
      );
      targets.forEach((target) => observer?.observe(target));
    } catch {
      return;
    }
    return () => observer?.disconnect();
    // ids identity changes are owned by the caller (module-constant arrays);
    // inline literals are safe too — this dep is the joined string.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join("|")]);

  return active;
}
