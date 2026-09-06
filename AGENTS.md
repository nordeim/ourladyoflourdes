# AGENTS.md — Our Lady of Lourdes (Singapore)

> The grotto in the city — fast, single-file parish SPA for **50 Ophir Road, Singapore 188690** (1888 Gothic Revival, National Monument). No SSR, no CMS, no API. One deployable `dist/index.html` + `dist/images/`. Stack detail → `README.md`; deep workflow (6-phase) → `CLAUDE.md`.

## Stack (pinned exact — `bun.lock` frozen in CI)

| Layer | Version | Note |
|---|---|---|
| React | `19.2.8` | hooks-only, `StrictMode` in `src/main.tsx` |
| Vite | `7.3.6` + `@vitejs/plugin-react 5.2.0` | `node >=20`, `vite-plugin-singlefile 2.3.3` |
| Tailwind | `4.3.3` + `@tailwindcss/vite 4.1.17` | **CSS-first `@theme` in `src/index.css`** — no `tailwind.config.*` |
| TypeScript | `5.9.3` | `strict` + `noUnusedLocals` + `noUnusedParameters` + `isolatedModules` + `noEmit` |
| Router | `react-router-dom 7.18.2` | `HashRouter` — intentional for static hosts |
| Tests | `vitest 3.2.6` jsdom + `playwright 1.55.1` chromium | 71 unit + 31 E2E × 2 passes |

## Quick start

```bash
bun install                          # npm fallback: npm install --legacy-peer-deps
bun run dev                          # http://localhost:3000
bun run lint && bun run typecheck && bun run test && bun run build && bun run test:e2e:built
```

## Commands (all from `package.json` — `bun` primary)

| Command | Purpose |
|---|---|
| `bun install` | install (frozen in CI). `npm` needs `npm install --legacy-peer-deps` (eslint peer) |
| `bun run dev` | Vite dev → `http://localhost:3000` (`--host 0.0.0.0 --strictPort`) |
| `bun run build` | `vite build && node scripts/inject-csp-hashes.mjs` → `dist/index.html` |
| `bun run preview` | serve `dist/` → `http://localhost:4173` |
| `bun run typecheck` | `tsc --noEmit` — must be silent |
| `bun run lint` | `eslint . --max-warnings 0` — zero warnings allowed |
| `bun run lint:fix` | `eslint . --fix` |
| `bun run test` | `vitest run` (jsdom, `src/test/setup.ts`) |
| `bun run test:watch` | `vitest` watch |
| `bun run test:e2e` | `playwright test` vs dev `:3000` |
| `bun run test:e2e:built` | `playwright test --config=playwright.built.config.ts` vs `dist/` `:4173` |
| `bun run test:e2e:ui` / `test:e2e:report` | Playwright UI / HTML report |

**Pre-push gate:** `bun run lint && bun run typecheck && bun run test && bun run build && bun run test:e2e:built`

**Single-test:** `bunx vitest run src/utils/cn.test.ts` · `bunx vitest run src/data/site.test.ts --reporter=verbose` · `bunx playwright test e2e/smoke.spec.ts`

## Conventions & gotchas (what agents miss)

- **`@/` alias** → `src/*` — keep `vite.config.ts` `resolve.alias` and `tsconfig.json` `paths` in sync.
- **No `tailwind.config.*`** — tokens live only in `src/index.css` `@theme`. Adding one breaks the build. Extend `@theme` instead; never use arbitrary `bg-[#...]`.
- **`HashRouter` is intentional** — static hosts have no SPA fallback. Never switch to `BrowserRouter` without adding a host rewrite. Use `<Link to="/worship#mass">`, not bare `<a href="#mass">`.
- **Legacy alias rule** — every new route that replaces an external/bookmarked URL needs an alias in `src/App.tsx` + `src/utils/deepLinks.ts` `knownRoutePaths` (guarded by `src/utils/deepLinks.test.ts` + `e2e/aliases-deep-links.spec.ts`).
- **`noUnusedLocals/Params`** — unused imports/vars fail `tsc`. Don't silence with `_` prefix without reason.
- **`vite.config.ts` `test.exclude`** keeps `e2e/**` out of Vitest. `server.watch.ignored` excludes `blessed-sacrament-church/`, `skills/`, `dist/` (prevents ENOSPC).
- **`src/test/setup.ts` mocks** `IntersectionObserver` (immediately intersecting), `scrollTo`, `scrollIntoView`, `matchMedia` — `Reveal` is visible in unit tests without per-file mocks.
- **Two Playwright configs** — `playwright.config.ts` (dev) vs `playwright.built.config.ts` (built `dist/` via `vite preview`). Singlefile rewrites root-relative refs, so the built pass is the truth.
- **`.gitignore` quirks** — `dist/`, `blessed-sacrament-church/`, `*.pem`/`ssh-key*`/`docs/ssh-key.txt` ignored; `skills/` is **intentionally tracked** (`skills/skills-catalog.md` is tooling contract). `src/repo-hygiene.test.ts` fails if ignored files are tracked.
- **`bun.lock` frozen** — CI runs `bun install --frozen-lockfile`. Commit the lockfile.

## Architecture (where to put code)

