# Church of Our Lady of Lourdes — Singapore

> **The grotto in the city.** — A modern, fast, single-page parish site for 50 Ophir Road, Singapore 188690. Singapore's Gothic Revival Tamil Church (completed 13 May 1888, National Monument 2005). Rebuilt on the `blessed-sacrament-church` architecture with a Marian identity.

**Tech stack:** React 19.2.8 + TypeScript 5.9 strict + Vite 7.3.6 + vite-plugin-singlefile 2.3.3 + Tailwind CSS v4.3.3 CSS-first `@theme` (`oll-*`) + react-router-dom 7.18.2 `HashRouter` + Vitest 3.2.6 / Playwright 1.55.1 + ESLint 9 flat — `bun` primary, `npm` compatible.

> This file is read fresh every conversation. Be brief and practical. If executable config (`package.json`, `vite.config.ts`, `tsconfig.json`, `src/index.css`, `src/data/*`) disagrees with this doc, trust config and fix this doc in the same commit.

---

## Core Identity & Purpose

**What it is:** Production parish brochure site — no SSR, no CMS, no API, no auth. Ten canonical pages + legacy URL aliases, data-driven from typed arrays, deployed as a single `dist/index.html` to Cloudflare Pages / S3 / GH Pages.

**Who it serves:** Parishioners and visitors seeking Mass times, sacraments, ministries, history, and how to find/give to the church. Bilingual (English + Tamil) with public-holiday awareness.

**Canonical parish facts (SSOT = `src/data/site.ts` + `index.html` JSON-LD):**

| Fact | Value |
|---|---|
| Address | 50 Ophir Road, Rochor, Singapore 188690 |
| Phone | +65 6294 0624 |
| Email | colol.secretariat@catholic.org.sg |
| Weekend Masses | Sat 5:00 pm / 6:15 pm / 7:30 pm (EN); Sun 8:00 am / 11:00 am / 12:30 pm (EN), 9:30 am / 6:30 pm (TA) |
| Weekday Mass | 12:30 pm (EN), 7:00 pm (TA) |
| Public holiday | 9:00 am (EN) / 10:00 am (TA); office closed, gates 5 pm |
| MRT / Bus | Rochor DT13 · Bugis EW12/DT14 · Ophir/Rochor corridors |
| Feast | Our Lady of Lourdes — 11 February |
| Cheque payee | Church of Our Lady of Lourdes |

Never invent parish facts — `src/data/site.test.ts`, `src/data/content.test.ts`, `src/data/nav.test.ts` guard canonical values.

---

## Foundational Principles

### Meticulous Approach — Six-Phase Workflow (mandatory for every task)

1. **ANALYZE** — Deep requirement mining. No surface assumptions. Identify explicit, implicit, and ambiguous needs. Explore 2–3 approaches. Risk-assess.
2. **PLAN** — Sequential phases with checklists, success criteria, and effort. Present for user confirmation.
3. **VALIDATE** — Explicit user approval before coding. Address concerns.
4. **IMPLEMENT** — Modular, tested, documented. Library-first (Radix/shadcn when present). TDD: Red → Green → Refactor → Commit (one cycle per commit). Pure CSS/layout changes are the only TDD exception.
5. **VERIFY** — `lint` + `typecheck` + `test` + `test:e2e:built` + `build` green. Review security, a11y, perf, edge cases.
6. **DELIVER** — Complete handoff with usage docs, challenges, and next steps.

### Project-Specific Principles

- **Parish fidelity over pixel theft** — preserve Singapore/Marian facts exactly; rephrase narrative, don't hallucinate.
- **Data-driven content** — all copy lives in `src/data/*`; pages render it. Change data there, not in JSX strings.
- **Static-first, single-file deployable** — `dist/index.html` must remain shippable without a server. No SSR/API until an ADR says so.
- **Accessibility is doctrinal** — AA contrast, keyboard drawer, `prefers-reduced-motion`, meaningful `alt`, single-open accordion.
- **Fail-closed security** — CSP hash injection and hygiene guards block drift; never weaken them.

---

## Implementation Standards

### TypeScript Strict (non-negotiable — `tsconfig.json`)

