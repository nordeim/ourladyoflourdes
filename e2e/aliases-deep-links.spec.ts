import { expect, test } from "@playwright/test";

/**
 * Legacy aliases & path-style deep links.
 * Site B remediation port (docs/remediation-plan-2026-09-06.md Task 7),
 * adapted from Site A's deep-links spec to Site B's alias table
 * (src/App.tsx + src/utils/deepLinks.ts): old OLL website URLs and
 * path-style links must land on the right page, not silently render Home.
 */
test.describe("legacy aliases land on the right page", () => {
  const aliases: Array<[string, RegExp]> = [
    ["/mass-times", /Worship/i],
    ["/contact-us", /Worship/i],
    ["/all-sacraments", /Sacraments/i],
    ["/history-of-the-church", /Our History/i],
    ["/all-ministries", /Ministries/i],
    ["/news-and-events", /News & Events/i],
    ["/parish-bulletin", /News & Events/i],
    ["/church-events", /News & Events/i],
    ["/donate", /Give/i],
  ];

  for (const [alias, h1] of aliases) {
    test(`${alias} → ${h1}`, async ({ page }) => {
      await page.goto(alias);
      await expect(page).toHaveURL(new RegExp(`#${alias.replace(/\//g, "\\/")}`));
      await expect(page.getByRole("heading", { level: 1 })).toContainText(h1);
    });
  }
});

test.describe("hash anchors are reachable", () => {
  test("worship anchors — mass, confession, visit", async ({ page }) => {
    await page.goto("/#/worship#mass");
    await expect(page.locator("#mass")).toBeVisible();

    await page.goto("/#/worship#confession");
    await expect(page.locator("#confession")).toBeVisible();

    await page.goto("/#/worship#visit");
    await expect(page.locator("#visit")).toBeVisible();
  });

  test("ministries anchors — liturgical, formation, pastoral, community", async ({ page }) => {
    await page.goto("/#/ministries#liturgical");
    await expect(page.locator("#liturgical")).toBeVisible();

    await page.goto("/#/ministries#formation");
    await expect(page.locator("#formation")).toBeVisible();

    await page.goto("/#/ministries#pastoral");
    await expect(page.locator("#pastoral")).toBeVisible();

    await page.goto("/#/ministries#community");
    await expect(page.locator("#community")).toBeVisible();
  });

  test("sacraments jump-nav anchor — anointing", async ({ page }) => {
    await page.goto("/#/sacraments#anointing");
    await expect(page.locator("#anointing")).toBeVisible();
  });
});
