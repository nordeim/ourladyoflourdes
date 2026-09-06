import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

/**
 * Built-artifact E2E — runs the suite against the SINGLEFILE BUILD OUTPUT
 * (`vite preview` serving `dist/`), the same artifact the live host serves.
 *
 * Site B remediation port (docs/remediation-plan-2026-09-06.md Task 4) —
 * adapted from Site A's playwright.built.config.ts. This config is the
 * audit-meaningful gate: it exercises the exact artifact that
 * scripts/inject-csp-hashes.mjs has CSP-hardened, so a singlefile pipeline
 * regression (e.g. root-relative asset rewrites) cannot reach production
 * unnoticed.
 *
 *   bun run test:e2e:built                                     # vs dist/ via vite preview
 *   E2E_BASE_URL=https://ourladyoflourdes.sg bun run test:e2e:built   # vs live
 *
 * Everything else (testDir, projects, expect timeout, trace/video policy,
 * reporter) is inherited from playwright.config.ts.
 */
const liveBaseURL = process.env.E2E_BASE_URL;

export default defineConfig({
  ...base,
  use: {
    ...base.use,
    baseURL: liveBaseURL ?? "http://127.0.0.1:4173",
  },
  // Against the live host there is nothing to boot locally.
  webServer: liveBaseURL
    ? undefined
    : {
        command: "bunx vite preview --port 4173 --host 127.0.0.1 --strictPort",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