- `strict: true`, `noUnusedLocals: true`, `noUnusedParameters: true`, `isolatedModules`, `noEmit`, `jsx: react-jsx`.
- Never use `any` — use `unknown`. Prefer `interface` for shapes, `type` for unions.
- Alias `@/*` → `src/*` — keep `vite.config.ts` and `tsconfig.json` `paths` in sync.
- Explicit types on exported functions; avoid `as any` (last resort, justify with comment).
- Early returns over nested conditionals; composition over inheritance.

### Vite + React 19 SPA

- **Vite 7** — HMR default, `VITE_*` prefix for client env, `server.watch.ignored` excludes `skills/`, `dist/`, `blessed-sacrament-church/`.
- **React 19** — functional components + hooks only. `StrictMode` in `src/main.tsx`. `HashRouter` is intentional (static hosts without fallback). Never switch to `BrowserRouter` without adding a host rewrite.
- **State:** local `useState`/`useReducer`; cross-component via Context; server state via TanStack Query only if an API is added. No global store today.
- **Colocation:** `Component.tsx` next to `Component.test.tsx`; hooks in `src/hooks/`; utils in `src/utils/`.
- **Imports:** `@/data/site`, `@/components/ui/Button`, etc. Relative imports only for siblings.

### Tailwind CSS v4 — CSS-First `@theme`

- Tokens live **only** in `src/index.css` `@theme` — no `tailwind.config.*` exists. Never re-add one.
- Palette: `oll-blue 50–950` (Marian blue), `oll-gold 100–700`, `oll-rose 50–600`, `oll-sage 50–600` on `oll-cream`/`oll-parchment` surfaces. Shadows `oll`/`oll-lg`, radii `xs–2xl` (editorial).
- Fonts: **Cormorant Garamond** (display, `font-display`) + **Source Sans 3** (body, `font-body`) — loaded via `index.html` Google Fonts `preconnect`.
- Apply bespoke styling only via `@theme` extensions. No arbitrary values — extend the theme.
- Motion vocabulary: `rise-in`/`bloom-drift`/`card-lift` + page/drawer transitions — all gated behind `prefers-reduced-motion` (`@media (prefers-reduced-motion: reduce)` kills animations).

### Routing & Navigation

- Defined in `src/App.tsx` — 10 canonical routes + 7 legacy aliases. **Every new route that replaces an external URL needs an alias.**
- Canonical: `/`, `/about`, `/history`, `/worship`, `/sacraments`, `/ministries`, `/news-events`, `/give`, `/faq`, `*` → `NotFound`.
- Aliases: `/history-of-the-church`→History, `/mass-times`+`/contact-us`→Worship, `/all-sacraments`→Sacraments, `/all-ministries`→Ministries, `/parish-bulletin`+`/church-events`+`/news-and-events`→NewsEvents, `/donate`→Give.
- Hash anchors: `/worship#mass`/`#confession`/`#visit`, `/sacraments#infant-baptism`/`#matrimony`/`#reconciliation`/`#anointing`, `/ministries#liturgical`/`#formation`/`#pastoral`/`#community`. Use `<Link to="/worship#mass">`, never bare `<a href="#mass">` under `HashRouter`.
- Depths validated: `knownRoutePaths` + `resolveHashRedirect` in `src/utils/deepLinks.ts` — drift-guarded by `src/utils/deepLinks.test.ts` against `App.tsx`.

### Data Layer

```ts
// src/data/site.ts — canonical facts, computed getters
site.address.full   // "50 Ophir Road, Singapore 188690"
site.address.query  // encodeURIComponent(full) — for maps

// src/data/nav.ts — typed nav model
primaryNav: NavItem[]  // label, to?, description?, children?: NavLink[]
footerNav: NavLink[]   // flat 10 links

// src/data/content.ts — typed arrays rendered by pages
lifeTimeline: TimelineEntry[]  // 8 entries (1856–2010s)
ministries: Ministry[]         // 6
sacraments: Sacrament[]
faqs: FaqItem[]
upcomingEvents: EventItem[]    // category: Parish | Devotion | Formation | Archdiocese
givingOptions: GivingOption[]
```

