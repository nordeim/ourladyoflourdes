---
name: ourladyoflourdes
displayName: "Our Lady of Lourdes — Singapore (Static SPA Parish Site)"
version: 1.0.0
last_updated: 2026-09-06
project_state: "52 src files / 71 Vitest unit tests + 31 Playwright E2E specs ×2 passes green — Vite 7 singlefile SPA, HashRouter, oll-* CSS-first @theme"
stack: "react 19.2.8 / vite 7.3.6 / tailwind 4.3.3 (@tailwindcss/vite 4.1.17) / typescript 5.9.3 / react-router 7.18.2 / vite-plugin-singlefile 2.3.3 / eslint 9.39.5 flat / vitest 3.2.6 jsdom / playwright 1.55.1 chromium"
rendering: "static SPA (HashRouter, no SSR)"
data_layer: "file-backed typed arrays in src/data/* + const site object"
deploy: "vite-plugin-singlefile → dist/index.html + dist/images/ + dist/_headers → Cloudflare Pages / S3 / GH Pages"
lineage: "blessed-sacrament-church → ourladyoflourdes (Marian redesign, oll-* tokens, 7 alias groups)"
---

# Our Lady of Lourdes — Engineering Skill v1.0.0

> **How to use:** This is the single source of truth for any future agent extending, debugging, onboarding, cloning, or re-porting the parish-site family. Read **§0 first** (volatile facts — the only place mutable numbers live), then §§1–4 for identity and constraints, §5 for where to put code, §§9–11 before shipping, §§15–20 as copy-pasteable contracts. Every version, hex, and path is verified against `package.json` / `src/index.css` / `tsconfig.json` / `src/data/*` — if it drifts, fix this file first.

**Sources of truth:** `README.md` (visitor, 60-sec) → `AGENTS.md` (agent ramp, 60-sec) → `CLAUDE.md` (deep workflow, 6-phase) → **this file** (complete distillate). If they conflict, trust executable config.

---

## Table of Contents

