# Visual Aesthetic & UI/UX Comparison
### Church of the Blessed Sacrament vs. Church of Our Lady of Lourdes (Singapore)

**Sites reviewed:**
- Site A — `https://blessed-sacrament-church.jesspete.shop/` (repo: `nordeim/blessed-sacrament-church`)
- Site B — `https://our-lady-of-lourdes.jesspete.shop/` (repo: `nordeim/ourladyoflourdes`)

**Method:** Live-site HTML/CSS retrieval for both URLs, plus a full clone and line-by-line source diff of both repositories (`src/`, `public/`, config, tests, docs). No visual screenshot renderer was available in this environment, so layout claims are corroborated from the compiled Tailwind CSS and JSX markup rather than a rendered image; this is stated explicitly wherever it applies.

---

## 1. Executive Summary

Both sites are **the same hand-built product family**: identical stack (React 19 + Vite 7 + Tailwind v4 + `react-router-dom` HashRouter, bundled to a single inlined HTML file via `vite-plugin-singlefile`), identical component inventory (`Header`, `Footer`, `PageHero`, `Timeline`, `Reveal`, `Accordion`, `Button`, `SectionHeading`, `SafeImage`…), identical CSS utility vocabulary (`gold-rule`, `card-lift`, `divider-weave`, `rise-in`, `hero-ken-burns`, `scrim-hero`…), and identical CSP/build tooling (`scripts/inject-csp-hashes.mjs`). Site B (Our Lady of Lourdes, "OLL") is a later fork of Site A's (Blessed Sacrament, "BSC") codebase, re-themed and re-populated for a different parish.

**Verdict:** Visually, **Site B (OLL) has the stronger identity** — a more historically appropriate typeface and a richer, more semantically-tied colour system for a 1888 Gothic national monument. **Functionally and operationally, Site A (BSC) is the more mature build** — deeper content model (named clergy, PPC roster, a dedicated volunteering page, social channels wired up) and a much larger regression-test/documentation trail. OLL also carries one accessibility fix that was never back-ported to BSC (see §6). Neither site is broken; the gap is in completeness and content depth, not in code quality.

| | Site A — Blessed Sacrament | Site B — Our Lady of Lourdes |
|---|---|---|
| Display typeface | Fraunces (soft variable serif) | Cormorant Garamond (classical high-contrast serif) |
| Palette identity | Sapphire blue + gold + terracotta/pine | Marian blue + gold + rose + sage |
| Nav top-level items | 6 (incl. standalone "Serve") | 6 (incl. dedicated "Sacraments" dropdown) |
| Clergy/leadership content | Named priests + PPC roster | None |
| Social channels wired up | Facebook, Instagram, YouTube (Footer) | None |
| Dedicated volunteering page | Yes (`/serve`) | No |
| Dedicated sacraments page | No (folded into Ministries/Worship) | Yes (`/sacraments`) |
| Mobile-drawer Escape-key fix | **Missing** (regression) | **Present** |
| Automated test files | ~40 unit/contract tests + 10 Playwright specs | ~26 unit/contract tests + 5 Playwright specs |
| Design/process documentation | 58 audit/remediation docs | 5 docs |

---

## 2. Shared Foundation (verified via source diff)

A `diff -rq` of both `src/` trees shows **every file exists on both sides with the same name and role**; the differences are almost entirely (a) Tailwind token names (`bsc-*` → `oll-*`), (b) copy/content, and (c) a handful of structural additions on each side. This confirms both are built from one shared internal template rather than being independent designs — useful context: differences below are intentional divergences from a common baseline, not two unrelated design efforts.