```
index.html                  CSP meta, OG, JSON-LD Church, fonts
public/_headers             Cloudflare security headers · public/images/ → dist/images/
scripts/inject-csp-hashes.mjs  post-build sha256 pinning (fail-closed)
src/data/  site.ts | nav.ts | content.ts   ← SSOT — all parish copy lives here
src/pages/ Home About History Worship Sacraments Ministries NewsEvents Give FAQ NotFound
src/components/ Layout Header Footer PageHero Timeline SafeImage ScrollProgress SkipLink + ui/
src/hooks/ useScrolled useScrollProgress useScrollSpy
src/utils/ cn massDay categoryTone deepLinks
src/index.css               @theme tokens + @layer base/utilities
src/App.tsx                 HashRouter + Routes  ·  src/main.tsx  createRoot
```
- **Data-driven:** pages render `src/data/*`. Change copy there; contract tests (`site.test.ts`, `content.test.ts`, `nav.test.ts`) guard canonical values — update the test with the copy.
- **`categoryTone`:** `Parish→blue` `Devotion→gold` `Formation→sage` `Archdiocese→rose`.

## Design tokens (`src/index.css` `@theme` — complete)

| Token | Hex | Use |
|---|---|---|
| `oll-blue-50` | `#eef3fc` | tint |
| `oll-blue-100` | `#d7e2f6` | — |
| `oll-blue-200` | `#b1c5ec` | selection |
| `oll-blue-300` | `#7f9fde` | — |
| `oll-blue-400` | `#5478cb` | — |
| `oll-blue-500` | `#3a5fae` | — |
| `oll-blue-600` | `#2c4a8e` | links/buttons |
| `oll-blue-700` | `#233a71` | scrollbar |
| `oll-blue-800` | `#1c2e59` | — |
| `oll-blue-900` | `#121e3c` | hero/footer |
| `oll-blue-950` | `#0a1428` | `theme-color` |
| `oll-gold-100` | `#f5eacc` | — |
| `oll-gold-200` | `#ebd599` | — |
| `oll-gold-300` | `#dfc06a` | — |
| `oll-gold-400` | `#d4ad42` | accent/rules/focus ring |
| `oll-gold-500` | `#c49a2c` | — |
| `oll-gold-600` | `#a67f22` | — |
| `oll-gold-700` | `#85641c` | — |
| `oll-rose-50` | `#f8edf0` | — |
| `oll-rose-300` | `#d7a1b0` | — |
| `oll-rose-400` | `#c07a8e` | — |
| `oll-rose-500` | `#a55d74` | — |
| `oll-rose-600` | `#8a4a5f` | Archdiocese tone |
| `oll-sage-50` | `#eef4ef` | — |
| `oll-sage-300` | `#86a98b` | — |
| `oll-sage-500` | `#41684a` | — |
| `oll-sage-600` | `#2f4f37` | Formation tone |
| `oll-cream` | `#f8f5ef` | page bg |
| `oll-parchment` | `#efe9da` | section band |
| `oll-parchment-dark` | `#e3dac4` | — |
| `oll-stone` | `#d5cab1` | border |
| `oll-ink` | `#1d2230` | body text |
| `oll-charcoal` | `#3b4150` | muted text |
| Shadows | `oll` `0 20px 60px -20px rgba(10,20,40,.45)` · `oll-lg` `0 40px 90px -30px rgba(10,20,40,.55)` | — |

Guarded by `src/token-integrity.test.ts` — add tokens only in `@theme`. Fonts: `font-display` Cormorant Garamond · `font-body` Source Sans 3. Motion: `rise-in`/`bloom-drift`/`card-lift` all with `prefers-reduced-motion` kill.

## Routes & aliases (`src/App.tsx` — 10 canonical + 7 aliases)

| Canonical | Component | Aliases → same component |
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

Hash anchors: `worship#mass` `#confession` `#visit` · `sacraments#infant-baptism` `#matrimony` `#reconciliation` `#anointing` · `ministries#liturgical` `#formation` `#pastoral` `#community`.

## Build hardening (fail-closed — don't weaken)

- `bun run build` hashes every inline `<script>` in `dist/index.html` and rewrites `script-src 'unsafe-inline'` → `'sha256-…'`. `style-src` **keeps** `'unsafe-inline'` (React inline `style` attrs). Dev `index.html` keeps `unsafe-inline` for Vite HMR. Guarded by `src/csp-build-contract.test.ts`.
- `public/_headers` ships `nosniff` / `SAMEORIGIN` / `strict-origin-when-cross-origin` / `Permissions-Policy` / `HSTS 31536000` — guarded by `src/headers-contract.test.ts`.
- Hygiene: `src/repo-hygiene.test.ts` blocks `*.pem`/`ssh-key*` leaks. Historical `docs/ssh-key.txt` remains in git history — **rotate that key** (`docs/remediation-plan-2026-09-06.md`).

## When to update this file

- Bump React/Vite/Tailwind/TS/Playwright → update Stack table, re-verify commands.
- Add a route/alias → update Routes table + `knownRoutePaths` + tests.
- Add/change a token → update Design tokens table (guarded by `token-integrity.test.ts`).
- New `VITE_*` var → add to Commands/Conventions + `src/env.d.ts` + `README.md`.

## References

- `README.md` — visitor overview, design system, getting started
- `CLAUDE.md` — deep workflow (Meticulous Approach 6-phase), full standards, security & a11y
- `docs/remediation-plan-2026-09-06.md` · `docs/OLL_Church_Websites_Design_Audit_Report.md` — audit context
- `worklog.md` — execution log
