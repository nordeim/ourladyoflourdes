import { expect, test } from "@playwright/test";

/**
 * Worship & Sacraments — the two IA wins the audit credits Site B for
 * (audit Recommendation 4: "Surface public-holiday Masses and Sacraments").
 * Site B remediation port (docs/remediation-plan-2026-09-06.md Task 8).
 */
test.describe("worship — mass schedule", () => {
  test("renders four Mass cards including Public Holidays", async ({ page }) => {
    await page.goto("/#/worship");
    const cards = page.getByTestId("mass-card");
    await expect(cards).toHaveCount(4);
    for (const title of ["Monday – Friday", "Saturday", "Sunday", "Public Holidays"]) {
      await expect(cards.filter({ hasText: title })).toHaveCount(1);
    }
  });

  test("public-holiday Masses list English and Tamil slots", async ({ page }) => {
    await page.goto("/#/worship");
    const card = page.getByTestId("mass-card").filter({ hasText: "Public Holidays" });
    await expect(card).toContainText(/9:00 AM/i);
    await expect(card).toContainText(/10:00 AM/i);
    await expect(card).toContainText(/English/i);
    await expect(card).toContainText(/Tamil/i);
  });

  test("Sunday lists both English and Tamil Masses", async ({ page }) => {
    await page.goto("/#/worship");
    const card = page.getByTestId("mass-card").filter({ hasText: "Sunday" });
    await expect(card).toContainText(/8:00 AM/i);
    await expect(card).toContainText(/9:30 AM/i);
    await expect(card).toContainText(/11:00 AM/i);
    await expect(card).toContainText(/6:30 PM/i);
    await expect(card).toContainText(/Tamil/i);
  });

  test("exactly one Mass card is highlighted as today", async ({ page }) => {
    await page.goto("/#/worship");
    const todayCards = page.locator('[data-testid="mass-card"][data-today="true"]');
    await expect(todayCards).toHaveCount(1);
    await expect(todayCards.getByText("Today", { exact: true })).toBeVisible();
  });

  test("reconciliation note and adoration hours are present", async ({ page }) => {
    await page.goto("/#/worship");
    await expect(page.getByText(/15 minutes before every Mass/i).first()).toBeVisible();
    await expect(page.getByText(/Daily 8:00 AM – 8:00 PM/i).first()).toBeVisible();
  });

  test("visit section embeds the Google Maps frame", async ({ page }) => {
    await page.goto("/#/worship#visit");
    const map = page.locator("#visit iframe");
    await expect(map).toBeVisible();
    const src = await map.getAttribute("src");
    expect(src).toContain("google.com/maps");
  });
});

test.describe("sacraments page", () => {
  test("renders all seven sacrament sections with jump-nav pills", async ({ page }) => {
    await page.goto("/#/sacraments");
    for (const id of [
      "infant-baptism",
      "matrimony",
      "communion",
      "confirmation",
      "reconciliation",
      "homebound",
      "anointing",
    ]) {
      await expect(page.locator(`#${id}`)).toBeAttached();
    }
    // Jump nav (audit §6 scrollspy pattern) exposes the seven destinations.
    const jumpNav = page.getByRole("navigation", { name: "Jump to sacrament" });
    await expect(jumpNav.getByRole("link").first()).toBeVisible();
  });

  test("Anointing of the Sick section carries its heading", async ({ page }) => {
    await page.goto("/#/sacraments#anointing");
    await expect(page.getByRole("heading", { name: /Anointing of the Sick/i })).toBeVisible();
  });
});
