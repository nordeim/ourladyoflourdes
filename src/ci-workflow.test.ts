import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * CI workflow contract — Site B remediation port (from Site A's
 * src/ci-workflow.test.ts, adapted from pnpm to bun).
 *
 * .github/workflows/ci.yml must trigger on push/pull_request to main and run
 * the documented gate: lint → typecheck → test → build (CSP-injected) →
 * test:e2e:built against the built artifact.
 *
 * Remediation source: OLL_Church_Websites_Design_Audit_Report.md §8
 * (Site A hardening) + Recommendation 2. Plan: docs/remediation-plan-2026-09-06.md Task 9.
 */
const root = resolve(__dirname, "..");
const ci = readFileSync(resolve(root, ".github", "workflows", "ci.yml"), "utf8");

const branchValues = [...ci.matchAll(/branches:\s*(\S+)/g)].map((m) => m[1]);

describe(".github/workflows/ci.yml trigger + gate contract", () => {
  it("declares exactly two branch filters", () => {
    expect(branchValues).toHaveLength(2);
  });

  it("triggers push and pull_request on main as a proper flow sequence", () => {
    expect(branchValues).toEqual(["[main]", "[main]"]);
  });

  it("uses flow-sequence syntax for both triggers (no plain-scalar corruption)", () => {
    const corrupted = branchValues.filter((v) => !(v.startsWith("[") && v.endsWith("]")));
    expect(corrupted).toEqual([]);
  });

  it("runs the five documented gate steps", () => {
    for (const step of [
      "bun run lint",
      "bun run typecheck",
      "bun run test",
      "bun run build",
      "bun run test:e2e:built",
    ]) {
      expect(ci).toContain(step);
    }
  });

  it("installs deps with --frozen-lockfile via setup-bun", () => {
    expect(ci).toContain("--frozen-lockfile");
    expect(ci).toContain("oven-sh/setup-bun");
  });

  it("installs the chromium browser for Playwright", () => {
    expect(ci).toMatch(/playwright install.*chromium/s);
  });

  it("uploads dist/ and failure reports as artifacts", () => {
    expect(ci).toContain("actions/upload-artifact");
    expect(ci).toContain("playwright-report");
    expect(ci).toContain("dist/");
  });
});
