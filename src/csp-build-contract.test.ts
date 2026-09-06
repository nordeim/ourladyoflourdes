import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CSP build contract — Site B remediation port (from Site A's
 * src/csp-build-contract.test.ts, itself a blessed-sacrament-church port).
 *
 * scripts/inject-csp-hashes.mjs must exist, export pure helpers
 * (extractInlineScripts, sha256, rewriteScriptSrc), and the build must
 * rewrite script-src from 'unsafe-inline' to sha256 hashes while leaving
 * style-src 'unsafe-inline' intact (React inline styles need it).
 *
 * Remediation source: OLL_Church_Websites_Design_Audit_Report.md §8
 * ("CSP hash injection — Site A Yes / Site B No") and Recommendation 2
 * ("Keep Site A's build hardening"). Plan: docs/remediation-plan-2026-09-06.md Task 1.
 */
const root = resolve(__dirname, "..");
const scriptPath = resolve(root, "scripts/inject-csp-hashes.mjs");

type Extract = (html: string) => string[];
type Rewrite = (html: string, hashes: string[]) => string;
type Hash = (body: string) => string;

const mod = (await import(scriptPath)) as {
  extractInlineScripts: Extract;
  rewriteScriptSrc: Rewrite;
  sha256: Hash;
};

const FIXTURE = `<!doctype html><html><head>
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; img-src 'self' data: blob:; frame-src https://www.google.com; object-src 'none'; base-uri 'self';">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"Church","name":"Church of Our Lady of Lourdes"}</script>
</head><body><div id="root"></div>
<script type="module">console.log("app")</script>
<script src="/assets/index.js"></script>
</body></html>`;

describe("inject-csp-hashes pure helpers", () => {
  it("extracts only inline <script> bodies (module + JSON-LD), not external", () => {
    const bodies = mod.extractInlineScripts(FIXTURE);
    expect(bodies.length).toBe(2);
    expect(bodies[0]).toContain("@context");
    expect(bodies.some((b) => b.includes("console.log"))).toBe(true);
    expect(bodies.some((b) => b.includes("/assets/index.js"))).toBe(false);
  });

  it("sha256 produces deterministic base64 digests", () => {
    const h1 = mod.sha256('console.log("app")');
    const h2 = mod.sha256('console.log("app")');
    expect(h1).toBe(h2);
    expect(h1).toMatch(/^[A-Za-z0-9+/]{43}=$/);
  });

  it("rewrites script-src with hashes and drops 'unsafe-inline'", () => {
    const bodies = mod.extractInlineScripts(FIXTURE);
    const hashes = bodies.map(mod.sha256);
    const out = mod.rewriteScriptSrc(FIXTURE, hashes);
    const csp = out.match(/content="([^"]*)"/)?.[1] ?? "";
    expect(csp).toContain("'sha256-");
    expect(csp).not.toMatch(/script-src[^;]*'unsafe-inline'/);
    // style-src contract survives the rewrite
    expect(csp).toMatch(/style-src 'self' 'unsafe-inline' https:\/\/fonts\.googleapis\.com/);
    expect(csp).toContain("img-src 'self' data: blob:");
    expect(csp).toContain("frame-src https://www.google.com");
  });

  it("leaves the document outside the CSP meta untouched", () => {
    const out = mod.rewriteScriptSrc(FIXTURE, [mod.sha256("x")]);
    expect(out).toContain('<script type="module">console.log("app")</script>');
    expect(out).toContain('"@type":"Church"');
  });
});

describe("build wiring contract", () => {
  const pkg = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")) as {
    scripts: Record<string, string>;
  };

  it("build runs the hash injection after vite build", () => {
    expect(pkg.scripts.build).toBe("vite build && node scripts/inject-csp-hashes.mjs");
  });

  it("source index.html keeps the dev-mode contract ('unsafe-inline' in script-src)", () => {
    const html = readFileSync(resolve(root, "index.html"), "utf8");
    expect(html).toMatch(/script-src 'self' 'unsafe-inline'/);
  });

  it("source index.html CSP is local-only (no external script origins beyond self)", () => {
    const html = readFileSync(resolve(root, "index.html"), "utf8");
    const csp = html.match(/<meta[^>]*http-equiv="Content-Security-Policy"[^>]*content="([^"]*)"/s)?.[1] ?? "";
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("object-src 'none'");
  });
});
