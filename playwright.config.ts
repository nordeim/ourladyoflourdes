import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright E2E for the Our Lady of Lourdes SPA (HashRouter).
 * Site B remediation port (docs/remediation-plan-2026-09-06.md Task 4) —
 * adapted from Site A's playwright.config.ts:
 *
 * - Chromium-only in v1 via `channel: "chromium"` (new headless): the
 *   rAF-throttled scroll hooks (useScrollProgress / useScrolled) need
 *   continuous BeginFrames, which the headless-shell build does not schedule.
 * - webServer reuses an already-running dev server; otherwise starts one on
 *   the project's dev port 3000.
 * - 15 s expect timeout: a fresh install's first dev-server page load runs
 *   Vite dep-optimisation (~1900 modules incl. lucide-react) and can leave
 *   the SPA blank for >5s (Site A's documented cold-start flake). Extends
 *   the failure-detection window only — assertions are unchanged.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["list"]] : [["html", { open: "never" }], ["list"]],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  expect: { timeout: 15_000 },
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chromium" },
    },
  ],
});