Shared, and consistently well-executed on both sites:
- **Editorial hero pattern**: full-bleed photo, slow Ken-Burns zoom, dark gradient scrim, staggered `rise-in` text, and a pulled-up "welcome quote" card overlapping the hero/body boundary.
- **Alternating cream/parchment section bands** instead of hard borders, for a calm, printed-programme feel appropriate to a parish site.
- **Consistent card system** (`card-lift`, `card-tint`) with a gold border/shadow on hover.
- **Sticky header** with hover/focus-triggered desktop dropdowns and a full-height off-canvas drawer on mobile, both with focus traps.
- **Reduced-motion support**: a single `@media (prefers-reduced-motion: reduce)` block disables every custom animation utility — a genuinely inclusive default, present in both `index.css` files identically.
- **Skip link, visible 2px gold focus ring on every focusable element, `aria-current="page"` on active nav links** — consistent baseline accessibility hygiene.
- **CSP hardening**: both ship a strict `Content-Security-Policy` with build-time-injected script hashes (`inject-csp-hashes.mjs`), `object-src 'none'`, and no `unsafe-inline` for scripts.

---

## 3. Typography

- Both use **Source Sans 3** for body copy — a safe, legible humanist sans that keeps long-form content (Mass times, FAQs, ministry descriptions) comfortable to scan on both palettes.
- **Site A's Fraunces** is a variable serif with soft, rounded terminals — reads as warm and contemporary/editorial.
- **Site B's Cormorant Garamond** is a classical high-contrast serif with sharp serifs and vertical stress — reads as more solemn and monumental.

**Assessment (Reasoned, from font metadata + weight ranges declared in each `index.html`'s Google Fonts `@import`):** OLL's choice is the better *contextual* fit — the parish is an 1888 Gothic-Revival National Monument, and Cormorant Garamond's classical proportions echo tracery and pointed arches far more than Fraunces' rounded, magazine-style forms do for BSC's 1958 modernist tent-roof building (where, arguably, Fraunces' softness is *also* an intentional, defensible choice — the tent roof is itself an unusual, friendly modernist form). Neither is a wrong choice; OLL's is simply more period-appropriate for its specific architecture, and BSC's is more approachable/contemporary for its own.

---

## 4. Colour System

Both are built on the exact same recipe (cream page background, deep-navy hero/footer, gold accent, parchment section bands) but Site B extends the palette further:

- **Site A tokens:** `bsc-sapphire-50…950`, `bsc-gold-100…700`, plus `terracotta` and `pine` accents used sparingly for ministry-category tagging.
- **Site B tokens:** `oll-blue-50…950` (a slightly deeper, greener navy than BSC's sapphire), `oll-gold-100…700` (identical hex values to BSC's gold — a shared accent, sensible for brand consistency across a diocese's digital properties), plus **`oll-rose-*`** (tied explicitly to the "Mystical Rose" Marian title) and **`oll-sage-*`** (used for formation/catechetical content).

**Assessment (Reasoned, from token comments in `index.css`):** OLL's rose/sage additions give it a wider semantic vocabulary for category-tagging ministries/devotions (visible in `utils/categoryTone.ts`, which maps ministry categories to distinct accent colours on both sites — OLL's version has more categories to draw from). This is a genuine design-system improvement, not just decoration, because it lets the ministries/devotions grids differentiate content at a glance rather than relying on gold for everything.

One shared, minor risk on both sites: `gold-300`/`gold-400` text is used at small sizes over near-black navy for eyebrow labels and dropdown active states. This pairing is very likely to clear WCAG AA (a mid-value gold on a near-black navy typically yields >7:1), but this was **not measured against rendered pixels** in this review — flagged as **Unverified**, low risk given the hue/lightness values involved.

---

## 5. Layout, Composition & Motion

No meaningful differences: hero → welcome-quote overlap card → mission/vision → mass-times teaser → ministries grid → news/events → CTA → footer is the shared home-page skeleton on both sites (`Home.tsx` is 203 lines on BSC, 205 on OLL, structurally identical). Both use the same `Reveal` scroll-in-view utility, the same `Timeline` component for the History page (vertical rail with a pulsing gold node), and the same responsive breakpoint ladder (`sm`/`lg` grid-column changes, `lg:sticky` sidebar patterns on interior pages).

