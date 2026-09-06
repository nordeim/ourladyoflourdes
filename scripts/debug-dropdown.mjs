// Focused debug: desktop dropdown on /#/ at 1440x900
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/#/", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const nav = page.locator('nav[aria-label="Primary"]');
const btns = await nav.locator("button").allTextContents();
console.log("nav buttons:", JSON.stringify(btns));

const about = nav.locator("button", { hasText: "About" }).first();
await about.hover();
await page.waitForTimeout(600);

const dropdownCount = await nav.locator("a").count();
const links = await nav.locator("a").allTextContents();
console.log("after hover, nav <a> count:", dropdownCount, JSON.stringify(links.slice(0, 8)));

// check hovering state manually via event
const box = await about.boundingBox();
console.log("about button box:", JSON.stringify(box));
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.waitForTimeout(600);
console.log("after mouse.move, nav <a> count:", await nav.locator("a").count());

await browser.close();
