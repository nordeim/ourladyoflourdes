/**
 * Type surface for scripts/inject-csp-hashes.mjs — consumed by
 * src/csp-build-contract.test.ts (the .mjs itself is intentionally outside
 * tsc's `include` so it stays a plain Node build step).
 * Site B remediation port — see docs/remediation-plan-2026-09-06.md Task 1.
 */
export declare function extractInlineScripts(html: string): string[];
export declare function sha256(body: string): string;
export declare function rewriteScriptSrc(html: string, hashes: string[]): string;