This is a strength for *consistency* (a visitor moving between diocesan sites would recognise the pattern language) but it does mean Site B's "improved information architecture" is really a content/IA improvement layered on an unchanged layout engine, not a new layout.

---

## 6. UX & Accessibility Differences (source-verified)

This is the most concrete, code-level finding, verified directly by diffing `Header.tsx`:

- **Site A (BSC):** the mobile drawer closes on outside-tap and on Escape *only once the drawer itself has received DOM focus*, which happens on a 50 ms `setTimeout` after opening. Pressing Escape in the brief window before that timeout fires does nothing.
- **Site B (OLL):** adds a second, window-level `keydown` listener that closes the drawer on Escape from the moment `mobileOpen` becomes true, closing that gap. The commit is explicitly documented in a code comment as a fix surfaced by an E2E navigation spec.

**Impact:** Low-to-moderate — a keyboard user who opens the mobile menu and immediately presses Escape (a very plausible interaction) will see it fail to close on BSC. **Confidence: Verified** (the code difference is confirmed by direct file diff); the exact runtime timing window is **Reasoned** from the code (not executed in a browser in this review).
**Recommendation:** Back-port OLL's window-level Escape listener into `blessed-sacrament-church`'s `Header.tsx`. It's a ~15-line, additive, non-breaking change.

---

## 7. Content Depth & Information Architecture

Comparing `src/data/content.ts` and `src/data/site.ts` directly:

| Content area | Site A (BSC) | Site B (OLL) |
|---|---|---|
| Named clergy (`priests[]`) | ✅ present, rendered on `/about` | ❌ not in data model at all |
| Parish Pastoral Council roster (`ppcMembers[]`) | ✅ present | ❌ not present |
| Dedicated Sacraments page/data | ❌ (sacraments folded into Worship/Ministries copy) | ✅ dedicated `/sacraments` page with 4+ sacrament entries, deep-linkable (`#infant-baptism`, `#matrimony`, etc.) |
| Dedicated volunteering page (`serveRoles`) | ✅ `/serve` with explicit role list | ❌ no equivalent page or data |
| Social channels (`facebook`/`instagram`/`youtube` in `site.ts`, rendered via a `SocialIcons` component in the footer) | ✅ | ❌ `SocialIcons` component doesn't exist in this repo and `Footer.tsx` never references social links |
| Mass-schedule granularity | 6 Sunday Mass slots incl. 4 languages (Mandarin/English/Indonesian/Tagalog) | 5 Sunday + a distinct **public-holiday Mass card** (English + Tamil) |
| Multilingual identity in copy | Implicit (via Mass-language list) | Explicit — tagline "Two tongues, one faith, one family," English/Tamil framing throughout |

**Assessment:**
- OLL's **Sacraments page** and **public-holiday Mass card** are genuine UX wins: they surface information visitors specifically search for (how to book a baptism, when Mass is on a public holiday) as first-class, deep-linkable destinations rather than burying them in prose.
- BSC's **named clergy/PPC roster** and **working social links** are genuine UX/trust wins that OLL currently lacks — a parish website without a "who is our priest" section or any social presence reads as less personal and less current/maintained, both of which matter for a "come as you are, you are expected" pastoral tone that both sites otherwise strike well in their copy.
- BSC's **dedicated `/serve` volunteering page** is a distinct conversion path ("how do I get involved") that OLL folds only into general ministry descriptions, making it harder to find a concrete call-to-action for volunteering on OLL.

None of this reflects a defect in either codebase — the `content.ts`/`site.ts` schemas are shared and simply weren't populated with equivalent data on the side that's missing them. It is a straightforward, additive backlog item for whichever team owns each site.

---

## 8. Imagery & Performance Notes (apply equally to both)

