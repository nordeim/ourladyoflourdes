import { expect, test } from "@playwright/test";

/**
 * Navigation — desktop dropdowns, mobile drawer, and drawer regressions.
 * Site B remediation port (docs/remediation-plan-2026-09-06.md Task 6),
 * adapted from Site A's navigation + mobile-navigation specs to Site B's
 * Header contract (src/components/Header.tsx):
 *
 * - Desktop dropdowns open on hover AND keyboard focus (audit §6) and render
 *   plain links inside the "Primary" nav (no ARIA menu roles — visibility of
 *   the child links is the observable contract).
 * - Mobile drawer is a modal (aria-label "Site menu") whose nav is labelled
 *   "Mobile"; it closes on Escape, outside pointerdown, and link activation.
 */
test.describe("desktop navigation", () => {
  test("primary nav offers the six OLL destinations", async ({ page }) => {
    await page.goto("/#/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const label of ["Home", "About", "Worship", "Sacraments", "Ministries", "News & Events"]) {
      await expect(
        nav.getByRole("button", { name: label, exact: true }).or(
          nav.getByRole("link", { name: label, exact: true }),
        ),
      ).toHaveCount(1);
    }
    // "Give" is a utility-bar/footer action, not a primary-nav item (nav.ts).
    await expect(nav.getByRole("link", { name: "Give", exact: true })).toHaveCount(0);
  });

  test("Worship dropdown opens on hover and navigates to the Mass anchor", async ({ page }) => {
    await page.goto("/#/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    await nav.getByRole("button", { name: "Worship" }).hover();
    // Dropdown content renders only while open (audit §6 hover contract).
    const massTimes = nav.getByRole("link", { name: "Mass Times" });
    await expect(massTimes).toBeVisible();
    await massTimes.click();
    await expect(page).toHaveURL(/#\/worship#mass/);
    await expect(page.locator("#mass")).toBeVisible();
  });

  test("Sacraments dropdown is keyboard-accessible via focus", async ({ page }) => {
    await page.goto("/#/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const trigger = nav.getByRole("button", { name: "Sacraments" });
    // onFocusCapture opens the dropdown; aria-expanded reflects it.
    await trigger.focus();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const infantBaptism = nav.getByRole("link", { name: "Infant Baptism" });
    await expect(infantBaptism).toBeVisible();
    await infantBaptism.focus();
    await infantBaptism.press("Enter");
    await expect(page).toHaveURL(/#\/sacraments#infant-baptism/);
    await expect(page.locator("#infant-baptism")).toBeVisible();
  });

  test("Escape dismisses an open desktop dropdown", async ({ page }) => {
    await page.goto("/#/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    const trigger = nav.getByRole("button", { name: "Worship" });
    await trigger.hover();
    await expect(nav.getByRole("link", { name: "Mass Times" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(nav.getByRole("link", { name: "Mass Times" })).toBeHidden();
  });
});

test.describe("mobile navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/#/");
  });

  test("drawer opens as a modal, closes on Escape, navigates and closes", async ({ page }) => {
    await page.getByRole("button", { name: "Open menu" }).click();
    const drawer = page.getByRole("dialog", { name: "Site menu" });
    await expect(drawer).toBeVisible();

    // Modal drawer contract (audit §5-6): Escape closes.
    await page.keyboard.press("Escape");
    await expect(drawer).toBeHidden();

    // Navigate via the drawer: full-height modal drawer closes on link tap.
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile" });
    await expect(mobileNav).toBeVisible();
    await mobileNav.getByRole("link", { name: "Give" }).click();
    await expect(page).toHaveURL(/#\/give/);
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
  });

  test("drawer closes when tapping a link to the current route", async ({ page }) => {
    // Regression (Site A audit H-1 class): a link to the CURRENT route never
    // changes the pathname, so the drawer must close on activation itself.
    await page.getByRole("button", { name: "Open menu" }).click();
    const mobileNav = page.getByRole("navigation", { name: "Mobile" });
    await expect(mobileNav).toBeVisible();
    await mobileNav.getByRole("link", { name: "Home" }).click();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeVisible();
    await expect(page.getByRole("dialog", { name: "Site menu" })).toHaveCount(0);
  });
});
