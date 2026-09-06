# Our Lady of Lourdes Church · Singapore

![version](https://img.shields.io/badge/version-1.0.0-blue)
![node](https://img.shields.io/badge/node-%3E%3D20-339933)
![react](https://img.shields.io/badge/react-19.2.8-61DAFB)
![vite](https://img.shields.io/badge/vite-7.3.6-646CFF)
![tailwind](https://img.shields.io/badge/tailwind-4.3.3-38BDF8)
![ci](https://img.shields.io/badge/ci-GitHub%20Actions-2088FF)
![license](https://img.shields.io/badge/license-private-lightgrey)

> **The grotto in the city.**

A modern, fast, single-page parish site for **Our Lady of Lourdes Church — 50 Ophir Road, Rochor, Singapore 188690** — the city's Gothic Revival Tamil Church, completed 13 May 1888 and gazetted as a National Monument in 2005. Rebuilt on the [blessed-sacrament-church](https://github.com/nordeim/blessed-sacrament-church) architecture with a Marian identity: deep blues, liturgical gold, rose and sage on warm parchment.

---

## Key Features

|  | Feature | One line |
|---|---|---|
| ⛪ | **Bilingual Mass** | Weekend Sat 3 / Sun 5 + weekday & public-holiday schedules (EN + TA) from `src/data/site.ts` |
| 🎨 | **Marian Design System** | `oll-*` tokens, editorial radii/shadows, `rise-in` / `bloom-drift` / `card-lift` motion |
| 🗺 | **Alias-Aware Routing** | 10 canonical routes + 7 legacy aliases + hash anchors via `HashRouter` (`src/App.tsx` ↔ `src/utils/deepLinks.ts`) |
| 🔒 | **CSP-Hardened Build** | Single `dist/index.html` with `sha256` script-src pinning, fail-closed (`scripts/inject-csp-hashes.mjs`) |
| ♿ | **Accessible by Default** | Skip link, focus-trapped drawer, single-open FAQ accordion, `prefers-reduced-motion` |
| ✅ | **Contract-Tested Content** | 71 unit guards — tokens, parish facts, nav, CSP, headers, hygiene, CI (`src/**/*.test.ts`) |

---

## Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| UI | React | `19.2.8` | pages, hooks, `StrictMode` |
| Routing | react-router-dom | `7.18.2` | `HashRouter` for static hosts |
| Build | Vite + vite-plugin-singlefile | `7.3.6` / `2.3.3` | single `dist/index.html` |
| Styling | Tailwind CSS | `4.3.3` + `@tailwindcss/vite 4.1.17` | CSS-first `@theme` `oll-*` tokens |
| Language | TypeScript | `5.9.3` | `strict` + `noUnusedLocals` + `noUnusedParameters` |
| Icons | lucide-react | `1.38.0` | header, footer, CTA icons |
| Utils | clsx + tailwind-merge | `2.1.1` / `3.6.0` | `cn()` merge |
| Tests | Vitest + Testing Library | `3.2.6` / `16.2.0` | jsdom, `src/test/setup.ts` |
| E2E | Playwright | `1.55.1` | chromium, dev + built artifact |
| Quality | ESLint flat + `tsc` | `9.39.5` / `5.9.3` | `--max-warnings 0` + `noEmit` |
| CI | GitHub Actions + bun | `bun --frozen-lockfile` | lint → typecheck → test → build → E2E vs `dist/` |

All versions pinned exact in `package.json` / `bun.lock`. `engines: node>=20`.

---

## File Hierarchy

```
📂 .github/workflows/ci.yml          CI gate — bun: lint → typecheck → test → build → E2E vs dist
📄 index.html                        meta, OG, JSON-LD Church schema, fonts, CSP meta
📂 e2e/                              Playwright specs — smoke, navigation, aliases, worship/sacraments
📄 playwright.config.ts              E2E vs dev :3000 (chromium) · .built.config.ts vs dist :4173
📂 scripts/
  📄 inject-csp-hashes.mjs           post-build CSP hardening — script-src sha256 pinning
  📄 verify-site.mjs                 Playwright self-verification (24 checks, legacy)
📂 public/
  📄 _headers                        Cloudflare Pages security headers
  📂 images/                         parish photography → dist/images/ on build (9 jpgs)
  📄 favicon.svg · robots.txt
📂 src/
  📂 data/                           single source of truth — all parish copy
    📄 site.ts                       canonical facts (address, Masses, contacts) + computed getters
    📄 nav.ts                        primaryNav (6) + footerNav (10) — typed NavItem/NavLink
    📄 content.ts                    typed arrays — timeline, sacraments, ministries, events, giving, FAQs
  📂 pages/                          10 routes — Home About History Worship Sacraments Ministries NewsEvents Give FAQ NotFound
  📂 components/
    📄 Layout.tsx · Header.tsx · Footer.tsx · PageHero.tsx · Timeline.tsx · SafeImage.tsx · ScrollProgress.tsx · SkipLink.tsx
    📂 ui/                           Button · Container · SectionHeading · Accordion · Reveal
  📂 hooks/                          useScrolled · useScrollProgress · useScrollSpy
  📂 utils/                          cn · massDay · categoryTone · deepLinks (knownRoutePaths)
  📄 index.css                       @theme 33 oll-* tokens + @layer utilities (27 + 8 keyframes)
  📄 App.tsx                         HashRouter + Routes (10 + 7 aliases) · main.tsx createRoot
📄 vite.config.ts · tsconfig.json · eslint.config.js
```

All parish content is data-driven: pages render from `src/data/*`; contract tests assert no invented facts and that every nav target resolves.

---

## Quick Start

**Prerequisites:** `Node.js ≥20` · `bun` preferred (`bun.lock` frozen in CI) — `npm` works with a flag.

```bash
# 1 — clone
git clone <repo-url> ourladyoflourdes && cd ourladyoflourdes

# 2 — install (pick one)
bun install --frozen-lockfile
# or: npm install --legacy-peer-deps   # typescript-eslint 8.28.0 peer predates TS 5.9; plain npm ci fails

# 3 — run
bun run dev              # → http://localhost:3000  (--host 0.0.0.0 --strictPort)

# 4 — verify (pre-push gate — all must be green)
bun run lint && bun run typecheck && bun run test && bun run build && bun run test:e2e:built

# 5 — preview the production artifact
bun run preview          # → http://localhost:4173  (serves dist/)
```

**Verify Setup — expected outputs:**

| Command | Success |
|---|---|
| `bun run lint` | `eslint . --max-warnings 0` — no output (0 warnings) |
| `bun run typecheck` | `tsc --noEmit` — silent |
| `bun run test` | `12 files / 71 tests passed` (Vitest, jsdom) |
| `bun run build` | `vite build` + `inject-csp-hashes` — writes `dist/index.html` with `sha256-…` in `script-src` |
| `bun run test:e2e:built` | `31 specs passed` vs `dist/` on `:4173` |

Other runners: `bun run test:watch` · `bun run test:e2e` (dev) · `bun run test:e2e:ui` · `bun run test:e2e:report` · `bunx vitest run src/utils/cn.test.ts`.

> No runtime env today — static site, no `.env` required. Future client vars use `VITE_*` prefix and are documented in `src/env.d.ts` + `CLAUDE.md`.

---

## Design System

Tokens live **only** in `src/index.css` `@theme` — no `tailwind.config.*` exists. Never add one; extend `@theme` instead. Guarded by `src/token-integrity.test.ts`.

| Group | Tokens | Hex range | Usage |
|---|---|---|---|
| Blue (Marian) | `oll-blue-50 … 950` | `#eef3fc → #0a1428` | hero/footer (`950`), links (`600`), selection (`200`) |
| Gold | `oll-gold-100 … 700` | `#f5eacc → #85641c` | accent, rules, focus ring (`400` `#d4ad42`) |
| Rose | `oll-rose-50 … 600` | `#f8edf0 → #8a4a5f` | `Archdiocese` tone |
| Sage | `oll-sage-50 … 600` | `#eef4ef → #2f4f37` | `Formation` tone |
| Surfaces | `oll-cream` `#f8f5ef` · `oll-parchment` `#efe9da` · `oll-stone` `#d5cab1` | — | page + section bands + borders |
| Ink | `oll-ink` `#1d2230` · `oll-charcoal` `#3b4150` | — | body + muted text |
| Shadows | `oll` `0 20px 60px -20px rgba(10,20,40,.45)` · `oll-lg` `0 40px 90px -30px rgba(10,20,40,.55)` | — | cards, hero |
| Radii | `xs .125rem` · `sm .125rem` · `md .1875rem` · `lg .25rem` · `xl .25rem` · `2xl .375rem` | — | editorial — sharp chapel corners, pill chips |

**Typography:** `font-display` — Cormorant Garamond 400/500/600/700 italic · `font-body` — Source Sans 3 300–700 (loaded via `index.html` `preconnect` to Google Fonts).

**Motion:** `rise-in` · `bloom-drift` · `card-lift` + page/drawer transitions — every animation gated by `@media (prefers-reduced-motion: reduce)`.

Full 33-token map → `AGENTS.md` · Single source → `src/index.css`.

---

## Testing

| Suite | Command | What it covers |
|---|---|---|
| Unit (Vitest, jsdom) | `bun run test` | utils (`cn`, `massDay`, `categoryTone`, `deepLinks`), data contracts (`site`, `nav`, `content`), `token-integrity`, `csp-build-contract`, `headers-contract`, `ci-workflow`, `repo-hygiene`, component units (`Accordion`, `Button`, `Reveal`, `SafeImage`, `Header`, `BackToTop`) |
| Watch | `bun run test:watch` | same, watch mode |
| E2E vs dev | `bun run test:e2e` | `playwright.config.ts` :3000 (chromium) — smoke, nav, aliases |
| E2E vs built | `bun run test:e2e:built` | `playwright.built.config.ts` :4173 (`vite preview` `dist/`) — **CI truth** (singlefile rewrites root-relative refs) |
| UI / Report | `bun run test:e2e:ui` / `test:e2e:report` | interactive + HTML report |

`src/test/setup.ts` mocks `IntersectionObserver` (immediately intersecting), `scrollTo`, `scrollIntoView`, `matchMedia` — `Reveal` is visible in unit tests without per-file mocks. Single-file: `bunx vitest run src/utils/cn.test.ts`.

---

## Routes

`src/App.tsx` — `HashRouter` (static-host friendly) + `src/utils/deepLinks.ts` `knownRoutePaths` + `resolveHashRedirect` guards alias drift.

| Canonical | Component | Legacy aliases → same component |
|---|---|---|
| `/` | Home | — |
| `/about` | About | — |
| `/history` | History | `/history-of-the-church` |
| `/worship` | Worship | `/mass-times`, `/contact-us` |
| `/sacraments` | Sacraments | `/all-sacraments` |
| `/ministries` | Ministries | `/all-ministries` |
| `/news-events` | NewsEvents | `/parish-bulletin`, `/church-events`, `/news-and-events` |
| `/give` | Give | `/donate` |
| `/faq` | FAQ | — |
| `*` | NotFound | — |

Hash anchors: `worship#mass` `#confession` `#visit` · `sacraments#infant-baptism` `#matrimony` `#reconciliation` `#anointing` · `ministries#liturgical` `#formation` `#pastoral` `#community`. Use `<Link to="/worship#mass">`.

---

## Security & Hardening

Ported from the hardened `blessed-sacrament-church` codebase during the **2026-09 remediation** ([plan](docs/remediation-plan-2026-09-06.md)):

| Control | What happens | Guard |
|---|---|---|
| **CSP hash injection** | `bun run build` hashes every inline `<script>` in `dist/index.html` and rewrites `script-src 'unsafe-inline'` → `'sha256-…'` — fail-closed (exits non-zero on mismatch) | `src/csp-build-contract.test.ts` |
| `style-src` | Keeps `'unsafe-inline'` — React inline `style` attrs cannot be hash-pinned | intentional |
| **Dev untouched** | Source `index.html` keeps `unsafe-inline` for Vite HMR preamble | `vite.config.ts` |
| **Host headers** | `public/_headers` (Cloudflare Pages) — `nosniff` · `SAMEORIGIN` · `strict-origin-when-cross-origin` · `Permissions-Policy: camera=()…` · `HSTS 31536000` | `src/headers-contract.test.ts` |
| **Repo hygiene** | Fails if `*.pem`/`*.key`/`ssh-key*`/`docs/ssh-key.txt` or any `.gitignore`'d file is tracked | `src/repo-hygiene.test.ts` |

> **Operational note:** the SSH key previously committed at `docs/ssh-key.txt` remains in **git history** — rotate it. `docs/ssh-key.txt` is now `.gitignore`'d and untracked.

---

## Deployment

`bun run build` emits a self-contained `dist/index.html` (all CSS/JS inlined, `script-src` hash-pinned) + `dist/images/` (copied from `public/images/`) + `dist/_headers` — ready for any static host.

```bash
bun run build          # → dist/index.html + dist/images/ + dist/_headers
bun run preview        # verify at http://localhost:4173
# Cloudflare Pages: set build command `bun run build`, output `dist`
# Any static host (S3, GH Pages): upload dist/ — no server, no rewrite needed (HashRouter)
```

---

## Parish Information (verified — SSOT `src/data/site.ts`)

- **Address** — 50 Ophir Road, Rochor, Singapore 188690
- **Phone** — +65 6294 0624 · **Email** — colol.secretariat@catholic.org.sg
- **Weekend Masses** — Sat 5:00 pm / 6:15 pm / 7:30 pm (EN); Sun 8:00 am / 11:00 am / 12:30 pm (EN), 9:30 am / 6:30 pm (TA)
- **Weekday** — 12:30 pm (EN), 7:00 pm (TA) · **Public holidays** — 9:00 am (EN) / 10:00 am (TA); office closed, gates 5 pm
- **Devotions** — Rosary Mon/Wed/Thu/Fri 11:35 am, Sat 4:15 pm; Divine Mercy Tue 11:35 am; Adoration 8 am–8 pm; Reconciliation 15 min before every Mass
- **Feast** — Our Lady of Lourdes, **11 February** · **Cheque payee** — Church of Our Lady of Lourdes
- **MRT/Bus** — Rochor DT13 · Bugis EW12/DT14 · Ophir/Rochor corridors

Content is sourced from [ourladyoflourdes.sg](https://ourladyoflourdes.sg); no facts are invented — data contracts forbid it.

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `npm install` / `npm ci` fails on `typescript-eslint` peer | Use `npm install --legacy-peer-deps` (peer predates TS 5.9) or `bun install` (preferred) |
| `eslint` warns but CI fails | Fix it — `--max-warnings 0`. Use `bun run lint:fix` |
| `tsc` error on new file outside `src/` | Add path to `tsconfig.json` `include` or move under `src/` |
| E2E green on dev, red on built | Singlefile rewrites root-relative refs — check `playwright.built.config.ts` and `src/token-integrity` vs `dist/index.html` |
| CSP test fails after new inline script | Re-run `bun run build` — `inject-csp-hashes.mjs` must re-hash; fail-closed is intentional |
| `bun install` lock mismatch | `bun install --frozen-lockfile` locally and commit `bun.lock` |

---

## Contributing

This is a parish site — external PRs by invitation. For contributors:

- **TDD:** Red → Green → Refactor → Commit (one cycle per commit). Contract tests are the spec — update `src/data/*.test.ts` with `src/data/*`.
- **Conventions:** `strict` + `noUnusedLocals/Params` (unused vars fail), `@/` alias synced (`vite.config.ts` ↔ `tsconfig.json`), Tailwind `@theme` only (no `tailwind.config.*`), `HashRouter` + legacy alias rule.
- **Pre-push:** `bun run lint && bun run typecheck && bun run test && bun run build && bun run test:e2e:built` — all green before PR.
- **Full standards:** `CLAUDE.md` (deep workflow) · `AGENTS.md` (60-sec ramp).

---

## What's New

Recent hardening from `docs/remediation-plan-2026-09-06.md` (2026-09):

| Change | Detail |
|---|---|
| 🔒 CSP hash pinning | `scripts/inject-csp-hashes.mjs` — `script-src sha256-…` on `dist/`, `style-src` keeps `unsafe-inline` |
| 🛡️ Host headers | `public/_headers` — 5 security headers for Cloudflare Pages |
| 🧹 Repo hygiene | `src/repo-hygiene.test.ts` + `.gitignore` blocks `*.pem`/`ssh-key*` leaks; `docs/ssh-key.txt` history noted |
| 🚦 CI gate | `.github/workflows/ci.yml` — `bun --frozen-lockfile` lint→typecheck→test→build→E2E vs `dist/` with artifacts |

See also `docs/OLL_Church_Websites_Design_Audit_Report.md` for the design audit.

---

## Credits

- Design & architecture foundation: [blessed-sacrament-church](https://github.com/nordeim/blessed-sacrament-church)
- Content: Our Lady of Lourdes Parish, Singapore ([ourladyoflourdes.sg](https://ourladyoflourdes.sg))
- Full docs: `README.md` (this file) → `AGENTS.md` → `CLAUDE.md` · `worklog.md` (execution log)

---

## License

Private — All rights reserved. No `LICENSE` file is published. This is a parish website codebase; reproduction or reuse beyond the parish requires permission from the secretariat (`colol.secretariat@catholic.org.sg`).