0. [Volatile Facts Register](#0-volatile-facts-register-single-source-of-truth)
1. [Project Identity & Design Philosophy](#1-project-identity--design-philosophy)
2. [Tech Stack & Environment](#2-tech-stack--environment)
3. [Bootstrapping & Configuration](#3-bootstrapping--configuration)
4. [The Design System (Code-First)](#4-the-design-system-code-first)
5. [Component Architecture & Patterns](#5-component-architecture--patterns)
6. [Custom Hooks Deep Dive](#6-custom-hooks-deep-dive)
7. [Content Management & Data Ingestion](#7-content-management--data-ingestion)
8. [Accessibility (WCAG AAA) Implementation](#8-accessibility-wcag-aaa-implementation)
9. [Anti-Patterns & Common Bugs](#9-anti-patterns--common-bugs)
10. [Debugging Guide](#10-debugging-guide)
11. [Pre-Ship Checklist](#11-pre-ship-checklist)
12. [Lessons Learnt & How to Avoid Them](#12-lessons-learnt--how-to-avoid-them)
13. [Pitfalls to Avoid](#13-pitfalls-to-avoid)
14. [Best Practices](#14-best-practices)
15. [Coding Patterns](#15-coding-patterns)
16. [Coding Anti-Patterns](#16-coding-anti-patterns)
17. [Responsive Breakpoint Reference](#17-responsive-breakpoint-reference)
18. [Z-Index Layer Map](#18-z-index-layer-map)
19. [Color Reference (Complete)](#19-color-reference-complete)
20. [The Complete TypeScript Interface Reference](#20-the-complete-typescript-interface-reference)
- [Appendix A — ADRs](#appendix-a--adrs-architecture-decision-records)
- [Appendix B — Live-Site Validation](#appendix-b--live-site-validation)
- [Appendix C — The Meticulous Approach (6-Phase Workflow)](#appendix-c--the-meticulous-approach-6-phase-workflow)
- [Appendix D — Lineage & Migration History](#appendix-d--lineage--migration-history)
- [Quick Reference Card](#quick-reference-card)

---

## 0. Volatile Facts Register (SINGLE SOURCE OF TRUTH)

> Contract: this table is the only authoritative statement of every mutable fact. If any other section or `README`/`AGENTS`/`CLAUDE` disagrees, **this table wins until re-verified, then all copies are fixed in the same commit**.

| Fact | Value (as of 2026-09-06) | Where else referenced |
|---|---|---|
| Package version | `1.0.0` (`package.json` `private:true`) | §1, §2, README badges |
| This SKILL version | `1.0.0` (skill axis — independent) | frontmatter |
| Node / package manager | `node >=20`, `bun` primary (`bun.lock` frozen), `npm --legacy-peer-deps` fallback | §2, §3, AGENTS |
| Unit tests | **12 files / 71 tests — green** | §2, §11, App C |
| E2E tests | **31 specs — green ×2 passes** (dev `:3000` + built `:4173` `vite preview`) | §2, §11, App B |
| `src/` inventory | **52 files** (incl. 12 `*.test.ts` + `src/test/setup.ts`) | §5 |
| `public/images/` | **9 jpgs** (`hero-church`, `main-church`, `grotto`, `interior`, `stained-glass`, `liturgical`, `formation`, `pastoral`, `community`) | §5, §11 |
| Build artifact | `dist/index.html` singlefile + `dist/images/` (9) + `dist/_headers` | §2, §11 |
| Design tokens | **33 entries** in `@theme` — 6 `oll-cream/parchment/stone/ink/charcoal` + `oll-blue 50–950` (11) + `oll-gold 100–700` (7) + `oll-rose` (5) + `oll-sage` (4) + 2 shadows + 6 radii | §4, §19 |
| Utilities | **~27 utilities + 8 keyframes** + themed scrollbar + `prefers-reduced-motion` kill + print reveal override | §4 |
| Hooks | **3** — `useScrolled`, `useScrollProgress`, `useScrollSpy` | §6 |
| Utils | **4** — `cn`, `massDay`, `categoryTone`, `deepLinks` | §5, §7 |
| Routes | **10 canonical + 7 alias paths + `*`** (`*` → `NotFound`), **9 section anchors** | §5 |
| CSP | `script-src` hash-pinned in `dist/` (`sha256-…`), `style-src` keeps `unsafe-inline`, dev keeps `unsafe-inline` | §3, §11 |
| `public/_headers` | 5 headers (`nosniff`, `SAMEORIGIN`, `strict-origin-when-cross-origin`, `Permissions-Policy`, `HSTS 31536000`) | §3, §11 |
| Hygiene | `docs/ssh-key.txt` `.gitignore`'d + `src/repo-hygiene.test.ts` — still in `git log` history, rotate key | §3, §11 |
| `skills/` policy | Intentionally **tracked** (`skills/skills-catalog.md` is tooling contract) — tooling excludes it from lint/typecheck/watch | §3 |
| No env / no DB / no auth | Static site — no `.env`, no `VITE_*` today | §2, §3 |
| Teaching lineage | `blessed-sacrament-church` → `ourladyoflourdes` | §1, App D |

---

## 1. Project Identity & Design Philosophy

**One sentence:** A reverent, editorial parish site for **Church of Our Lady of Lourdes — 50 Ophir Road, Rochor, Singapore 188690** — the city's Gothic Revival Tamil Church (completed 13 May 1888, National Monument 2005, the Indian Church), at prayer in English and Tamil under one spire since the Basilica-at-Lourdes mould was set in 1886.

**The parish in one breath:** 1856 Fr Pierre Paris gathers Indian Catholics at Sts Peter and Paul, Queen Street — 1884 the Ministry for Indians is established and Bishop Gasnier tasks Fr Meneuvier to learn Tamil and build — **13 May 1888** the gothic church is completed on Ophir Road — 1888 Our Lady of Lourdes School opens in the compound — 1958–59 Fr Fortier restores the 15 clerestory Rosary windows broken in WWII — 2000 migrant-worker centre — 2009 National Monument restoration S$1.75m — 2010s S$6.5m renewal — today English + Tamil households, Rosary/Divine Mercy devotions, adoration 8am–8pm, reconciliation 15 min before every Mass.

**Parish constants (canonical in `src/data/site.ts` + `index.html` JSON-LD)**

| Fact | Value | Source |
|---|---|---|
| Name | Church of Our Lady of Lourdes (`shortName` Our Lady of Lourdes) | `site.name` |
| Tagline | Two tongues, one faith, one family. | `site.tagline` |
| Address | 50 Ophir Road, Singapore 188690 | `site.address.full` (+ `query` getter for maps) |
| Phone / email | +65 6294 0624 / `colol.secretariat@catholic.org.sg` (office) / `colol.mtn@catholic.org.sg` (bookings) | `site.contact` |
| Mass | Weekday EN 12:30 / TA 19:00 · Sat 17:00/18:15/19:30 EN · Sun 08:00 EN / 09:30 TA / 11:00 EN / 12:30 EN / 18:30 TA · Public holiday 09:00 EN / 10:00 TA | `site.mass` |
| Hours | church 8–20 · office 9–17 Mon–Fri · reception 9–17 · adoration 8–20 | `site.hours` |
| Transport | Rochor DT13 · Bugis EW12/DT14 | `site.transport` |
| Feast | Our Lady of Lourdes — 11 February | `site.feast` |
| Cheque | Church of Our Lady of Lourdes | `site.chequePayee` |
| Maps | `google.com/maps?q=50+Ophir+Road,+Singapore+188690` | `site.mapsUrl` / `mapsEmbedSrc` |

**Design thesis — "The grotto in the city"**

Marian blue (`oll-blue` 50–950, recalling the Lourdes apparition and the blue-trimmed gothic spire), warm gold of sanctuary candlelight, rose for the Mystical Rose, sage for formation — on warm parchment/cream. Generous whitespace is structure, not emptiness. **Cormorant Garamond** (display) + **Source Sans 3** (body). Sacred motion: `rise-in` hero entrance, `bloom-drift` texture, `card-lift` on hover, `page-in` route transition — every motion killed under `prefers-reduced-motion`.

**Non-negotiable rules**

1. **Parish fidelity over pixel theft** — rephrase narrative, preserve Singapore facts exactly (1856–Today timeline, 50 Ophir Road, Mass bilingual schedule, PH note). Never invent UEN/socials (guarded by `src/data/site.test.ts` `not.toHaveProperty`).
2. **Single-file deployable** — `dist/index.html` must remain shippable to GH Pages/S3/Cloudflare without a server. No SSR/API until an ADR says so.
3. **Static-first data** — copy lives in `src/data/*` (typed arrays + `as const` site object); no CMS until requested.
4. **Accessibility is doctrinal** — keyboard, contrast, motion — see §8.
5. **Fail-closed security** — CSP hash injection + hygiene guards block drift; never weaken them — see §11.

**Anti-generic mandate:** Reject `Inter`/`Roboto` safety, purple-on-white clichés, predictable 3-col hero grids. Whitespace is structure. Editorial radii (sharp chapel corners, pill chips) are deliberate.

---

## 2. Tech Stack & Environment

| Layer | Technology | Locked Version | Critical Note |
|---|---|---|---|
| UI | `react` / `react-dom` | `19.2.8` | hooks-only, no classes; `StrictMode` in `src/main.tsx` |
| Routing | `react-router-dom` | `7.18.2` | `HashRouter` — static hosts, no fallback |
| Build | `vite` / `@vitejs/plugin-react` | `7.3.6` / `5.2.0` | `node >=20`, HMR, alias `@→src` |
| Bundling | `vite-plugin-singlefile` | `2.3.3` | inlines JS+CSS into `dist/index.html`; `public/images/` → `dist/images/` (not inlined) |
| Styling | `tailwindcss` / `@tailwindcss/vite` | `4.3.3` / `4.1.17` | **CSS-first `@theme` inline** — no `tailwind.config.*` |
| Language | `typescript` / `@types/react` / `@types/react-dom` / `@types/node` | `5.9.3` / `19.2.18` / `19.2.5` / `22.20.1` | `strict` + `noUnusedLocals/Params` — breaches fail `tsc` |
| Icons | `lucide-react` | `1.38.0` | header/footer + Home/Give icons |
| Utils | `clsx` / `tailwind-merge` | `2.1.1` / `3.6.0` | `cn() = twMerge(clsx(...))` — only merge path |
| Fonts | Google Fonts (CDN, `index.html`) | — | `Cormorant Garamond` 400/500/600/700 + `Source Sans 3` 300–700 |
| Tests | `vitest` / `jsdom` / `testing-library` | `3.2.6` / `26.1.0` / `16.2.0` (+ `jest-dom 6.6.3`, `user-event 14.5.2`) | `globals:true`, `setupFiles: src/test/setup.ts` |
| E2E | `playwright` (`@playwright/test`) | `1.55.1` | `chromium` channel, 31 specs ×2 passes |
| Lint | `eslint` / `typescript-eslint` / `eslint-plugin-react-hooks` / `eslint-plugin-react-refresh` / `globals` / `@eslint/js` | `9.39.5` / `8.28.0` / `5.2.0` / `0.4.19` / `16.1.0` / `9.39.5` | flat config, `--max-warnings 0` |

> All versions pinned exact (no `^`) in `package.json` (`bun.lock` frozen). `package.json` version is `1.0.0` (SKILL version `1.0.0` is a separate axis).

**Environment:** No `.env`, no DB, no auth, no docker. `bun` is the supported manager (`--frozen-lockfile` in CI). `npm` works only with `npm install --legacy-peer-deps` (typescript-eslint 8.28.0 peer predates TS 5.9 — `npm ci` alone fails). `skills/` is vendored reference content — intentionally **tracked** (`skills/skills-catalog.md` is tooling contract); tooling (`eslint` ignores, `tsconfig` not included, `vite` `server.watch.ignored`) still excludes it — never import or lint it. No `package-lock.json` in repo. `docs/ssh-key.txt` was accidentally tracked (`0be0fe8`) and untracked in `0b…` (`git rm --cached`; `repo-hygiene` guard now fails if it re-enters) — **rotate the key**; history still contains it.

**Test harness (2026-09-06, authoritative counts in §0)**

| Suite | Status | Detail |
|---|---|---|
| `vitest` (`bun run test`) | **12 files / 71 tests — green** | `csp-build-contract 7` + `content 9` + `site 8` + `headers 5` + `token-integrity 2` + `deepLinks 5` + `massDay 5` + `ci-workflow 7` + `categoryTone 5` + `cn 5` + `repo-hygiene 5` + `nav 8` via `src/test/setup.ts` (jest-dom + IntersectionObserver mock + scrollTo/matchMedia stubs) |
| `playwright` (`bun run test:e2e`) | **31 specs — green** | `smoke` + `navigation` + `aliases-deep-links` + `worship-sacraments` — chromium `:3000` |
| `playwright` built (`bun run test:e2e:built`) | **31 specs — green** | same 31 vs `dist/` via `vite preview :4173` (`playwright.built.config.ts`; `E2E_BASE_URL` → live host) |
| `lint` / `typecheck` / `build` | green on fresh clone | `eslint 9.39.5 --max-warnings 0`, `tsc --noEmit` strict, `viteSingleFile` → `dist/index.html` |

---

## 3. Bootstrapping & Configuration

### 3.1 From Zero to Running

```bash
git clone <repo-url> ourladyoflourdes && cd ourladyoflourdes
bun install --frozen-lockfile
# npm users: npm install --legacy-peer-deps

bun run dev                # → http://localhost:3000 (Vite HMR)
bun run lint               # → eslint 9.39.5 flat — must be clean
bun run typecheck          # → tsc --noEmit — must be silent
bun run test               # → vitest 3.2.6 jsdom — 12 files / 71 tests green
bun run test:e2e           # → playwright 1.55.1 chromium — 31 specs green
bun run test:e2e:built     # → same 31 vs dist/ via vite preview :4173
bun run build              # → dist/index.html + dist/images/ + dist/_headers
bun run preview            # → http://localhost:4173
```

**Pre-push gate — all five must be green (six with the built E2E pass):**

```bash
bun run lint && bun run typecheck && bun run test && bun run build && bun run test:e2e:built
# dev E2E: bun run test:e2e   (optional local)
```

### 3.2 Critical Config Files

| File | Purpose | Gotcha |
|---|---|---|
| `vite.config.ts` | `plugins: [react(), tailwindcss(), viteSingleFile()]` + `resolve.alias["@"]` + `test { globals, jsdom, setupFiles: src/test/setup.ts, include: src/**/*.{test,spec}, exclude: [e2e/**, playwright-report/**] }` + `server.watch.ignored` | `test.exclude` keeps `e2e/**` out of unit runs; `server.watch.ignored` prevents `ENOSPC` from vendored `skills/` + `blessed-sacrament-church/` |
| `tsconfig.json` | `ES2020`/`ESNext`/`bundler`/`react-jsx`/`strict`/`noUnused*`/`isolatedModules`/`noEmit` + `paths {"@/*":["src/*"]}` | `@` must stay in sync (vite ↔ tsconfig). Adding a file outside `src/` requires expanding `include` |
| `eslint.config.js` | flat (`@eslint/js` + `typescript-eslint` + `react-hooks` + `react-refresh` + `globals`) — ignores `dist/node_modules/coverage/playwright-report` and `skills` | `--max-warnings 0`. `bun run lint:fix` → `eslint . --fix` |
| `playwright.config.ts` | `chromium` (`channel: "chromium"`), `webServer: pnpm exec vite --port 3000`, `reuseExistingServer: !CI`, `expect.timeout: 15s` | `testDir: e2e`, `baseURL: http://localhost:3000` |
| `playwright.built.config.ts` | Extends base — `baseURL = E2E_BASE_URL ?? http://127.0.0.1:4173`; `webServer: vite preview --port 4173` (skipped when `E2E_BASE_URL` set) | Built-artifact pass exists because singlefile rewrites root-relative refs — dev-only assertions fail on `dist/` |
| `index.html` | `lang en`, CSP meta (`script-src 'self' 'unsafe-inline'` in source → `sha256-…` in `dist/`), OG/Twitter, JSON-LD `Church`, `preconnect` fonts, `#root` + `src/main.tsx` | CSP allows `self` + Google Fonts; `img-src 'self' data: blob:` (all images local), `frame-src https://www.google.com` (maps) |
| `.github/workflows/ci.yml` | `bun` CI: `lint → typecheck → test → build (CSP-injected) → test:e2e:built` + artifact uploads | Drift-guarded by `src/ci-workflow.test.ts` |
| `src/index.css` | `@import "tailwindcss"` + `@theme` 33 tokens + `@layer base/utilities` | **Only** token source; no `tailwind.config.*` |
| `.gitignore` | Ignores `node_modules/`, `dist/`, `playwright-report/`, `*.pem`/`ssh-key*`/`docs/ssh-key.txt`, `blessed-sacrament-church/` | `skills/` is tracked — ignore entry is inert for tracked files |
| `public/_headers` | Cloudflare `_headers` — 5 host security headers | Must stay `/*` + indented `Header: value` lines — no stray `*/` |

**Env vars:** None. `VITE_*` prefix convention applies if added; guard with `src/env.d.ts` (`import.meta.env`). Document new vars in `README.md` + `AGENTS.md` + `CLAUDE.md` + this §.

---

## 4. The Design System (Code-First)

**Single source:** `src/index.css` `@theme` block — no `tailwind.config.*`. Tokens are the Marian palette — **unchanged philosophy from the `blessed-sacrament-church` line** — but re-keyed `bsc-*` → `oll-*`.

### 4.1 Tokens (`@theme` — 33 entries, authoritative)

```css
@theme {
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Source Sans 3", system-ui, sans-serif;

  --color-oll-cream: #f8f5ef;
  --color-oll-parchment: #efe9da;
  --color-oll-parchment-dark: #e3dac4;
  --color-oll-stone: #d5cab1;
  --color-oll-ink: #1d2230;
  --color-oll-charcoal: #3b4150;

  --color-oll-blue-50: #eef3fc;
  --color-oll-blue-100: #d7e2f6;
  --color-oll-blue-200: #b1c5ec;
  --color-oll-blue-300: #7f9fde;
  --color-oll-blue-400: #5478cb;
  --color-oll-blue-500: #3a5fae;
  --color-oll-blue-600: #2c4a8e;
  --color-oll-blue-700: #233a71;
  --color-oll-blue-800: #1c2e59;
  --color-oll-blue-900: #121e3c;
  --color-oll-blue-950: #0a1428;

  --color-oll-gold-100: #f5eacc;
  --color-oll-gold-200: #ebd599;
  --color-oll-gold-300: #dfc06a;
  --color-oll-gold-400: #d4ad42;
  --color-oll-gold-500: #c49a2c;
  --color-oll-gold-600: #a67f22;
  --color-oll-gold-700: #85641c;

  --color-oll-rose-50: #f8edf0;
  --color-oll-rose-300: #d7a1b0;
  --color-oll-rose-400: #c07a8e;
  --color-oll-rose-500: #a55d74;
  --color-oll-rose-600: #8a4a5f;

  --color-oll-sage-50: #eef4ef;
  --color-oll-sage-300: #86a98b;
  --color-oll-sage-500: #41684a;
  --color-oll-sage-600: #2f4f37;

  --shadow-oll: 0 20px 60px -20px rgba(10, 20, 40, 0.45);
  --shadow-oll-lg: 0 40px 90px -30px rgba(10, 20, 40, 0.55);

  --radius-xs: 0.125rem;
  --radius-sm: 0.125rem;
  --radius-md: 0.1875rem;
  --radius-lg: 0.25rem;
  --radius-xl: 0.25rem;
  --radius-2xl: 0.375rem;
}
```

### 4.2 Typography

| Role | Font | Weights | Tracking | Class |
|---|---|---|---|---|
| Display (h1–h4, hero, quote) | `Cormorant Garamond` | 400/500/600/700 + italic 400/500 | `tracking-tight` / eyebrow `[0.25em]` | `font-display` |
| Body (p, li, nav, label) | `Source Sans 3` | 300/400/500/600/700 | `tracking-wide` | `font-body` on `body` |
| Eyebrow (light) | — | 600 | `[0.3em]` uppercase | `text-oll-gold-300 text-xs` |
| Eyebrow (dark) | — | 600 | `[0.25em]` | `text-oll-blue-700` |

### 4.3 Utilities & Keyframes (complete register — `src/index.css` `@layer utilities`)

| Utility | CSS | Purpose |
|---|---|---|
| `.text-balance` | `text-wrap: balance` | hero + headings |
| `.bg-grain` | `::before` noise SVG `opacity .04` | grain on dark bands |
| `.bg-adobe-texture` | `oll-parchment` + stone SVG pattern | adobe wash |
| `.divider-weave` | repeating stone/transparent 8px | `Footer` weave strip |
| `.gold-rule` | centered gold gradient 1px | section dividers |
| `.hero-ken-burns` | `scale 1→1.05` 20s ease-out | hero slow zoom |
| `.reveal` / `.reveal-visible` | `translateY 24→0`, `opacity 0→1`, `0.7s cubic-bezier(0.22,1,0.36,1)` | `Reveal.tsx` scroll-reveal |
| `.rise-in` + `.rise-in-d1..d4` | `translateY 20→0`, delays 90/180/280/380ms | staged hero entrance |
| `.menu-in` / `.drawer-in` | `translateY -4/-12→0` 0.18/0.24s | dropdown / mobile drawer entrance |
| `.page-in` | route-transition entrance | `Layout.tsx` keyed `page-in` container |
| `.card-lift` | hover `translateY -4` + `shadow-oll` + gold border | card hover |
| `.img-zoom` | `scale` interior drift | grounds/ministries image hover |
| `prefers-reduced-motion` | global `0.01ms` kill in `@layer base` | a11y |
| `@media print` reveal override | instant visible | print |

**Keyframes (8):** `gold-rule-draw` · `hero-ken-burns` · `rise-in` · `menu-in` · `drawer-in` · `halo-pulse` · `page-in` · (plus `reveal` via transition) — all killed under `prefers-reduced-motion`. Themed scrollbar in `@layer base`.

### 4.4 Shadows & Radii

- Shadows: `shadow-oll` (default) + `shadow-oll-lg` (elevated cards/dropdowns).
- Radii: `rounded-sm` (buttons/cards) + `rounded-xl` (Accordions) + `rounded-full` (chips/dots). Don't introduce `rounded-xl` without rationale — the editorial vocabulary is `sm` for cards, `full` for chips.

**Verification:** `grep -c "oll-" src/index.css` counts tokens; `grep --color "shrine-\|oll-" src/index.css` pattern; `src/token-integrity.test.ts` computes ratios — see §10.

---

## 5. Component Architecture & Patterns

### 5.1 Layer Map (SPA — no backend layers)

```
index.html (#root) → src/main.tsx (StrictMode + createRoot + #root guard + resolveHashRedirect pre-mount)
  → src/App.tsx (HashRouter + Routes + Layout outlet)
    → Layout (Header / Outlet / Footer) + ScrollProgress + BackToTop + SkipLink + keyed page-in
      → Pages (10) → ui/* primitives → utils/cn
      → data/* (nav + content + site) — SSOT, typed
```

No global store, no API layer, no `server/` — add only with an ADR (Appendix A).

### 5.2 Directory Inventory (52 files — authoritative in §0)

```
src/
  App.tsx                 # HashRouter + 19 Route entries (10 canonical + 7 aliases + * + index)
  main.tsx                # StrictMode + createRoot + #root guard + resolveHashRedirect pre-mount
  index.css               # @theme 33 tokens + @layer base/utilities
  components/
    Layout.tsx            # Outlet + hash-aware scroll restore (double-hash, 80ms, cleanup) + ScrollProgress + keyed page-in
    Header.tsx            # z-50 maroon bar (solid = scrolled||!isHome||mobileOpen), useScrolled(16), hover/focus dropdown, modal drawer (dialog + focus trap)
    Footer.tsx            # 4-col + divider-weave + site.ts address/flows + Archdiocese/Readings links
    PageHero.tsx          # oll-blue-950 hero (compact?, bg-grain, dual gradients, divider-weave)
    SafeImage.tsx         # local fallback (default /images/hero-church.jpg, lazy, onError→dataset.fallback guard)
    Emblem.tsx            # inline SVG emblem (gothic arch + Marian star, currentColor)
    SkipLink.tsx          # skip-to-#main-content (preventDefault + imperative focus, never rewrites hash)
    ScrollProgress.tsx    # fixed gold rail (h-[3px], scaleX via useScrollProgress, aria-hidden, z-[60])
    BackToTop.tsx         # threshold 480 + SVG progress ring + reduced-motion, hash-safe
    Timeline.tsx          # gradient rail + display-serif gold years + Reveal per entry + dot-pulse halos
    EventMeta.tsx         # categoryTone chip + date
    ui/
      Button.tsx          # discriminated union (to/href/button) + icon, 4 variants, cn()
      Container.tsx       # max-w-7xl mx-auto px-5 sm:px-8
      SectionHeading.tsx  # eyebrow? / title / description + align/light + gold-rule-left
      Accordion.tsx       # FAQ single-open, ArrowUp/Down/Home/End, Plus rotate-45, grid-rows animation
      Reveal.tsx          # IntersectionObserver 0.15 threshold, fallback visible, prefers-reduced-motion
  hooks/
    useScrolled.ts
    useScrollProgress.ts
    useScrollSpy.ts       # Ministries jump-nav scrollspy
  pages/                  # Home, About, History, Worship, Ministries, NewsEvents, Give, FAQ, NotFound (10)
  data/
    nav.ts                # primaryNav (6) / footerNav (10) — NavItem/NavLink
    content.ts            # 8 interfaces + 7 arrays + devotions + images (9 local)
    site.ts               # as const — hours(6) + mass(8) + contact + transport + feast + url/ogImage
  utils/
    cn.ts                 # twMerge(clsx)
    massDay.ts            # massDayKey(date): 'weekdays'|'saturday'|'sunday'
    categoryTone.ts       # Parish→blue, Devotion→gold, Formation→sage, Archdiocese→rose
    deepLinks.ts          # knownRoutePaths (17) + resolveHashRedirect
  test/
    setup.ts              # jest-dom + IntersectionObserver mock + scrollTo/matchMedia stubs
  **/*.test.ts            # 12 files / 71 tests
```

### 5.3 Client vs Server

**All components are client components** — no RSC, no `use server`. SPA mental model: React 19 hooks (`useState`/`useEffect`/`useLocation`) only.

### 5.4 Routing Contract (`src/App.tsx` — 19 entries = 10 canonical + 7 aliases + index `/` + `*`)

```tsx
// HashRouter is intentional — static GH Pages/S3/Cloudflare without fallback
<Routes>
  <Route element={<Layout />}>
    <Route index element={<Home />} />              {/* / */}
    <Route path="/about" element={<About />} />
    <Route path="/history" element={<History />} />
    <Route path="/history-of-the-church" element={<History />} /> {/* alias */}
    <Route path="/worship" element={<Worship />} />
    <Route path="/mass-times" element={<Worship />} />   {/* alias */}
    <Route path="/contact-us" element={<Worship />} />   {/* alias */}
    <Route path="/sacraments" element={<Sacraments />} />
    <Route path="/all-sacraments" element={<Sacraments />} /> {/* alias */}
    <Route path="/ministries" element={<Ministries />} />
    <Route path="/all-ministries" element={<Ministries />} /> {/* alias */}
    <Route path="/news-events" element={<NewsEvents />} />
    <Route path="/news-and-events" element={<NewsEvents />} /> {/* alias */}
    <Route path="/parish-bulletin" element={<NewsEvents />} />
    <Route path="/church-events" element={<NewsEvents />} />
    <Route path="/give" element={<Give />} />
    <Route path="/donate" element={<Give />} />      {/* alias */}
    <Route path="/faq" element={<FAQ />} />
    <Route path="*" element={<NotFound />} />
  </Route>
</Routes>
```

**Alias groups (5):** `worship: mass-times,contact-us` · `history: history-of-the-church` · `sacraments: all-sacraments` · `ministries: all-ministries` · `news-events: news-and-events,parish-bulletin,church-events` · `give: donate`.

**Path-style deep links:** `main.tsx` calls `resolveHashRedirect` *before* mount — `ourladyoflourdes.sg/worship` (no `#`) rewrites to `#/worship`. `knownRoutePaths` is `as const` and drift-guarded (`utils/deepLinks.test.ts` 5 tests + `src/data/nav.test.ts`).

**Hash anchors (9):** `worship#mass` `#confession` `#visit` · `sacraments#infant-baptism` `#matrimony` `#reconciliation` `#anointing` · `ministries#liturgical` `#formation` `#pastoral` `#community`. Must use `<Link to="/ministries#liturgical">`, never `<a href="#liturgical">`.

**Rule:** New route → add alias if external links/bookmarks expect it. Keep `Layout.tsx` hash logic intact (double-hash aware, `getElementById` + `scrollIntoView({smooth})` 80ms, fallback `scrollTo(0,0)`).

### 5.5 Component Conventions

| Primitive | File | API | Rule |
|---|---|---|---|
| `Button` | `ui/Button.tsx` | discriminated `to`/`href`/`button` + `variant` `primary/secondary/ghost/outline-light` + `icon?` | `to→<Link>`, `href→<a>`, else `<button>`; `cn()` + focus ring; icons `aria-hidden` |
| `Container` | `ui/Container.tsx` | `children, className?` | All sections wrap in `<Container>` |
| `SectionHeading` | `ui/SectionHeading.tsx` | `eyebrow?, title, description?, align?, light?` | Eyebrow renders `gold-rule-left` |
| `PageHero` | `PageHero.tsx` | `eyebrow, title, description?, image, compact?` | `compact` shrinks padding; `bg-grain` + dual gradients |
| `SafeImage` | `SafeImage.tsx` | `src, fallback?, alt, lazy, onError→dataset.fallback` | Wraps `<img>` with single-swap guard; don't use bare `<img>` |
| `Accordion` | `ui/Accordion.tsx` | `items: {id,question,answer}[]` | Single-open, `grid-rows` animation, Arrow keys + Home/End |
| `Header` | `Header.tsx` | `useScrolled(16)`, `mobileOpen`, `desktopOpen`, Escape + outside-tap + focus trap | Fixed `oll-blue-950` bar (`solid = scrolled\|\|!isHome\|\|mobileOpen`), `aria-haspopup/expanded`, modal `role=dialog` + `aria-modal` |
| `Reveal` | `ui/Reveal.tsx` | `children, delay?, as?` | IO 0.15 threshold + `prefers-reduced-motion` fallback |

---

## 6. Custom Hooks Deep Dive

### `useScrolled(threshold = 12): boolean` — `src/hooks/useScrolled.ts` (10 lines)

```ts
export function useScrolled(threshold = 12): boolean {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}
```

- **Why `passive: true`:** prevents blocking the main thread on scroll.
- **Why `Header` passes `16`:** delays transparent→solid on Home hero (4px more breathing room, intentional — not default `12`).
- **Initial call:** `onScroll()` on mount ensures correct state on deep-linked reload.

### `useScrollProgress(): number` — `src/hooks/useScrollProgress.ts` (34 lines)

```ts
const rafRef = useRef<number>(0);
useEffect(() => {
  const onScroll = () => {
    if (rafRef.current) return;           // coalesce
    rafRef.current = requestAnimationFrame(() => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? window.scrollY / docHeight : 0;
      setProgress(Math.min(1, Math.max(0, p)));
      rafRef.current = 0;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => {
    window.removeEventListener("scroll", onScroll);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0; // round-16 StrictMode double-mount fix
  };
}, []);
```

- **`requestAnimationFrame` coalescing:** scroll fires at 60–120 Hz; rAF throttles to one `setProgress` per frame.
- **Unscrollable guard:** `docHeight > 0 ? … : 0` — short pages don't divide by zero.
- **StrictMode fix:** `rafRef.current = 0` in cleanup — double-mount ran `effect→cleanup→effect` on one instance and permanently disabled the hook without it (round-16).
- **No dependencies:** stable for the page lifecycle; used by `ScrollProgress.tsx` (`scaleX` gold rail) + `BackToTop.tsx` (SVG ring).

### `useScrollSpy(ids: string[]): string` — `src/hooks/useScrollSpy.ts` (53 lines)

- **Purpose:** Ministries jump-nav pill highlights the section in the viewport's middle band.
- **Observer:** single `IntersectionObserver` with `rootMargin: "-45% 0px -50% 0px"`, `threshold: 0` — isolates the thin band at 45–50% viewport height (where the eye sits). Batched entries resolved by **reverse document order** (`[...ids].reverse().find`) — deepest wins — not delivery order. Holds position when nothing intersects.
- **Fallback:** `ids[0]` initially; tolerates missing elements (`getElementById` null filtered); `try/catch` around `new IntersectionObserver` (e.g., jsdom).
- **Re-render guard:** effect dep is `ids.join("|")` (string), so inline literal arrays like `["liturgical","formation"]` don't cause infinite loops. Caller may use module-constant or inline arrays — both safe.
- **Cleanup:** `observer.disconnect()` on unmount.

---

## 7. Content Management & Data Ingestion

**No CMS, no API — file-backed SSOT.** All parish copy lives in `src/data/*`; pages are renderers. Contract tests forbid invention.

### 7.1 Data Files (3 files, 8 interfaces, 7 arrays)

| File | Exports | Count | Guard |
|---|---|---|---|
| `src/data/site.ts` | `site as const` — `name/shortName/tagline/vision`, `address` (`full`/`query` getters), `hours` (6), `mass` (8 keys: weekdayRosary/DivineMercy/weekdayEN/TA/saturday/saturdayRosary/sunday[5]/publicHoliday[2]/confession/adoration/note), `contact` (officePhone/email/bookingsEmail), `transport`, `feast`, `chequePayee`, `archdiocese/holySee/myCatholic/dailyReadings`, `mapsUrl/mapsEmbedSrc`, `url/ogImage` | 1 object | `site.test.ts` 8 tests |
| `src/data/nav.ts` | `primaryNav: NavItem[6]` (Home standalone; About/Worship/Sacraments/Ministries with `children`; News & Events standalone) + `footerNav: NavLink[10]` | 6 + 10 | `nav.test.ts` 8 tests |
| `src/data/content.ts` | `lifeTimeline: TimelineEntry[9]` (1856–Today) · `grounds: GroundsPlace[3]` · `sacraments: Sacrament[7]` · `ministries: Ministry[4]` · `faqs: FaqItem[6]` · `upcomingEvents: EventItem[6]` · `givingOptions: GivingOption[6]` · `devotions[4]` · `images` (9 local) | 7 arrays | `content.test.ts` 9 tests |

### 7.2 Locked Arrays — Why They Matter

`site.sunday[5]` must be exactly 5 (Sat 3 EN + Sun 3 EN/2 TA + weekday split); `upcomingEvents[6]` maps 1:1 to the Home/NewsEvents cards with `categoryTone`; `faqs[6]` is the single-open Accordion contract (one `openId`). Adding a 7th FAQ without updating the Accordion default `openId = items[0].id` changes the initial-open behavior — the test guards this.

### 7.3 How to Add Content (3-file procedure, verified)

**Add a ministry:**

1. `src/data/content.ts` — append to `ministries[]` with `id/title/summary/description/details[5]/image/imageFallback/imageAlt` (image must exist in `public/images/`; fallback points to another `public/images/` file).
2. `src/data/content.test.ts` — add a `ministries` length/assertion (or update the expected count).
3. `src/pages/Ministries.tsx` — no code change needed (it maps `ministries`); but if the new ministry needs a new hash anchor, add its `id` to the jump-nav `ids` array and to `useScrollSpy(ids)`.

**Add an FAQ:**

1. `src/data/content.ts` — append to `faqs[]`.
2. `src/components/ui/Accordion.tsx` is driven by `faqs` via `FAQ.tsx` — single-open (`openId: string | null`, `items[0].id` default). No limit, but long lists overflow the veil on mobile.

**Add a legacy alias:**

1. `src/App.tsx` — add `<Route path="/old-path" element={<NewPage />} />`.
2. `src/utils/deepLinks.ts` — add the path to `knownRoutePaths as const`.
3. `src/utils/deepLinks.test.ts` + `e2e/aliases-deep-links.spec.ts` — update the alias assertion.

**Never:** hardcode copy strings in `src/pages/*` or `src/components/*` — always go through `src/data/*`.

---

## 8. Accessibility (WCAG AAA) Implementation

| Concern | Implementation | Where | Verify |
|---|---|---|---|
| **Color contrast** | `oll-ink #1d2230` on `oll-cream #f8f5ef` (~15:1), `oll-cream` on `oll-blue-950 #0a1428` (~14:1), `oll-gold-400 #d4ad42` only as rule/accent (never body text) — token layer in `src/index.css` | `src/index.css` `@theme` | `src/token-integrity.test.ts` computes ratios |
| **Focus ring** | `outline: 2px solid oll-gold-400; outline-offset: 3px` on `:focus-visible` | `src/index.css` `@layer base` | tab through header → gold ring |
| **Skip link** | `SkipLink.tsx` — `fixed z-[100] -translate-y-24 → focus:translate-y-0` + `preventDefault` + imperative `focus()` on `#main-content`; never rewrites the hash (HashRouter) | `src/components/SkipLink.tsx` + `Layout.tsx` `tabIndex={-1}` | `e2e/smoke.spec.ts` skip-link assertion |
| **Drawer a11y** | `Header.tsx` modal: `role="dialog"` + `aria-modal="true"` + `aria-label="Site menu"` + initial `focus()` on panel + `Tab`/`Shift+Tab` trap via `handleDrawerKeyDown` + `Escape` closes + outside `pointerdown` closes (hamburger excluded) + focus restored to `hamburgerRef` + `document.body overflow: hidden` | `src/components/Header.tsx` | `e2e/navigation.spec.ts` drawer assertions |
| **Accordion a11y** | Single-open (`openId`), `aria-expanded` per button, `aria-controls` via `baseId-panel-index`, ArrowDown/Up/Home/End Roving, `grid-rows` animation (never `hidden`) | `src/components/ui/Accordion.tsx` | `e2e/smoke.spec.ts` FAQ accordion |
| **Motion** | Global `prefers-reduced-motion: reduce` kills all durations (`0.01ms`), `ScrollProgress`/`BackToTop` instant, `Reveal.tsx` fallback to visible | `src/index.css` `@layer base` + `Reveal.tsx` `try/catch` + `matchMedia` mock | `src/test/setup.ts` stub |
| **Touch targets** | Hamburger `h-11 w-11` (44px), drawer links `py-3`, Buttons `px-5 py-2.5` | `Header.tsx`, `Button.tsx` | mobile viewport 844px (`e2e/helpers.ts`) |
| **Alt text** | Every `<img>` via `SafeImage` has `imageAlt`; decorative `PageHero` image is `alt=""` | `src/data/content.ts` `imageAlt` + `SafeImage.tsx` | `src/data/content.test.ts` |
| **Page title** | `index.html` `<title>Church of Our Lady of Lourdes — Singapore</title>` + JSON-LD `Church` schema | `index.html` | `e2e/smoke.spec.ts` title check |

---

## 9. Anti-Patterns & Common Bugs

| # | Anti-Pattern | Symptom | Root Cause | Fix | Lesson |
|---|---|---|---|---|---|
| 1 | **`bsc-*` vs `oll-*` token mix** | Blue not rendering, `oll-blue-950` missing | Copy-pasting from `blessed-sacrament-church` without re-keying | `rg bsc- src/` must return 0 — tokens re-keyed globally | Always `rg` old token prefix after port |
| 2 | **`tailwind.config.*` added** | V4 build ignores it, tokens not applied | Tailwind v4 is CSS-first — file is inert | Delete it; tokens live only in `src/index.css` `@theme` | See ADR-3 |
| 3 | **`BrowserRouter` for static host** | Direct URL / refresh → 404 (GH Pages/S3) | Static hosts have no SPA fallback | Keep `HashRouter`; if `BrowserRouter` needed, add host rewrite (`_redirects` / CloudFront) first | ADR-1 |
| 4 | **Bare `<a href="#mass">` under HashRouter** | Navigates to `NotFound`, hash lost | HashRouter's hash is the route (`#/path#anchor` is double-hash) | Use `<Link to="/worship#mass">` — `Layout.tsx` resolves double-hash | See ADR-1 |
| 5 | **`src/utils` `as any` / `unknown` cast** | `tsc` silenced, runtime type error | Strict `noUnusedLocals/Params` tempts casts | Use real types; `site.ts` is `as const` — narrowing via `typeof` | Lint: `typescript-eslint` `no-explicit-any` |
| 6 | **New `inline <script>` not CSP-hashed** | `csp-build-contract.test.ts` fails, `dist/` ships `unsafe-inline` | `viteSingleFile` inlines new script chunks | Re-run `bun run build` — `inject-csp-hashes.mjs` re-hashes; never suppress the mismatch | See §11 |
| 7 | **Stray `*/` in `public/_headers`** | _headers malformed, Cloudflare ignores HSTS | Merge from prior remote content (worklog Task 3) | One `/*` splat path + indented `Header: value` lines — no stray `*/` | `headers-contract.test.ts` |
| 8 | **`docs/ssh-key.txt` tracked** | `repo-hygiene.test.ts` fails, secret in `git log` | Merged unrelated history contained the key | `git rm --cached docs/ssh-key.txt` + `.gitignore` `ssh-key*`/`*.pem` | Worklog Task 3 addendum |
| 9 | **`e2e/**` inside Vitest `include`** | Vitest tries to run Playwright specs, crashes | `vite.config.ts` `test.include: src/**/*` was overly broad | Explicit `exclude: [e2e/**, playwright-report/**]` | See vite config |
| 10 | **`tailwind.config.*` re-added (repeat #2 as variant)** | Duplicate source of tokens, drift | Agent assumes config file is required | Guard: `ls tailwind.config.*` → no file => `rg oll- src/index.css` is the count truth | §4.1 |
| 11 | **`@` alias drift** | `Cannot find module '@/data/site'` at build | `vite.config.ts` alias and `tsconfig.json` paths out of sync | Keep both `resolve.alias["@"]` and `paths {"@/*":["src/*"]}` in sync | §3.2 |
| 12 | **`npm ci` without `--legacy-peer-deps`** | `ERESOLVE` on `typescript-eslint 8.28.0` vs `TS 5.9` | Peer range predates TS 5.9 | Use `bun install` or `npm install --legacy-peer-deps` | §3.1 |
| 13 | **Hardcoded copy in pages** | Parish fact changes require touching 3 JSX files | Copy not in `src/data/*` | Move to `src/data/content.ts` / `site.ts`; update contract test | §7.3 |
| 14 | **`vite` `optimizeDeps.entries` not scoped** | Dev scans vendored `blessed-sacrament-church/` → `ENOSPC` | `optimizeDeps` scans the repo tree | `entries: ["index.html"]` — scope to the app entry only | vite config |
| 15 | **`ScrollProgress` `useScrollProgress` StrictMode double-mount** | Progress rail stuck at 0 after dev remount | `rafRef` not reset in cleanup | `rafRef.current = 0` after `cancelAnimationFrame` | hook comment (round-16) |

---

## 10. Debugging Guide

| Failure | Error / Symptom | Cause → Fix |
|---|---|---|
| **Build: `vite build` CSP mismatch** | `inject-csp-hashes` exits non-zero: "inline script count mismatch" | New inline script chunk added → re-run `bun run build` (fail-closed is intentional); if `style-src` flagged, it's `unsafe-inline` by design (React inline styles) — see §11 |
| **Build: `tsc --noEmit` fails** | `error TS6133: 'X' is declared but never used` | `noUnusedLocals/Params` — remove or prefix `_x`; file outside `include` → add to `tsconfig.json` `include` |
| **Test: Vitest `IntersectionObserver` not mocked** | `Reveal` never becomes `.reveal-visible` in tests | `src/test/setup.ts` already mocks IO — don't re-mock per file; if jsdom 26 stub throws, the unconditional replace in `setup.ts` is the fix |
| **Test: `Headers contract` fails** | `public/_headers` malformed: stray line not `/*` nor indented header | Check for blank/comment lines or stray `*/` — every non-empty line must be splat path or `  Header: value` |
| **Test: `CSP contract` fails** | `extractInlineScripts` missing JSON-LD | JSON-LD is `<script type="application/ld+json">` inline — `extractInlineScripts` regex is `/<script\b([^>]*)>([\s\S]*?)<\/script>/gi` and excludes only `src=` — verify the JSON-LD script has no `src=` |
| **E2E: green on dev, red on built** | Asset 404 or route not found on `dist/` | Singlefile rewrites root-relative refs — `playwright.built.config.ts` `vite preview :4173` is the artifact CI ships; check `public/images/` → `dist/images/` copy |
| **E2E: drawer stuck open** | `pointerdown` outside drawer doesn't close / hamburger toggle flips back | `Header.tsx` `onPointerDown` ignores `hamburgerRef` — don't change that guard (round-18 F2) |
| **E2E: `useScrollSpy` pill wrong** | Active pill not updating on scroll | IO `rootMargin` is `-45% 0px -50% 0px` — wrong inset kills the middle-band; reverse-order `find` is intentional (`[...ids].reverse()`) |
| **Visual: FOUC / unstyled** | Flash of unstyled content on load | `src/index.css` `@import "tailwindcss"` must be first import in `src/main.tsx` chain — verify `index.html` doesn't preload a stale `/assets/` file |
| **Visual: blue not theming** | `oll-blue-*` classes have no effect | Token key typo — `rg "oll-" src/index.css | head` vs `rg "oll-" src/components` — one mismatch is the bug |
| **Deploy: 404 on refresh** | Direct URL paste → 404 | `HashRouter` requires `#/path` — if the host enforces `BrowserRouter`, add `_redirects` (`/* /index.html 200`); otherwise keep `HashRouter` + `resolveHashRedirect` pre-mount |
| **Live-site not reflecting `dist/`** | Old HTML cached | Cloudflare Page cache — `dist/_headers` has no `Cache-Control: no-cache` for `index.html` yet; purge cache after deploy |

---

## 11. Pre-Ship Checklist

**Quality gate — all five must be green on a fresh clone (six with the built E2E pass). Run in this order:**

```bash
bun install --frozen-lockfile   # or npm install --legacy-peer-deps
bun run lint                    # eslint 9.39.5 flat --max-warnings 0
bun run typecheck               # tsc --noEmit — strict, no unused locals/params
bun run test                    # vitest 3.2.6 jsdom — 12 files / 71 tests green
bun run build                   # vite build + node scripts/inject-csp-hashes.mjs — CSP hash-pinned
bun run test:e2e                # playwright vs dev :3000 — 31 specs green (optional local)
bun run test:e2e:built          # playwright vs dist :4173 — 31 specs green — CI gate
bun run preview                 # manual smoke at http://localhost:4173
```

**CI guard (`.github/workflows/ci.yml` — drift-checked by `src/ci-workflow.test.ts` 7 tests):**

| Step | Command | Artifact |
|---|---|---|
| Install | `oven-sh/setup-bun@v2` + `bun install --frozen-lockfile` | — |
| Lint | `bun run lint` | — |
| Typecheck | `bun run typecheck` | — |
| Unit | `bun run test` | — |
| Build | `bun run build` (`viteSingleFile` + CSP injection) | `dist/` |
| E2E built | `bunx playwright install --with-deps chromium` + `bun run test:e2e:built` | `playwright-report/` on failure, `dist/` always |

**Security verification (before shipping)**

- [ ] `grep -o "script-src[^;]*" dist/index.html` — contains `sha256-…` per inline script, no `unsafe-inline` in `script-src`
- [ ] `cat public/_headers` — 5 headers, `/*` on one line + 5 indented `Header: value` lines, no stray `*/`
- [ ] `git status` — no `docs/ssh-key.txt` or `*.pem` tracked; `src/repo-hygiene.test.ts` green
- [ ] `ls dist/_headers dist/images/` — headers + 9 jpgs present

**Visual verification**

- [ ] `bun run preview` — hero "The grotto in the city.", quote card "You are not a stranger here.", 3 grounds cards, 4 Mass cards + exactly-one TODAY highlight (see `massDayKey`), map iframe on `#visit`, 7 sacraments + scrollspy pills, 9 timeline dots, single-open FAQ, dropdown hover, `/donate` alias, `*` → 404, drawer open/close-on-tap (844px), zero console errors (legacy: `scripts/verify-site.mjs` 24/24)

---

## 12. Lessons Learnt & How to Avoid Them

| # | Lesson (what happened → why it mattered → how to avoid) | Fix ref |
|---|---|---|
| 1 | **Singlefile rewrites break root-relative refs** — `/favicon.svg` became `/assets/` miss on `dist/`. Built vs dev E2E drift hid the bug until the built pass was added. Always test the built artifact, not just dev. | `playwright.built.config.ts` (Tasks 4, 8) |
| 2 | **`tailwind.config.*` is inert in v4** — an agent added one for "consistency", tokens stopped theming. V4 is CSS-first — `@theme` is the only source. | ADR-3, §4.1, anti-pattern #2 |
| 3 | **`server.watch.ignored` saved `ENOSPC`** — vendored `blessed-sacrament-church/` + `skills/` tree triggered file-watch exhaustion. Scope `optimizeDeps.entries` and `server.watch.ignored` to the app entry. | vite.config |
| 4 | **Stray `*/` in `_headers` killed HSTS** — merge from prior remote content left `*/` on its own line; Cloudflare ignored the file. The headers contract test now fails on any malformed line. | Task 2, anti-pattern #7 |
| 5 | **Tracked `docs/ssh-key.txt` leaked the deploy key** — unrelated-history merge brought the key; the hygiene test was absent. Added `repo-hygiene.test.ts` + `.gitignore` `ssh-key*`. History still contains it — rotate. | Task 3, anti-pattern #8 |
| 6 | **`e2e/**` inside Vitest `include` crashed** — Vitest tried to parse Playwright specs (`page.gotoHash`). Explicit `exclude: [e2e/**]` is the seam. | anti-pattern #9 |
| 7 | **`--legacy-peer-deps` is not optional for `npm`** — `typescript-eslint 8.28.0` peer range predates `TS 5.9`; `npm ci` alone `ERESOLVE`s. Document `bun` as primary. | §3.1, anti-pattern #12 |
| 8 | **`useScrollProgress` StrictMode double-mount** — `rafRef` not reset after `cancelAnimationFrame` permanently disabled the hook. Reset `rafRef.current = 0` in cleanup. | hook comment, anti-pattern #15 |
| 9 | **`HashRouter` double-hash handling** — `#/worship#mass` + plain `hash` confused `Layout.tsx`. Split on `#`, filter, take last part; 80ms `setTimeout` for `scrollIntoView` + cleanup (`clearTimeout`) on route change (round-16 L1). | `Layout.tsx` |
| 10 | **Token prefix re-keying** — `bsc-*` → `oll-*` global rename missed `scrollbar-color` `bsc-parchment`. One `rg bsc- src/` returns 0 is the invariant. | anti-pattern #1 |

---

## 13. Pitfalls to Avoid

| Pitfall | Don't | Do instead |
|---|---|---|
| **Router** | `BrowserRouter` without host rewrite | Keep `HashRouter`; add `_redirects` first if you must switch |
| **Link** | `<a href="#mass">` under HashRouter | `<Link to="/worship#mass">` — `Layout.tsx` handles double-hash |
| **Alias** | New route without alias | Add `<Route path="/old" element={<New/>}>` **and** `knownRoutePaths` in `deepLinks.ts` + tests |
| **Tokens** | `tailwind.config.*` or arbitrary `bg-[#…]` | Extend `src/index.css` `@theme` `oll-*` |
| **Imports** | `from "@/data/site"` out-of-sync `@/` alias | Keep `vite.config.ts` + `tsconfig.json` `paths` synced |
| **Types** | `any` / `as any` | `unknown` + narrowing; `as const` + `typeof` for `site` |
| **Copy** | Hardcoded parish strings in pages/components | Put copy in `src/data/*`; update contract tests |
| **Images** | Bare `<img>` | `SafeImage` (fallback + dataset guard); images in `public/images/` |
| **Secrets** | Committing `*.pem`/`ssh-key*`/`docs/ssh-key.txt` | `.gitignore` `ssh-key*` + `src/repo-hygiene.test.ts` |
| **Env** | `VITE_SECRET` or unprefixed env | `VITE_*` only for client-safe vars; secrets never in `dist/index.html` |
| **Tests** | `e2e/**` in Vitest / `vi.fn()` in `vi.mock()` factory | `vite.config.ts` `exclude: e2e/**`; move `vi.fn()` outside factory |
| **Motion** | Unconditional `animation` | Always pair with `@media (prefers-reduced-motion: reduce)` kill |
| **Scroll** | Listening without `passive: true` | `{ passive: true }` + `rAF` coalescing (see §6) |
| **Hash scroll** | No cleanup on `scrollIntoView` timeout | Return `() => clearTimeout(timer)` from `Layout.tsx` effect |

---

## 14. Best Practices

| Area | Practice | Enforced by |
|---|---|---|
| **Org** | `src/data/` is SSOT; `src/pages/` renders; `src/components/` is primitive; `src/hooks/` holds only reusable scroll/visibility hooks | `src/data/*.test.ts` contracts |
| **TS** | `interface` for shapes, `type` for unions; `import type` for types-only | `eslint` + `typescript-eslint` |
| **React** | Named exports for pages/hooks/utils (`export function Home`); functional components only; colocation `Component.tsx` + `Component.test.tsx` | `eslint-plugin-react-refresh` |
| **State** | Local `useState/useReducer`, cross-component Context if needed, `useQuery` only if an API is added | no global store today |
| **Styling** | `cn()` only merge (`clsx` + `twMerge`); no `classnames` fork; no arbitrary `oll-*` outside `@theme` | `cn.ts` + `token-integrity.test.ts` |
| **Routing** | `HashRouter` + legacy alias rule; `to="/worship#mass"` for anchors; `resolveHashRedirect` pre-mount handles path-style deep links | `deepLinks.test.ts` + `nav.test.ts` |
| **Testing** | TDD Red→Green→Refactor→Commit (one cycle per commit); pure-CSS/layout is the TDD exception | `worklog.md` + `CLAUDE.md` |
| **Commits** | Conventional Commits `feat:/fix:/test:/chore:`; atomic; reference contract tests | `worklog.md` |
| **A11y** | Ship under `prefers-reduced-motion`; ship under `tab` + `Escape` + `Enter` | §8 table + `e2e/navigation.spec.ts` |
| **Security** | Zod at boundaries *if* an API is added; no `process.env.*` in client; `secret` patterns in `.gitignore` | `repo-hygiene.test.ts` |
| **Performance** | CSS-only motion for Lighthouse ≥95; `SafeImage` `loading="lazy"` + `fetchPriority` on hero; `singlefile` for TTFB | §4 |
| **Docs** | Explain *why* not *what*; negative space ("no `framer-motion`") alongside the chosen path | §12 |

---

## 15. Coding Patterns

### 15.1 Discriminated Union Button (client routing + external link + button)

```tsx
// src/components/ui/Button.tsx — to / href / button, exactly one

type ButtonProps =
  | { to: string; href?: never; onClick?: never; type?: never }
  | { href: string; to?: never; onClick?: never; type?: never }
  | { onClick?: React.MouseEventHandler<HTMLButtonElement>; type?: "button" | "submit" | "reset"; to?: never; href?: never };

const variantClasses = {
  primary: "bg-oll-gold-500 text-oll-blue-950 hover:bg-oll-gold-600 hover:-translate-y-0.5 hover:shadow-oll",
  secondary: "bg-oll-blue-700 text-oll-cream hover:bg-oll-blue-800",
  ghost: "bg-transparent text-oll-blue-700 hover:bg-oll-blue-50",
  "outline-light": "bg-transparent border border-oll-cream/40 text-oll-cream hover:bg-oll-cream/10",
};

export function Button({ children, variant = "primary", icon: Icon, className, ...props }: ButtonProps & { children: React.ReactNode; variant?: keyof typeof variantClasses; icon?: LucideIcon; className?: string }) {
  const classes = cn("inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200 focus:ring-2 focus:ring-offset-2 active:translate-y-0", variantClasses[variant], className);
  if ("to" in props && props.to) return <Link to={props.to} className={cn(classes, "group")}>{children}</Link>;
  if ("href" in props && props.href) return <a href={props.href} className={cn(classes, "group")}>{children}</a>;
  return <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
```

### 15.2 SafeImage — single-swap fallback (no infinite loop)

```tsx
// src/components/SafeImage.tsx — fallback = /images/hero-church.jpg, lazy, dataset guard

export function SafeImage({ src, fallback = "/images/hero-church.jpg", alt, loading = "lazy", fetchPriority, className }: { src: string; fallback?: string; alt: string; loading?: "lazy" | "eager"; fetchPriority?: "high" | "low" | "auto"; className?: string }) {
  const onError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
    if (img.dataset.fallback === "1") return;
    img.dataset.fallback = "1";
    img.src = fallback;
  };
  return <img src={src} alt={alt} loading={loading} fetchPriority={fetchPriority} onError={onError} className={className} />;
}
```

### 15.3 Hash-aware Scroll Restore (double-hash, 80ms, cleanup)

```tsx
// src/components/Layout.tsx — pathname+hash dep, double-hash aware

useEffect(() => {
  const resolveAnchor = () => {
    const raw = window.location.hash;
    const parts = raw.split("#").filter(Boolean);
    const anchor = parts.length > 1 ? parts[parts.length - 1] : null;
    if (anchor) {
      const el = document.getElementById(anchor);
      if (el) {
        const timer = setTimeout(() => el.scrollIntoView({ behavior: "auto" }), 80);
        return () => clearTimeout(timer);
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  };
  return resolveAnchor();
}, [pathname, hash]);
```

### 15.4 CSP Hash Injection — pure helpers + fail-closed CLI

```js
// scripts/inject-csp-hashes.mjs — extractInlineScripts → sha256 → rewriteScriptSrc

export function extractInlineScripts(html) {
  // only inline <script> (no src=), captures JSON-LD + module scripts
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  // if /\bsrc\s*=/i.test(m[1]) continue;
}
export function sha256(body) {
  return createHash("sha256").update(body, "utf8").digest("base64");
}
export function rewriteScriptSrc(html, hashes) {
  // keep 'self' + external origins, drop 'unsafe-inline' + old 'sha256-…', inject new hashes
  // leaves style-src untouched (React inline styles)
}
```

Used by `bun run build` (`vite build && node scripts/inject-csp-hashes.mjs`); guarded by `src/csp-build-contract.test.ts` 7 tests.

### 15.5 Source-reading Data Contract Test (no invented facts)

```ts
// src/data/site.test.ts — site is the SSOT; the test is the lock

expect(site.address.street).toBe("50 Ophir Road");
expect(site.address.zip).toBe("188690");
expect(site.contact.officePhone).toBe("+65 6294 0624");
expect(site.chequePayee).toBe("Church of Our Lady of Lourdes");
expect(site).not.toHaveProperty("uen"); // OLL publishes no UEN — don't invent
expect(site).not.toHaveProperty("facebook");
```

---

## 16. Coding Anti-Patterns

| Anti-Pattern | Why it hurts | Correct alternative |
|---|---|---|
| `src/utils/cn.ts` hand-rolled `clsx` without `twMerge` | `bg-oll-blue-600` vs `bg-oll-blue-700` conflict not resolved | `twMerge(clsx(...))` — the only merge path (§5.5, §7) |
| `tailwind.config.*` with `oll-*` duplicates | Two token sources diverge — `src/index.css` `@theme` is ignored | Delete config; tokens only in `@theme` |
| `<img src={src} />` bare | No fallback, broken image on 404 | `SafeImage` (§15.2, `imageFallback` in `content.ts`) |
| `import.meta.env.PROCESS_ENV_VAR` unprefixed | Leaks server env to `dist/index.html` | Only `VITE_*` reaches the client; guard with `src/env.d.ts` |
| `useEffect(() => { window.addEventListener("scroll", onScroll); })` without `passive: true` or `rAF` | Jank on scroll, main-thread block | See §6 `useScrolled` + `useScrollProgress` |
| `vi.fn()` inside `vi.mock()` factory | Hoisting — `vi` not available at factory time | `const fn = vi.fn(); vi.mock(...)` — hoist outside |
| `<a href="/about">` for internal nav | Full page reload, HashRouter state lost | `<Link to="/about">` |
| `getDay() === 0 ? "weekdays" : "saturday"` (no `=== 6` check) | Sunday vs Saturday conflated | `src/utils/massDay.ts` — three branches: `0→sunday`, `6→saturday`, else `weekdays` |
| `amber-400` / `slate-800` arbitrary Tailwind | Not in `@theme`, breaks brand | `oll-gold-400` / `oll-blue-800` — token only |
| `className="style={{ width: progress + '%' }}"` inline style for scroll rail | `style-src` CSP tension + unthemed | `ScrollProgress.tsx` is the one exception (width is dynamic 0–100%); everything else uses `@theme` classes |

---

## 17. Responsive Breakpoint Reference

Tailwind defaults (no custom `theme.screens`).

| Breakpoint | Min width | Section example | Usage in this codebase |
|---|---|---|---|
| `sm` | 640px | Hero padding `px-5 sm:px-8` | `Container.tsx` `px-5 sm:px-8` |
| `md` | 768px | Timeline `md:grid-cols-3` | `Timeline.tsx` 1→3 columns |
| `lg` | 1024px | Ministry cards `lg:grid-cols-4` | `Ministries.tsx` 1→2→4 |
| `xl` | 1280px | PageHero `xl:py-20` | desktop hero breathing room |
| `2xl` | 1536px | — | rarely used; don't over-grid |

Pattern per section: stacked on mobile, `md` 2-col, `lg` 3–4-col. Test drawer at **844px height** (iPhone 14 Pro) — `e2e/helpers.ts` uses `page.setViewportSize({ width: 390, height: 844 })`.

---

## 18. Z-Index Layer Map

| Element | Location | z-* | Purpose |
|---|---|---|---|
| `SkipLink` (before focus) | `SkipLink.tsx` | `z-[100]` `-translate-y-24` | off-screen until `focus:` |
| `SkipLink:focus` | `SkipLink.tsx` | `z-[100]` translate-y-0 | skip-to-content, above everything |
| `Header` (fixed bar) | `Header.tsx` | `z-50` | sticky `oll-blue-950` bar |
| `ScrollProgress` rail | `ScrollProgress.tsx` | `z-[60]` `fixed h-[3px]` | gold rail — **above** header (intentional) — §5.2 Layout renders it decoupled from Header |
| Mobile drawer (`Header` `drawerRef`) | `Header.tsx` | `z-40` `fixed inset-0` | full-height drawer under header |
| Dropdown `<ul>` (`desktopOpen` menu) | `Header.tsx` | `z-40` absolute | desktop hover/focus dropdown |
| `BackToTop` (threshold 480) | `BackToTop.tsx` | `z-30` fixed bottom-right | above content, below drawer |
| `Timeline` rail `::before` | `Timeline.tsx` | `z-0` gradient rail | decorative, under dots |
| Drawer overlay (outside-tap area) | `Header.tsx` `pointerdown` | — | no own layer — hits the `z-40` drawer region |

**Conflict rules:** header `z-50` > scroll rail `z-[60]` is **inverted intentionally** — the rail must paint over the header (gold on blue). Don't reorder `Layout.tsx` so `Header` wraps `ScrollProgress`; they are siblings with independent stacking. Skip link `z-[100]` must stay the topmost focusable.

---

## 19. Color Reference (Complete)

**Source:** `src/index.css` `@theme` — 33 entries. Every hex below matches it exactly; one mismatch is a bug. Forbidden: arbitrary `bg-[#…]` or non-`oll-*` Tailwind outside this table.

| Token | Hex | RGB | Tailwind class | Usage |
|---|---|---|---|---|
| `oll-cream` | `#f8f5ef` | 248,245,239 | `bg-oll-cream` | page background, card fill |
| `oll-parchment` | `#efe9da` | 239,233,218 | `bg-oll-parchment` | section band, texture base |
| `oll-parchment-dark` | `#e3dac4` | 227,218,196 | `bg-oll-parchment-dark` | band variant |
| `oll-stone` | `#d5cab1` | 213,202,177 | `border-oll-stone` | card/divider border |
| `oll-ink` | `#1d2230` | 29,34,48 | `text-oll-ink` | body text (~15:1 on cream) |
| `oll-charcoal` | `#3b4150` | 59,65,80 | `text-oll-charcoal` | muted text |
| `oll-blue-50` | `#eef3fc` | 238,243,252 | `bg-oll-blue-50` | `Parish` chip bg |
| `oll-blue-100` | `#d7e2f6` | 215,226,246 | `bg-oll-blue-100` | tint |
| `oll-blue-200` | `#b1c5ec` | 177,197,236 | `bg-oll-blue-200` | `::selection` bg |
| `oll-blue-300` | `#7f9fde` | 127,159,222 | `border-oll-blue-300` | chip border |
| `oll-blue-400` | `#5478cb` | 84,120,203 | `text-oll-blue-400` | mid accent |
| `oll-blue-500` | `#3a5fae` | 58,95,174 | `bg-oll-blue-500` | button secondary |
| `oll-blue-600` | `#2c4a8e` | 44,74,142 | `text-oll-blue-600` | links |
| `oll-blue-700` | `#233a71` | 35,58,113 | `text-oll-blue-700` · `scrollbar-color` | scrollbar + `Parish` text |
| `oll-blue-800` | `#1c2e59` | 28,46,89 | `bg-oll-blue-800` | — |
| `oll-blue-900` | `#121e3c` | 18,30,60 | `bg-oll-blue-900` | hero/footer |
| `oll-blue-950` | `#0a1428` | 10,20,40 | `bg-oll-blue-950` · `theme-color` | header/hero, `theme-color` |
| `oll-gold-100` | `#f5eacc` | 245,234,204 | `bg-oll-gold-100` | chip bg `Devotion` |
| `oll-gold-200` | `#ebd599` | 235,213,153 | `bg-oll-gold-200` | — |
| `oll-gold-300` | `#dfc06a` | 223,192,106 | `text-oll-gold-300` | eyebrow light |
| `oll-gold-400` | `#d4ad42` | 212,173,66 | `bg-oll-gold-400` · `ring-oll-gold-400` | accent / focus ring / rule |
| `oll-gold-500` | `#c49a2c` | 196,154,44 | `bg-oll-gold-500` | primary button |
| `oll-gold-600` | `#a67f22` | 166,127,34 | `bg-oll-gold-600` | hover |
| `oll-gold-700` | `#85641c` | 133,100,28 | `text-oll-gold-700` | `Devotion` chip text |
| `oll-rose-50` | `#f8edf0` | 248,237,240 | `bg-oll-rose-50` | `Archdiocese` chip bg |
| `oll-rose-300` | `#d7a1b0` | 215,161,176 | `border-oll-rose-300` | chip border |
| `oll-rose-400` | `#c07a8e` | 192,122,142 | `text-oll-rose-400` | — |
| `oll-rose-500` | `#a55d74` | 165,93,116 | `text-oll-rose-500` | — |
| `oll-rose-600` | `#8a4a5f` | 138,74,95 | `text-oll-rose-600` | `Archdiocese` text |
| `oll-sage-50` | `#eef4ef` | 238,244,239 | `bg-oll-sage-50` | `Formation` chip bg |
| `oll-sage-300` | `#86a98b` | 134,169,139 | `border-oll-sage-300` | chip border |
| `oll-sage-500` | `#41684a` | 65,104,74 | `text-oll-sage-500` | — |
| `oll-sage-600` | `#2f4f37` | 47,79,55 | `text-oll-sage-600` | `Formation` text |
| `shadow-oll` | `0 20px 60px -20px rgba(10,20,40,.45)` | — | `shadow-oll` | default card |
| `shadow-oll-lg` | `0 40px 90px -30px rgba(10,20,40,.55)` | — | `shadow-oll-lg` | elevated |
| `radius xs–2xl` | `.125` / `.125` / `.1875` / `.25` / `.25` / `.375` rem | — | `rounded-sm/xl` | editorial (sharp chapel, pill chip) |

**Forbidden:** `amber-400`, `slate-*`, `gray-*`, `purple-*` — not in `@theme`; `src/token-integrity.test.ts` guards their absence. **Category map (§7):** `Parish→oll-blue-700/300/50`, `Devotion→oll-gold-700/300/100`, `Formation→oll-sage-600/300/50`, `Archdiocese→oll-rose-600/300/50`.

---

## 20. The Complete TypeScript Interface Reference

**Parish content (8 interfaces — `src/data/content.ts`)**

```ts
export interface TimelineEntry { year: string; title: string; description: string; }

export interface GroundsPlace {
  id: string; title: string; description: string;
  image: string; imageFallback: string; imageAlt: string;
}

export interface Ministry {
  id: string; title: string; summary: string; description: string; details: string[];
  image: string; imageFallback: string; imageAlt: string;
}

export interface Sacrament {
  id: string; title: string; summary: string; description: string; details: string[];
}

export interface FaqItem { question: string; answer: string; }

export interface EventItem {
  title: string; date: string; summary: string;
  category: "Parish" | "Devotion" | "Formation" | "Archdiocese"; href?: string;
}

export interface GivingOption { title: string; description: string; icon: string; }

// devotions (no exported interface — inline shape)
export const devotions: { title: string; when: string; where: string; }[]

// images helper (no interface — const object of local paths)
export const images: { hero: string; heroFallback: string; mainChurch: string; grotto: string; interior: string; stainedGlass: string; liturgical: string; formation: string; pastoral: string; community: string; }
```

**Navigation (`src/data/nav.ts`)**

```ts
export interface NavLink { label: string; to: string; }
export interface NavItem { label: string; to?: string; description?: string; children?: NavLink[]; }

export const primaryNav: NavItem[] = [
  { label: "Home", to: "/" },
  // + About/Worship/Sacraments/Ministries (with children NavLink[]) + News & Events
];
export const footerNav: NavLink[]; // 10 links
```

**Site (`src/data/site.ts` — `as const` with getters)**

```ts
export const site = {
  name: "Church of Our Lady of Lourdes",
  shortName: "Our Lady of Lourdes",
  tagline: "Two tongues, one faith, one family.",
  vision: "To be a welcoming household of grace at 50 Ophir Road — …",
  founded: 1888,
  address: {
    street: "50 Ophir Road", city: "Singapore", zip: "188690",
    get full(): string { return `${this.street}, ${this.city} ${this.zip}`; },
    get query(): string { return encodeURIComponent(this.full); },
  },
  hours: {
    church: string; office: string; reception: string; adoration: string;
    confessionWeekday: string; confessionWeekend: string;
  },
  mass: {
    weekdayRosary: string; weekdayDivineMercy: string;
    weekdayEnglish: string; weekdayTamil: string;
    saturday: string; saturdayRosary: string;
    sunday: { time: string; language: "English" | "Tamil"; }[]; // length 5
    publicHoliday: { time: string; language: string; }[]; // length 2
    confession: string; adoration: string; note: string;
  },
  contact: { officePhone: string; email: string; connectEmail: string; bookingsEmail: string; },
  transport: { mrt: string; buses: string; },
  feast: { name: "Our Lady of Lourdes"; date: "11 February"; },
  chequePayee: "Church of Our Lady of Lourdes",
  archdiocese: string; holySee: string; myCatholic: string; dailyReadings: string;
  mapsUrl: string; mapsEmbedSrc: string; // google.com/maps
  url: "https://ourladyoflourdes.sg/"; ogImage: "https://ourladyoflourdes.sg/images/hero-church.jpg";
} as const;
```

**Utilities (`src/utils/*`)**

```ts
// src/utils/cn.ts
import type { ClassValue } from "clsx";
export function cn(...inputs: ClassValue[]): string; // twMerge(clsx(...))

// src/utils/massDay.ts
export type MassDayKey = "weekdays" | "saturday" | "sunday";
export function massDayKey(date: Date): MassDayKey; // 0→sunday, 6→saturday, else→weekdays

// src/utils/categoryTone.ts
export function categoryTone(category: EventItem["category"]): string;
// Parish→"text-oll-blue-700 border-oll-blue-300 bg-oll-blue-50"
// Devotion→"text-oll-gold-700 border-oll-gold-300 bg-oll-gold-100"
// Formation→"text-oll-sage-600 border-oll-sage-300 bg-oll-sage-50"
// Archdiocese→"text-oll-rose-600 border-oll-rose-300 bg-oll-rose-50"

// src/utils/deepLinks.ts
export const knownRoutePaths: readonly [
  "/", "/about", "/history", "/worship", "/sacraments", "/ministries",
  "/news-events", "/give", "/faq",
  "/history-of-the-church", "/mass-times", "/contact-us",
  "/all-sacraments", "/all-ministries",
  "/parish-bulletin", "/church-events", "/news-and-events", "/donate",
]; // as const — 17 entries
export function resolveHashRedirect(pathname: string, hash: string): string | null;
// "/worship" + "#mass" → "/#/worship#mass" ; "/" or unknown → null
```

**Hooks (`src/hooks/*`)**

```ts
export function useScrolled(threshold?: number): boolean; // default 12; Header uses 16
export function useScrollProgress(): number; // 0..1, rAF-throttled, StrictMode-safe
export function useScrollSpy(ids: string[]): string; // active id in mid-band, ids.join("|") dep
```

**UI primitives (`src/components/ui/*`)**

```ts
// Button — discriminated union: exactly one of to / href / button
type ButtonProps = ( { to: string } | { href: string } | { onClick?: MouseEventHandler; type?: "button"|"submit"|"reset" } ) & {
  children: ReactNode; variant?: "primary"|"secondary"|"ghost"|"outline-light"; icon?: LucideIcon; className?: string;
};
// Accordion
interface AccordionItem { id: string; question: string; answer: string; }
interface AccordionProps { items: AccordionItem[]; className?: string; }
// Reveal
interface RevealProps { children: ReactNode; delay?: number; as?: "div" | "li"; className?: string; }
// PageHero
interface PageHeroProps { eyebrow: string; title: string; description?: string; image: string; compact?: boolean; children?: ReactNode; }
```

---

## Appendix A — ADRs (Architecture Decision Records)

| # | Decision | Rationale | File |
|---|---|---|---|
| **ADR-1** | **HashRouter over BrowserRouter** | Static hosts have no SPA fallback — `/worship` as a file path 404s. HashRouter's `#/path` is a client concern; path-style deep links are rewritten pre-mount via `resolveHashRedirect` in `src/main.tsx`. | `src/App.tsx`, `src/main.tsx`, `src/utils/deepLinks.ts` |
| **ADR-2** | **Singlefile (`vite-plugin-singlefile`)** | One `dist/index.html` deploys without a server to Cloudflare/S3/GH Pages. `public/images/` are copied, not inlined (keeps HTML under 500 kB on `dist/`). | `vite.config.ts`, `src/App.tsx` route count |
| **ADR-3** | **Tailwind v4 CSS-first `@theme`** | No `tailwind.config.*` — tokens in `src/index.css` `@theme` are the single source; `src/token-integrity.test.ts` guards drift. V4 is the upgrade path for the family. | `src/index.css` |
| **ADR-4** | **CSP hash pinning (`sha256`)** | `viteSingleFile` inlines scripts — `unsafe-inline` would be required. Porting the `blessed-sacrament-church` hardening (OLOL round-19) rewrites `script-src` to `sha256-…` in `dist/`, fail-closed. `style-src` keeps `unsafe-inline` (React inline `style` attrs). | `scripts/inject-csp-hashes.mjs`, `index.html` |
| **ADR-5** | **bun primary, npm fallback** | `bun.lock` exact pins; `typescript-eslint 8.28.0` peer predates TS 5.9 — `npm ci` alone fails, `npm --legacy-peer-deps` is the workaround. CI uses `oven-sh/setup-bun@v2`. | `package.json`, `.github/workflows/ci.yml` |
| **ADR-6** | **File-backed SSOT (no CMS/API)** | Parish content is brochure content (9 timeline entries, 7 sacraments) — typed arrays in `src/data/*` with contract tests replace a CMS. Add an API/DB only via a new ADR. | `src/data/*` |

---

## Appendix B — Live-Site Validation

**E2E methodology:** Playwright `chromium` (`channel: "chromium"`), `expect.timeout: 15s`, `reuseExistingServer: !CI`. Two passes:

- `bun run test:e2e` — `playwright.config.ts` `webServer: vite --port 3000` (`baseURL http://localhost:3000`)
- `bun run test:e2e:built` — `playwright.built.config.ts` `webServer: vite preview --port 4173` (`baseURL http://127.0.0.1:4173`; `E2E_BASE_URL` override → live host, `webServer` skipped)

Helpers: `e2e/helpers.ts` (`gotoHash`, `expectHash`). Specs:

| Spec | What it proves |
|---|---|
| `smoke.spec.ts` | Home hero "The grotto in the city.", tagline, address/phone, quote card, 404 copy |
| `navigation.spec.ts` | Desktop dropdown hover→visible→navigate; mobile drawer open/navigate/close + current-route tap closes (round-audit regression) |
| `aliases-deep-links.spec.ts` | 7 legacy aliases land on the right page (h1 per route); path-style deep links rewrite; hash anchors `#mass` etc. reachable |
| `worship-sacraments.spec.ts` | Worship 4 Mass cards + exactly-one TODAY highlight + Tamil+English Sunday; Sacraments 7 sections + scrollspy pills + map iframe on `#visit` |

**What live-site testing catches that unit cannot:** singlefile rewrites root-relative refs (`/favicon.svg` etc.) — the built pass is the only proof the CSP-hardened artifact the host serves is correct.

**Legacy self-verification:** `node scripts/verify-site.mjs` — 24 Playwright self-checks (headed, legacy — see worklog Task 2).

---

## Appendix C — The Meticulous Approach (6-Phase Workflow)

> The operating contract for every task — see `CLAUDE.md` for the full phrasing.

1. **ANALYZE** — Deep, multi-dimensional requirement mining — no surface assumptions; explicit/implicit/ambiguous needs; 2–3 approaches; risk assessment.
2. **PLAN** — Sequential phases + checklists + success criteria + effort — present for user confirmation.
3. **VALIDATE** — Explicit user approval before coding — address concerns.
4. **IMPLEMENT** — Modular, tested, documented — library-first — TDD Red→Green→Refactor→Commit (one cycle per commit; pure CSS/layout exception).
5. **VERIFY** — `lint` + `typecheck` + `test` + `test:e2e:built` + `build` green — review a11y/security/perf/edge cases.
6. **DELIVER** — Complete handoff with usage docs, challenges, next steps.

Quality gate before "done": `bun run lint` (0) + `bun run typecheck` (0) + `bun run test` (71) + `bun run build` (hashed) + `bun run test:e2e:built` (31) — all green on a fresh clone.

---

## Appendix D — Lineage & Migration History

**Family:** `blessed-sacrament-church` (reference, read-only at `blessed-sacrament-church/` — gitignored) → `ourladyoflourdes` (this repo, Marian redesign).

**What was ported**

- Architecture: React 19 + Vite 7 + HashRouter + singlefile + `src/data/*` SSOT (site/nav/content) + `src/components/` (Layout/Header/Footer/PageHero/SafeImage/Timeline + `ui/` Button/Container/SectionHeading/Accordion/Reveal) + hooks (`useScrolled/useScrollProgress/useScrollSpy`) + utils (`cn/massDay/categoryTone/deepLinks`).
- Design: tokens re-keyed `bsc-*` → `oll-*` (Marian blue 50–950, gold 100–700, rose, sage), `Cormorant Garamond + Source Sans 3` (same pairing), sacred-motion vocabulary preserved verbatim (`rise-in`, `bloom-drift`, `card-lift`, `page-in`).
- Content: verified OLL data — 1856–Today timeline (9), 3 grounds (main-church/grotto/nave), 7 sacraments, 4 ministries, 6 FAQs, 6 events, 6 giving options, devotions (Rosary Mon/Wed/Thu/Fri 11:35 · Sat 16:15, Divine Mercy Tue 11:35, Adoration 8–20), mass schedule bilingual.

**What was hardening-ported (2026-09 remediation, `docs/remediation-plan-2026-09-06.md`)**

- `scripts/inject-csp-hashes.mjs` + `.d.mts` (helpers `extractInlineScripts`/`sha256`/`rewriteScriptSrc`) + `package.json` `build` wiring + `src/csp-build-contract.test.ts` (7) — fail-closed CSP hash pinning.
- `public/_headers` fix (stray `*/` removed, kept `SAMEORIGIN`) + `src/headers-contract.test.ts` (5).
- `src/repo-hygiene.test.ts` (5) + `.gitignore` `*.pem/ssh-key*` — untracked `docs/ssh-key.txt` (history still contains it — rotate).
- `playwright.config.ts` / `playwright.built.config.ts` + `e2e/helpers.ts` + 4 specs (31) + `vite.config.ts` `exclude: e2e/**` + `.gitignore` `playwright-report/` — Chromium-only, built-artifact gate.
- `.github/workflows/ci.yml` (bun, 15 min, concurrency `ci-${{github.ref}}`) + `src/ci-workflow.test.ts` (7).

**Known delta from the audit**

- Audit snapshot had `blessed-sacrament-church` at `1b69a2d` with 8 unit tests / 47 green; after remediation this repo is **12 files / 71 green + 31 E2E ×2** — the 24 checks in `scripts/verify-site.mjs` preceded the Playwright suite.
- `blessed-sacrament-church/` is gitignored after worklog Task 3 hygiene; don't commit it.
- `docs/ssh-key.txt` history — see §11 and remediation plan "Open action: rotate the deploy key."

---

## Quick Reference Card

| Need | File / Command |
|---|---|
| **Parish facts** | `src/data/site.ts` (`site.address.full`, `site.mass.sunday[5]`) |
| **Nav model** | `src/data/nav.ts` (`primaryNav[6]` + `footerNav[10]`) |
| **Ministries / sacraments / FAQs** | `src/data/content.ts` (`ministries[4]`, `sacraments[7]`, `faqs[6]`) |
| **Routes + aliases** | `src/App.tsx` + `src/utils/deepLinks.ts` `knownRoutePaths` (17) + `resolveHashRedirect` |
| **Tokens + motion** | `src/index.css` `@theme` 33 tokens + `@layer utilities` |
| **Build + CSP** | `vite.config.ts` + `scripts/inject-csp-hashes.mjs` (`extract→sha256→rewriteScriptSrc`) |
| **Headers** | `public/_headers` (`/*` + 5 indented headers) |
| **Hooks** | `src/hooks/useScrolled(16)` / `useScrollProgress()` (rAF) / `useScrollSpy(ids)` (IO mid-band) |
| **Tests** | `bun run test` (71) · `bun run test:e2e` (31 dev) · `bun run test:e2e:built` (31 built, CI truth) |
| **Pre-push gate** | `bun run lint && bun run typecheck && bun run test && bun run build && bun run test:e2e:built` |
| **Images** | `public/images/` 9 jpgs → `dist/images/` (not inlined) |
| **CI** | `.github/workflows/ci.yml` (`bun --frozen-lockfile`, 15 min, `ci-${{github.ref}}` cancel) |
| **Full docs** | `README.md` (visitor) → `AGENTS.md` (ramp) → `CLAUDE.md` (workflow) → **this file** (distillate) |
| **Audit / remediation** | `docs/remediation-plan-2026-09-06.md` · `docs/OLL_Church_Websites_Design_Audit_Report.md` · `worklog.md` |

**Watch the invariant:** `rg "oll-" src/index.css | wc -l` vs `rg "oll-" src/` token divergence — one mismatch is a bug. `ls tailwind.config.*` must fail. `grep bsc- src/` must be 0. `bun run build && grep -o "script-src[^;]*" dist/index.html` must show `sha256-…`, not `unsafe-inline`.

---

*End of skill — Our Lady of Lourdes v1.0.0, 2026-09-06. Any agent extending this parish site should be able to recreate the environment from §3, extend a component correctly from §5, debug a failed build from §10, and ship safely from §11. For framework-family patterns, pair with `static-spa-parish-site` (unified v3).*