Add content by editing `src/data/*` — never hardcode copy in `src/pages/*`.

---

## Development Workflow

### Environment Setup

```bash
bun install                          # preferred — uses bun.lock (frozen in CI)
# or: npm install --legacy-peer-deps # typescript-eslint 8.28.0 peer predates TS 5.9; npm ci alone fails
cp .env.example .env.local 2>/dev/null || true  # only if VITE_* vars are added

bun run dev          # Vite dev server → http://localhost:3000  (--host 0.0.0.0 --strictPort)
bun run build        # vite build && node scripts/inject-csp-hashes.mjs  → dist/index.html (CSP-hashed)
bun run preview      # serve dist → http://localhost:4173
```

### Build Commands

| Command | Purpose | Notes |
|---|---|---|
| `bun run dev` | Vite dev server | Port 3000, HMR. CSP stays `unsafe-inline` (Vite preamble) |
| `bun run build` | Production singlefile + CSP hash | Inlines JS+CSS into `dist/index.html`, hashes inline `<script>` bodies, rewrites `script-src` from `unsafe-inline` to `sha256-…`. Fail-closed on mismatch. `style-src` keeps `unsafe-inline` (React inline style attrs) |
| `bun run preview` | Preview `dist/` | Port 4173 |
| `bun run typecheck` | `tsc --noEmit` | Must be silent |
| `bun run lint` | `eslint . --max-warnings 0` | Flat config — zero warnings allowed |
| `bun run lint:fix` | `eslint . --fix` | Auto-fix |
| `bun run test` | `vitest run` | jsdom, `src/test/setup.ts` (IntersectionObserver + scrollTo + matchMedia mocks) |
| `bun run test:watch` | `vitest` | Watch mode |
| `bun run test:e2e` | `playwright test` | vs dev server :3000 (chromium) |
| `bun run test:e2e:built` | `playwright test --config=playwright.built.config.ts` | vs `dist/` via `vite preview :4173` — the artifact CI ships |
| `bun run test:e2e:ui` | `playwright test --ui` | Interactive |
| `bun run test:e2e:report` | `playwright show-report` | HTML report |

**Pre-push gate (all green):**
```bash
bun run lint && bun run typecheck && bun run test && bun run build && bun run test:e2e:built
# dev E2E (optional local): bun run test:e2e
```

---

## Testing Strategy

### Pyramid

- **Unit (Vitest):** pure utils (`cn`, `massDay`, `categoryTone`, `deepLinks`), data contracts (`site`, `nav`, `content`), token integrity, CSP/headers/CI/repo-hygiene contracts, component units (`Accordion`, `Button`, `Reveal`, `SafeImage`, `Header`, `BackToTop`).
- **Integration:** nav ↔ `App.tsx` alias resolution, hash-anchor `scrollIntoView`, drawer open/close.
- **E2E (Playwright, chromium):** smoke, navigation, aliases+deep-links, worship/sacraments. Runs twice: vs dev and vs built artifact — singlefile rewrites root-relative refs, so the built pass is the truth.

### Where tests live

```
src/**/*.test.{ts,tsx}   # co-located, included by vite.config.ts test.include
e2e/**/*.spec.ts         # excluded from vitest (vite.config.ts test.exclude)
src/test/setup.ts        # jest-dom + IntersectionObserver mock (immediately intersecting) + scrollTo/matchMedia stubs
```

### Current counts (2026-09-06)

- **Vitest:** 71 tests (token-integrity, data, CSP, headers, hygiene, CI contracts + utils).
- **Playwright:** 31 specs × 2 passes (dev + built).

### Running

```bash
bun run test              # run once
bun run test:watch        # watch
bunx vitest run src/utils/cn.test.ts        # single file
bunx vitest run --coverage 2>/dev/null || true  # if coverage is configured
bun run test:e2e          # dev server (playwright.config.ts :3000, chromium channel)
bun run test:e2e:built    # built artifact (playwright.built.config.ts :4173)
```

Mock `IntersectionObserver` is already provided — `Reveal` becomes immediately visible in tests. Don't re-mock it per file.

---

## Code Quality Standards

### Linting & Formatting

