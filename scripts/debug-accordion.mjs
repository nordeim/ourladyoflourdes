// Focused debug: FAQ accordion click behavior
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto("http://localhost:3000/#/faq", { waitUntil: "networkidle" });
await page.waitForTimeout(1000);

const btn = page.locator("main button[aria-expanded]").first();
console.log("before:", await btn.getAttribute("aria-expanded"));
await btn.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await btn.click();
await page.waitForTimeout(600);
console.log("after click:", await btn.getAttribute("aria-expanded"));
console.log("after click (requery):", await page.locator("main button[aria-expanded]").first().getAttribute("aria-expanded"));

// any visible panel content?
const panelText = await page.locator('main [data-testid^="faq-panel"], main .accordion-panel').count();
console.log("panels found by testid:", panelText);
const expandedCount = await page.locator('main button[aria-expanded="true"]').count();
console.log("expanded buttons:", expandedCount);

await browser.close();