- Both ship photography as plain `.jpg` only (no `<picture>`/`srcset`, no AVIF/WebP), and `SafeImage.tsx` (identical on both sites) renders a bare `<img>` with no explicit `width`/`height` attributes — this risks layout shift (CLS) on slow connections, and is a shared, fixable item on both codebases (fixed-aspect-ratio wrapper or explicit intrinsic dimensions would resolve it).
- Both inline the entire app (JS, CSS, fonts-preconnect, JSON-LD) into a **single HTML file** via `vite-plugin-singlefile`. This is a deliberate, reasonable trade-off for a small static parish site (one HTTP request, easy CDN/edge hosting, no route-splitting complexity) but means the full JS bundle downloads before any interaction is possible, and there's no code-splitting benefit if the site grows. This is architecture, not a defect — flagged as a shared, unverified performance ceiling rather than a bug (Lighthouse timings were not run against the live URLs in this review).
- Both correctly use empty `alt=""` on purely decorative hero-background images (title text already conveys meaning) and descriptive `alt` text on the homepage hero image — good semantic practice on both sides.

---

## 9. Findings Summary (Audit format)

| # | Finding | Location | Severity | Confidence |
|---|---|---|---|---|
| 1 | Mobile drawer ignores Escape key in the ~50 ms window right after opening | BSC `src/components/Header.tsx` | Medium (a11y/UX regression relative to sibling site) | Verified (code diff) |
| 2 | No named clergy or PPC roster in data/content model | OLL `src/data/content.ts`, `/about` | Medium (trust/pastoral-tone gap) | Verified |
| 3 | No social media links/icons wired anywhere in the app | OLL `src/components/Footer.tsx`, `src/data/site.ts` | Medium (discoverability/engagement gap) | Verified |
| 4 | No dedicated volunteering page or role list | OLL (absent vs. BSC's `/serve`) | Low–Medium (weaker call-to-action for lay involvement) | Verified |
| 5 | No dedicated Sacraments page | BSC (absent vs. OLL's `/sacraments`) | Low (content is present, just less discoverable) | Verified |
| 6 | Images lack explicit dimensions / modern formats | Both, `SafeImage.tsx` + `public/images/*.jpg` | Low (CLS/performance) | Reasoned |
| 7 | Small gold-on-navy text contrast not measured against rendered pixels | Both, `index.css` tokens | Informational | Unverified |

---

## 10. Recommendations

**For Blessed Sacrament (Site A):**
1. Back-port OLL's window-level Escape-key listener into `Header.tsx` (~15 lines, additive).
2. Consider a dedicated `/sacraments` page mirroring OLL's pattern — the content already exists in prose form on Worship/Ministries and would benefit from deep-linkable, task-oriented anchors.

**For Our Lady of Lourdes (Site B):**
1. Add clergy/PPC data to `content.ts` and render it on `/about`, matching BSC's pattern — the component pattern already exists in the shared template and is a low-effort addition.
2. Wire up real social links in `site.ts` and reuse (or reintroduce) a `SocialIcons` component in the footer.
3. Add a `/serve` (or `/get-involved`) page with a concrete role list, giving lay volunteers an explicit next step, distinct from the general Ministries overview.

**For both:** add explicit `width`/`height` (or an aspect-ratio wrapper) to `SafeImage`, and consider serving AVIF/WebP with a JPG fallback, to remove a shared, easily-fixed CLS/performance risk.

---

## 11. Verification Ledger

| Check | Method | Result |
|---|---|---|
| Both URLs are live and served over HTTPS | `web_fetch` (HTML) against both production URLs | Verified — both returned 200 with full HTML/CSS |
| Repos share an identical component/file inventory | `git clone` + `diff -rq src/ src/` | Verified |
| Escape-key handling difference | Direct `diff`/`grep` of `Header.tsx` in both repos | Verified |
| Clergy/PPC/social/serve-page content gaps | `grep`/`diff` of `data/content.ts`, `data/site.ts`, `components/Footer.tsx`, `src/pages/*` file listing | Verified |
| Rendered visual layout, color contrast on real pixels, Lighthouse/perf scores | Not available — no headless-browser/screenshot tool in this environment | **Unverifiable in this session**; would require a browser-automation or screenshot tool against the live URLs to confirm pixel-level claims |
