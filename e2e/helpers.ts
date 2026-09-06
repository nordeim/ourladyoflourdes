import { expect, type Page } from "@playwright/test";

/**
 * E2E helpers — Site B remediation port (from Site A's e2e/helpers.ts).
 */

/**
 * Navigate to a HashRouter URL via baseURL + hash.
 * Example: gotoHash(page, "/worship#mass") → /#/worship#mass
 */
export async function gotoHash(page: Page, hash: string) {
  const clean = hash.startsWith("/") ? hash : `/${hash}`;
  await page.goto(`/#${clean}`);
}

/** Assert the current URL contains a hash fragment (regex-escaped). */
export async function expectHash(page: Page, fragment: string) {
  await expect(page).toHaveURL(new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
