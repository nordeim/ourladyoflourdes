#!/usr/bin/env node
/**
 * CSP hash injection — Site B remediation port (from Site A
 * our-lady-of-lourdes-church/scripts/inject-csp-hashes.mjs, originally the
 * blessed-sacrament-church round-19 hardening, external audit R2-F1 —
 * "CSP weakened by 'unsafe-inline'").
 *
 * After `vite build`, hash every inline <script> body in dist/index.html and
 * rewrite the meta CSP's script-src from 'unsafe-inline' to the sha256 hash
 * list. External origins are preserved.
 *
 * Why script-src only: the app's XSS surface is scripts; inline *style
 * attributes* (React's ScrollProgress width, Reveal/drawer animationDelay)
 * are governed by style-attr CSP and cannot be hash-pinned, so style-src
 * deliberately keeps 'unsafe-inline'.
 *
 * Dev is untouched: source index.html keeps 'unsafe-inline' because Vite's
 * react-refresh preamble is an inline script that only exists in dev.
 *
 * Contract (src/csp-build-contract.test.ts):
 *   - extractInlineScripts(html) → inline <script> bodies only (no src=)
 *   - sha256(body) → deterministic base64 digest
 *   - rewriteScriptSrc(html, hashes) → script-src carries 'sha256-…' entries,
 *     drops 'unsafe-inline', leaves style-src/other directives intact
 * The CLI exits non-zero if any inline script ends up unhashed.
 *
 * Remediation source: OLL_Church_Websites_Design_Audit_Report.md §8 and
 * Recommendation 2. Plan: docs/remediation-plan-2026-09-06.md Task 1.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DIST = resolve(process.cwd(), "dist/index.html");

/** Inline <script> bodies only — a src= attribute makes it external. */
export function extractInlineScripts(html) {
  const out = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (/\bsrc\s*=/i.test(m[1])) continue;
    out.push(m[2]);
  }
  return out;
}

/** Deterministic base64 sha256 — the CSP 'sha256-<digest>' form. */
export function sha256(body) {
  return createHash("sha256").update(body, "utf8").digest("base64");
}

/**
 * Rewrite ONLY the script-src directive: replace 'unsafe-inline' with the
 * hash list, keep 'self' and external origins. Idempotent for hashed input.
 */
export function rewriteScriptSrc(html, hashes) {
  const entries = hashes.map((h) => `'sha256-${h}'`).join(" ");
  return html.replace(
    /(Content-Security-Policy" content="[^"]*?script-src )([^;"]*)(;[^"]*?)"/,
    (_all, head, scriptSrc, tail) => {
      const kept = scriptSrc
        .split(/\s+/)
        .filter((t) => t && t !== "'unsafe-inline'" && !t.startsWith("'sha256-"))
        .join(" ");
      return `${head}${kept} ${entries}${tail}"`;
    },
  );
}

function main() {
  let html;
  try {
    html = readFileSync(DIST, "utf8");
  } catch {
    console.error(`[inject-csp-hashes] cannot read ${DIST} — run vite build first`);
    process.exit(1);
  }

  const bodies = extractInlineScripts(html);
  if (bodies.length === 0) {
    console.error("[inject-csp-hashes] no inline scripts found — nothing to hash");
    process.exit(1);
  }

  const hashes = bodies.map(sha256);
  const out = rewriteScriptSrc(html, hashes);

  // Fail closed: every inline script must be represented in the new script-src.
  const csp = out.match(/Content-Security-Policy" content="([^"]*)"/)?.[1] ?? "";
  const hashEntries = csp.match(/'sha256-[^']+'/g) ?? [];
  if (hashEntries.length !== bodies.length) {
    console.error(
      `[inject-csp-hashes] hash count mismatch: ${bodies.length} inline scripts vs ${hashEntries.length} entries`,
    );
    process.exit(1);
  }
  if (/script-src[^;]*'unsafe-inline'/.test(csp)) {
    console.error("[inject-csp-hashes] script-src still allows 'unsafe-inline'");
    process.exit(1);
  }

  writeFileSync(DIST, out);
  console.log(
    `[inject-csp-hashes] script-src hardened: ${bodies.length} inline script(s) pinned by sha256`,
  );
}

// CLI only — the vitest contract imports the pure helpers above.
if (process.argv[1] && process.argv[1].endsWith("inject-csp-hashes.mjs")) {
  main();
}