```bash
bun run lint        # eslint 9 flat, typescript-eslint, react-hooks, react-refresh — --max-warnings 0
bun run lint:fix    # auto-fix
bun run typecheck   # tsc --noEmit (also catches unused locals/params)
```

- `eslint.config.js` ignores `dist`, `node_modules`, `coverage`, `blessed-sacrament-church`, `skills`, `scripts`, `tool-results`, `upload`, `download`.
- No Prettier config — ESLint + `typescript-eslint` is the formatter. Don't add one without an ADR.

### TypeScript Hygiene

- `strict` + `noUnusedLocals` + `noUnusedParameters` + `noFallthroughCasesInSwitch` are enforced by `tsc`. Unused imports/vars are errors, not warnings.
- `baseUrl: "."` + `paths: { "@/*": ["src/*"] }` — always import via `@/`.

### Design Token Discipline

- New colors/spacing/shadows/radii go in `src/index.css` `@theme` — never as arbitrary `bg-[#...]` in JSX. Guarded by `src/token-integrity.test.ts`.

---

## Git & Version Control

### Branching

- `main` is protected — PRs required, CI must be green.
- Short-lived feature branches: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`. Merge within 1–3 days.
- Never force-push `main`. Never commit `dist/` (it's a build artifact, `.gitignore`'d).

### Commits

- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, `ci:`.
- Atomic commits — one logical change. Reference contract tests when relevant: `test: guard oll-blue-950 token drift`.

### Ignored Paths (`.gitignore` — intentional)

```
node_modules/, dist/, playwright-report/, test-results/
.env, .env.* (except .env.example)
*.pem, *.key, *.ppk, id_rsa*, id_ed25519*, ssh-key*, docs/ssh-key.txt
db/, dev.log, tool-results/, upload/, download/
blessed-sacrament-church/  # vendored reference clone — read-only, not part of this codebase
skills/skills-catalog.md   # intentionally TRACKED — agent tooling contract, do not ignore
```

`src/repo-hygiene.test.ts` fails if key material or any `.gitignore`'d file is tracked. The historical `docs/ssh-key.txt` leak remains in git history — **rotate that key** (see `docs/remediation-plan-2026-09-06.md`).

---

## Error Handling & Debugging

### Approach

- **Anticipate:** validate route params, guard `site.ts` getters, handle missing images via `SafeImage`.
- **Recover gracefully:** `NotFound` for `*`, fallback image for failed `<img>`, no white-screen on bad hash.
- **User-friendly:** no stack traces in UI; errors surface as calm, on-brand messages.
- **Fail-closed builds:** `inject-csp-hashes.mjs` exits non-zero on hash/count mismatch — never suppress.

### Debugging Tools

- **Unit:** `bunx vitest run <file> --reporter=verbose`
- **E2E:** `bun run test:e2e:ui` (Playwright UI), `bun run test:e2e:report` (HTML), `playwright-report/` + `test-results/` artifacts on CI failure.
- **Manual CSP check:** `bun run build && grep -o "script-src[^;]*" dist/index.html` — should show `sha256-…` entries, no `unsafe-inline` in `script-src`.
- **Legacy verifiers:** `node scripts/verify-site.mjs` (24 Playwright self-checks), `node scripts/debug-accordion.mjs`, `node scripts/debug-dropdown.mjs` (headed, local only).

### Common Failure Modes

| Symptom | Cause | Fix |
|---|---|---|
| `eslint` warns but CI fails | `--max-warnings 0` | Fix or `bun run lint:fix`, never raise the threshold |
| `tsc` errors on new file | File outside `include` | Add to `tsconfig.json` `include` or move under `src/` |
| E2E green on dev, red on built | Root-relative asset/data drift after singlefile | Check `playwright.built.config.ts` + `src/token-integrity` vs `dist/index.html` |
| CSP test fails | New inline `<script>` without hash | Re-run `bun run build` — `inject-csp-hashes.mjs` must re-hash |
| `bun install` lock mismatch | `bun.lock` edited | `bun install --frozen-lockfile` locally, commit lockfile |

---

## Communication & Documentation

- Explain **why**, not just what. Document assumptions, constraints, and trade-offs in code comments and PR descriptions.
- Keep `README.md` as the visitor overview, this file as the agent workflow, `docs/remediation-plan-2026-09-06.md` as the security-hardening record, and `worklog.md` as the execution log. If they conflict, executable config wins — then fix the docs in the same commit.
- Parish copy changes: edit `src/data/*`, update the co-located `*.test.ts` contract, and note the source (bulletin, office confirmation, etc.) in the PR.

---

## Project-Specific Standards

### Architecture

```
.github/workflows/ci.yml        # bun: lint → typecheck → unit → build (CSP-injected) → E2E vs dist
index.html                      # meta, OG, JSON-LD Church schema, fonts, CSP meta
e2e/                            # smoke, navigation, aliases, worship/sacraments (31 specs)
playwright.config.ts            # E2E vs dev :3000 (chromium channel)
playwright.built.config.ts      # E2E vs dist :4173 (vite preview)
scripts/inject-csp-hashes.mjs   # post-build CSP hardening (sha256 pinning)
public/_headers                 # Cloudflare Pages security headers
public/images/                  # parish photography (copied to dist/images/ on build)
src/
  data/ site.ts | nav.ts | content.ts   # SSOT — all parish copy
  pages/  Home About History Worship Sacraments Ministries NewsEvents Give FAQ NotFound
  components/ Layout Header Footer PageHero Timeline SafeImage ScrollProgress SkipLink Emblem EventMeta + ui/
  hooks/  useScrolled useScrollProgress useScrollSpy
  utils/  cn massDay categoryTone deepLinks
  index.css                     # @theme tokens + @layer base/utilities (27 utilities + 8 keyframes)
  App.tsx                       # HashRouter + Routes (10 + 7 aliases)
  main.tsx                      # createRoot + resolveHashRedirect pre-mount rewrite
dist/                           # single-file build — gitignored
```

### API Design

No REST/GraphQL layer. If a backend is ever needed, propose:

- `src/data/*` remains the SSOT until a CMS/API ADR is approved.
- New endpoints under `/api/{resource}` with Zod validation, typed responses, and contract tests mirroring today's `content.test.ts` pattern.
- Auth via `Bearer` + `Better Auth` or `Auth.js v5` — never roll your own session.

### Data Layer

See Implementation Standards → Data Layer. Additional invariants:

- `categoryTone(category)` maps `Parish→blue`, `Devotion→gold`, `Formation→sage`, `Archdiocese→rose`.
- `massDayKey(date)` returns `weekdays | saturday | sunday` — single source for "today's Mass" highlighting.
- `nav.test.ts` asserts every `to` resolves to a real route or hash anchor — add a nav link without a route and the test fails.

### Design System — Quick Reference

| Area | Tokens / Classes |
|---|---|
| Colors | `oll-blue-50..950` `#eef3fc→#0a1428` · `oll-gold-100..700` · `oll-rose-50..600` · `oll-sage-50..600` · `oll-cream #f8f5ef` `oll-parchment #efe9da` `oll-stone #d5cab1` `oll-ink #1d2230` `oll-charcoal #3b4150` |
| Type | `font-display` Cormorant Garamond 400/500/600/700 italic · `font-body` Source Sans 3 300–700 |
| Motion | `rise-in` `bloom-drift` `card-lift` + `page-in`/`drawer-in` — all with `prefers-reduced-motion` kill |
| Radii/Shadows | `radius xs–2xl` editorial (sharp chapel corners, pill chips) · `shadow-oll`/`shadow-oll-lg` |
| Utilities | `bg-adobe-texture`, `bg-grain`, `divider-weave`, `gold-rule`, `hero-ken-burns`, `reveal`/`reveal-visible`, `page-in` — see `src/index.css` for the full 27 |

### Environment Variables

| Variable | Purpose | Example | Required |
|---|---|---|---|
| *(none today)* | Static site — no runtime env | — | No |
| `VITE_*` | Future client-exposed vars (maps key, analytics) | `VITE_MAPS_KEY=…` | If added, document here + `src/env.d.ts` + `README.md` |

Never expose secrets via `VITE_*` — they are inlined into `dist/index.html`.

### Security — Build Hardening

Ported from the `blessed-sacrament-church` 2026-09 remediation (`docs/remediation-plan-2026-09-06.md`):

- **CSP hash injection** — `bun run build` hashes every inline `<script>` in `dist/index.html` and rewrites `script-src 'unsafe-inline'` → `script-src 'self' 'sha256-…'`. Fail-closed. Guarded by `src/csp-build-contract.test.ts`.
- **`style-src` keeps `unsafe-inline`** — React inline style *attributes* (`ScrollProgress` width, `Reveal` `animationDelay`) cannot be hash-pinned.
- **Dev untouched** — source `index.html` retains `unsafe-inline` for Vite react-refresh preamble.
- **Host headers** — `public/_headers` ships `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=() …`, `HSTS 31536000` — guarded by `src/headers-contract.test.ts`.
- **Hygiene** — `src/repo-hygiene.test.ts` fails on tracked `*.pem`/`ssh-key*` or any `.gitignore`'d file. `public/_headers` format is contract-tested.

### Accessibility

- Skip link → `#main-content` (see `src/components/SkipLink.tsx` + `src/components/Layout.tsx`).
- Header: full-height focus-trapped mobile drawer, Escape closes, focus restores.
- FAQ: single-open accordion contract (`Accordion.tsx` — one `aria-expanded="true"` at a time).
- Contrast: `oll-ink` on `oll-cream`/`oll-parchment`, `oll-blue-950` on light, gold only as accent/rule — never body text without AA check.
- Motion: every animation has a `prefers-reduced-motion: reduce` override that disables it.

---

## Success Metrics

You are successful when:

- `bun run lint` (0 warnings) + `bun run typecheck` (0 errors) + `bun run test` (71 green) + `bun run build` (CSP-hashed) + `bun run test:e2e:built` (31 green) are all green on a fresh clone.
- New parish facts land in `src/data/*` with matching contract tests — no copy-paste drift.
- No new `any`, no arbitrary Tailwind values, no `BrowserRouter` without host fallback, no `tailwind.config.*`.
- `dist/index.html` remains a single deployable file + `dist/images/` + `dist/_headers`.

---

## Anti-Patterns to Avoid

- **Over-engineering** — don't add a CMS, API, state library, or SSR for brochure content.
- **Template slop** — no `Inter`/`Roboto` defaults, no purple gradients, no generic 3-col hero grids. Whitespace is structure.
- **`any` / `as any`** — fix the type; `unknown` + narrowing instead.
- **Inline `style` for theming** — extend `@theme` tokens.
- **Weakening CSP** — never put `unsafe-inline` back into built `script-src`; never add external `img-src` without an audit.
- **Committing `dist/` or `blessed-sacrament-church/`** — both are `.gitignore`'d for a reason.
- **New routes without alias awareness** — if parishioners bookmark/share the old URL, add the alias in `App.tsx` + `deepLinks.ts`.

---

## Continuous Improvement

- When bumping React/Vite/Tailwind/TS/Playwright, pin exact versions, run the full gate, and update the table in Core Identity + the version note in `src/index.css` header.
- When parish schedules/contacts change, update `src/data/site.ts` and the annex table above in the same PR.
- Periodically run `rg -n "oll-" src/index.css` vs `rg -n "oll-" src/` to catch token drift.
- Use `claude-md:analyze` (audit), `claude-md:validate` (score), and `claude-md:update` (evolve) triggers as the codebase grows.

---

## Appendix — File Map for Agents

| Need | Read |
|---|---|
| Parish facts | `src/data/site.ts` |
| Nav model | `src/data/nav.ts` |
| Ministries / sacraments / events / FAQs | `src/data/content.ts` |
| Routes + aliases | `src/App.tsx` + `src/utils/deepLinks.ts` |
| Tokens + motion | `src/index.css` |
| Build + CSP | `vite.config.ts` + `scripts/inject-csp-hashes.mjs` |
| Headers | `public/_headers` |
| Tests | `src/**/*.test.ts` + `e2e/*.spec.ts` |
| Remediation context | `docs/remediation-plan-2026-09-06.md` + `docs/OLL_Church_Websites_Design_Audit_Report.md` |
