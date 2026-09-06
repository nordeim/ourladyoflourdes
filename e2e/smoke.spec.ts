import { expect, test } from "@playwright/test";

/**
 * Smoke — routing, hero voice, and parish identity.
 * Site B remediation port (docs/remediation-plan-2026-09-06.md Task 5).
 * Canonical facts asserted here mirror src/data/site.ts (unit-guarded);
 * the E2E layer proves they actually render.
 */
test.describe("smoke — home & identity", () => {
  test("home renders the hero voice and parish identity", async ({ page }) => {
    await page.goto("/#/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/grotto in the city/i);
    // Parish name is always visible (header brand).
    await expect(page.getByText(/Church of Our Lady of Lourdes/i).first()).toBeVisible();
    // Two-tongue parish tagline and founding fact.
    await expect(page.getByText(/Two tongues, one faith, one family\./i).first()).toBeVisible();
    await expect(page.getByText(/50 Ophir Road/i).first()).toBeVisible();
    await expect(page.getByText(/\+65 6294 0624/i).first()).toBeVisible();
    // 1888 — consecration year of the national monument.
    await expect(page.getByText(/since 1888/i).first()).toBeVisible();
  });

  test("home renders the welcome quote card", async ({ page }) => {
    await page.goto("/#/");
    await expect(
      page.getByText(/You are not a stranger here\. You are home\./i),
    ).toBeVisible();
  });

  test("home hero entrance animation settles at full opacity", async ({ page }) => {
    await page.goto("/#/");
    const hero = page.locator("section").first();
    const h1 = hero.getByRole("heading", { level: 1 });
    // rise-in entrances settle at opacity 1 (fill-mode: both) — guards
    // against a permanently-invisible hero if the animation contract breaks.
    await expect
      .poll(async () => h1.evaluate((el) => getComputedStyle(el).opacity))
      .toBe("1");
  });

  test("unknown route renders the 404 page with a way home", async ({ page }) => {
    await page.goto("/#/does-not-exist-xyz");
    await expect(page.getByText(/This path does not lead to the church\./i)).toBeVisible();
    await expect(page.getByRole("link", { name: /Return Home/i })).toBeVisible();
  });

  test("skip link is first focusable and targets main content", async ({ page }) => {
    await page.goto("/#/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: /skip to (main )?content/i })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("main")).toBeFocused();
  });
});
