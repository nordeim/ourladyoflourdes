// Browser self-verification for the OLL redesign (dev server on :3000).
// v2 — brand locator fixed; same-document hash navigation via location.hash.
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = "http://localhost:3000";
const SHOTS = "/home/z/my-project/scripts/shots";
mkdirSync(SHOTS, { recursive: true });

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
}

const browser = await chromium.launch({ headless: true });
const errors = [];

// ---------- Desktop ----------
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});

await page.goto(BASE + "/#", { waitUntil: "networkidle", timeout: 30000 });
await page.waitForTimeout(1200);

// 1. Hero renders
const heroH1 = await page.locator("h1").first().textContent();
check("hero headline", /grotto in the city/i.test(heroH1 || ""), heroH1?.trim());

// 2. Header brand (brand link targets "/" — the lg top-bar Give link precedes it)
const brand = await page.locator("header").getByRole("link").filter({ hasText: "Our Lady of Lourdes" }).first().textContent();
check("header brand", /Our Lady of Lourdes/i.test(brand || ""), brand?.trim());

// 3. Quote card
const quote = await page.locator("blockquote").first().textContent();
check("welcome quote card", /not a stranger/i.test(quote || ""));

// 4. Grounds preview cards (3)
const groundsCards = await page.locator("section").filter({ hasText: "Our Grounds" }).locator("a.group").count();
check("grounds preview cards", groundsCards === 3, `count=${groundsCards}`);

// 5. Event cards on home
const eventChips = await page.locator("main article, main .card-tint").count();
check("home feature cards present", eventChips >= 4, `count=${eventChips}`);

await page.screenshot({ path: SHOTS + "/home-top.png" });

// 6. Mass times + today highlight on /worship
await page.goto(BASE + "/#/worship", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const massCards = await page.locator('[data-testid="mass-card"]').count();
const todayCards = await page.locator('[data-testid="mass-card"][data-today="true"]').count();
check("worship mass cards", massCards === 4, `count=${massCards}`);
check("exactly one today-highlight", todayCards === 1, `count=${todayCards}`);
const sundayList = await page.locator('[data-testid="mass-card"]', { hasText: "Sunday" }).first().textContent();
check("sunday has Tamil+English slots", /Tamil/i.test(sundayList || "") && /English/i.test(sundayList || ""));
await page.screenshot({ path: SHOTS + "/worship.png" });

// 7. Hash anchor scroll: #visit map iframe (same-document hash change)
await page.evaluate(() => {
  window.location.hash = "#/worship#visit";
});
await page.waitForTimeout(1500);
const iframe = await page.locator('iframe[title*="Map"]').count();
check("map iframe on #visit", iframe === 1);

// 8. Ministries jump nav pills
await page.goto(BASE + "/#/ministries", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const pills = await page.locator('nav[aria-label="Jump to ministry"] a').count();
check("ministries jump pills", pills === 4, `count=${pills}`);

// 9. Sacraments page renders 7 sections
await page.goto(BASE + "/#/sacraments", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const sactSections = await page.locator("section[id]").count();
check("sacrament sections", sactSections === 7, `count=${sactSections}`);
const sactPills = await page.locator('nav[aria-label="Jump to sacrament"] a').count();
check("sacraments jump pills", sactPills === 7, `count=${sactPills}`);

// 10. History timeline entries
await page.goto(BASE + "/#/history", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const timelineItems = await page.locator(".dot-pulse").count();
check("history timeline rendered", timelineItems >= 8, `count=${timelineItems}`);

// 11. FAQ accordion interaction
await page.goto(BASE + "/#/faq", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const faqButtons = await page.locator("main button[aria-expanded]").count();
check("faq accordion buttons", faqButtons === 6, `count=${faqButtons}`);
const firstBtn = page.locator("main button[aria-expanded]").first();
const beforeState = await firstBtn.getAttribute("aria-expanded");
await firstBtn.click();
await page.waitForTimeout(400);
const afterState = await firstBtn.getAttribute("aria-expanded");
check("accordion toggles on click", beforeState !== afterState, `${beforeState} -> ${afterState}`);
// single-open contract: clicking a closed item opens it and closes the first
const secondBtn = page.locator("main button[aria-expanded]").nth(1);
await secondBtn.click();
await page.waitForTimeout(400);
const secondOpen = await secondBtn.getAttribute("aria-expanded");
const firstNow = await firstBtn.getAttribute("aria-expanded");
check("single-open contract", secondOpen === "true" && firstNow === "false", `second=${secondOpen} first=${firstNow}`);

// 12. Desktop dropdown navigation
await page.evaluate(() => {
  window.location.hash = "#/";
});
await page.waitForTimeout(1000);
const aboutBtn = page.locator('header nav[aria-label="Primary"] button', { hasText: "About" }).first();
await aboutBtn.hover();
await page.waitForTimeout(400);
const dropdownLink = await page.locator('header nav[aria-label="Primary"] a', { hasText: "Our History" }).count();
check("desktop dropdown opens on hover", dropdownLink >= 1, `links=${dropdownLink}`);

// 13. Alias route /donate renders Give
await page.evaluate(() => {
  window.location.hash = "#/donate";
});
await page.waitForTimeout(1000);
const giveHeading = await page.locator("h1").first().textContent();
check("alias /donate -> Give", /give/i.test(giveHeading || ""), giveHeading?.trim());

// 14. NotFound route
await page.evaluate(() => {
  window.location.hash = "#/does-not-exist";
});
await page.waitForTimeout(1000);
const notFound = await page.locator("h1").first().textContent();
check("404 catch-all", /404/.test(notFound || ""));

// ---------- Mobile ----------
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("pageerror", (e) => errors.push(`mobile pageerror: ${e.message}`));
await mobile.goto(BASE + "/#", { waitUntil: "networkidle", timeout: 30000 });
await mobile.waitForTimeout(1000);

// 15. Mobile drawer opens full-height and closes
const burger = mobile.locator('button[aria-label="Open menu"]');
await burger.click();
await mobile.waitForTimeout(600);
const drawer = mobile.locator('[role="dialog"][aria-label="Site menu"]');
const drawerVisible = await drawer.isVisible();
const drawerBox = await drawer.boundingBox();
check("mobile drawer opens", drawerVisible);
check("drawer full height", (drawerBox?.height ?? 0) > 700, `h=${drawerBox?.height}`);
await mobile.screenshot({ path: SHOTS + "/mobile-drawer.png" });
const massLink = drawer.locator("a", { hasText: "Mass Times" }).first();
await massLink.click();
await mobile.waitForTimeout(900);
const drawerGone = !(await drawer.isVisible().catch(() => false));
check("drawer closes on link tap", drawerGone);
const mobileUrl = mobile.url();
check("navigated to worship", /worship/.test(mobileUrl), mobileUrl);
await mobile.screenshot({ path: SHOTS + "/mobile-worship.png" });

// 16. No page errors across the whole run
check("no console/page errors", errors.length === 0, errors.slice(0, 3).join(" | "));

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
process.exit(failed.length > 0 ? 1 : 0);
