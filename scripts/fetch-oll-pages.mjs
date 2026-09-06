// Fetch JS-rendered pages from ourladyoflourdes.sg with Playwright chromium
import { chromium } from "playwright";

const PAGES = [
  "history-of-the-church",
  "contact-us-1",
  "all-sacraments",
  "all-ministries",
  "church-events",
  "donate",
  "gallery",
  "prayer-room",
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
// pre-accept cookies via persistent storage isn't needed; we click accept
const page = await ctx.newPage();

for (const slug of PAGES) {
  const url = `https://ourladyoflourdes.sg/${slug}`;
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    // accept cookies if banner present
    try {
      const btn = page.getByRole("button", { name: /accept/i }).first();
      await btn.click({ timeout: 4000 });
    } catch {
      /* banner may not appear */
    }
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(2500);
    const text = await page.evaluate(() => document.body.innerText);
    const out = text.replace(/\n{2,}/g, "\n").trim();
    console.log(`\n===== ${slug} (${out.length} chars) =====`);
    console.log(out.slice(0, 6000));
  } catch (e) {
    console.log(`\n===== ${slug} FAILED: ${e.message} =====`);
  }
}

await browser.close();
