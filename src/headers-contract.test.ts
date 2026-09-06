import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * public/_headers deployment contract — Site B remediation.
 *
 * Cloudflare Pages-style `_headers` has NO comment syntax: the first `/*`
 * line is the all-paths splat rule and the indented lines are its headers.
 * The file previously ended with a stray comment-closer line (a literal
 * star followed by slash, as if it were CSS), which hosts would treat as an
 * invalid second path rule.
 *
 * Remediation source: OLL_Church_Websites_Design_Audit_Report.md §8
 * ("Public _headers file — Site A Yes / Site B No") + Recommendation 2.
 * Plan: docs/remediation-plan-2026-09-06.md Task 2.
 */
const root = resolve(__dirname, "..");
const read = (p: string) => readFileSync(resolve(root, p), "utf8");

const SECURITY_HEADERS = [
  "X-Content-Type-Options",
  "X-Frame-Options",
  "Referrer-Policy",
  "Permissions-Policy",
  "Strict-Transport-Security",
] as const;

/** Well-formed _headers body: splat path, then indented `Header: value` lines. */
function parseHeadersFile(text: string): { paths: string[]; invalid: string[]; headers: Map<string, string> } {
  const paths: string[] = [];
  const invalid: string[] = [];
  const headers = new Map<string, string>();
  for (const rawLine of text.split("\n")) {
    const line = rawLine.replace(/\r$/, "");
    if (line.trim() === "") continue;
    const isSplat = /^\/\*$/m.test(line) && line.trim() === "/*";
    if (!rawLine.startsWith(" ") && isSplat) {
      paths.push(line.trim());
      continue;
    }
    if (/^\s{2,}\S/.test(rawLine)) {
      const m = rawLine.trim().match(/^([A-Za-z0-9-]+):\s*(.+)$/);
      if (m) {
        headers.set(m[1].toLowerCase(), m[2].trim());
        continue;
      }
    }
    invalid.push(JSON.stringify(rawLine));
  }
  return { paths, invalid, headers };
}

describe("public/_headers deployment artifact", () => {
  const text = read("public/_headers");
  const parsed = parseHeadersFile(text);

  it("exists", () => {
    expect(existsSync(resolve(root, "public/_headers"))).toBe(true);
  });

  it("declares the all-paths splat rule", () => {
    expect(parsed.paths).toEqual(["/*"]);
  });

  it("contains only well-formed lines (no stray comment closers)", () => {
    expect(parsed.invalid).toEqual([]);
  });

  it("ships the five host security headers", () => {
    for (const directive of SECURITY_HEADERS) {
      expect(parsed.headers.has(directive.toLowerCase())).toBe(true);
    }
  });

  it("ships the documented hardened values", () => {
    expect(parsed.headers.get("x-content-type-options")).toBe("nosniff");
    expect(parsed.headers.get("x-frame-options")).toBe("SAMEORIGIN");
    expect(parsed.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(parsed.headers.get("strict-transport-security")).toContain("max-age=31536000");
  });
});
