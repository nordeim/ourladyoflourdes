import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { knownRoutePaths, resolveHashRedirect } from "@/utils/deepLinks";

/**
 * Path-style deep links such as /worship silently render Home under
 * HashRouter (soft-404 for links shared without the hash). The router stays
 * HashRouter — the single-file deployment tradeoff documented in App.tsx — so
 * known path-style routes (including legacy ourladyoflourdes.sg paths) are
 * rewritten to their hash equivalents before React mounts.
 */
describe("resolveHashRedirect", () => {
  it("rewrites each known route path to its hash equivalent", () => {
    expect(resolveHashRedirect("/worship", "")).toBe("/#/worship");
    expect(resolveHashRedirect("/news-events", "")).toBe("/#/news-events");
    expect(resolveHashRedirect("/give", "")).toBe("/#/give");
    expect(resolveHashRedirect("/faq", "")).toBe("/#/faq");
  });

  it("rewrites the legacy ourladyoflourdes.sg aliases too", () => {
    expect(resolveHashRedirect("/history-of-the-church", "")).toBe(
      "/#/history-of-the-church"
    );
    expect(resolveHashRedirect("/all-sacraments", "")).toBe(
      "/#/all-sacraments"
    );
    expect(resolveHashRedirect("/all-ministries", "")).toBe(
      "/#/all-ministries"
    );
    expect(resolveHashRedirect("/parish-bulletin", "")).toBe(
      "/#/parish-bulletin"
    );
    expect(resolveHashRedirect("/donate", "")).toBe("/#/donate");
  });

  it("normalizes trailing slashes", () => {
    expect(resolveHashRedirect("/worship/", "")).toBe("/#/worship");
  });

  it("returns null for unknown, case-mismatched, and file paths", () => {
    expect(resolveHashRedirect("/wp-admin", "")).toBeNull();
    expect(resolveHashRedirect("/Worship", "")).toBeNull();
    expect(resolveHashRedirect("/index.html", "")).toBeNull();
    expect(resolveHashRedirect("/images/hero-church.jpg", "")).toBeNull();
  });
});

describe("knownRoutePaths stays in sync with App.tsx", () => {
  it("covers exactly the concrete paths declared in src/App.tsx", () => {
    const appSource = readFileSync(resolve(process.cwd(), "src/App.tsx"), "utf8");
    const declared = [...appSource.matchAll(/path="([^"]+)"/g)]
      .map((m) => m[1])
      .filter((p): p is string => p !== undefined && p !== "*");

    expect(declared.length).toBeGreaterThan(0);
    for (const path of declared) {
      expect(
        knownRoutePaths,
        `App.tsx declares path="${path}" but deepLinks.ts does not redirect it`
      ).toContain(path);
    }
    // No stale redirects for routes App.tsx no longer declares.
    expect(new Set(knownRoutePaths).size).toBe(knownRoutePaths.length);
    expect([...knownRoutePaths].sort()).toEqual([...declared].sort());
  });
});
