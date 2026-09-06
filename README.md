# Our Lady of Lourdes Church · Singapore

> **The grotto in the city.**

A modern, fast, single-page parish website for **Our Lady of Lourdes Church** — 50 Ophir Road, Rochor, Singapore 188690 — Singapore's Gothic Revival "Tamil Church", completed on 13 May 1888 and gazetted as a National Monument in 2005.

The site is rebuilt on the architecture of the [blessed-sacrament-church](https://github.com/nordeim/blessed-sacrament-church) codebase, pairing that design language with a Marian identity: deep blues, liturgical gold, rose and sage set on warm parchment tones.

## Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19 + TypeScript 5.9 (strict) |
| Build | Vite 7 + `vite-plugin-singlefile` (one-file production build) |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens (`oll-*` design system) |
| Routing | `react-router-dom` with `HashRouter` (static-host friendly) |
| Testing | Vitest + Testing Library (71 unit tests, incl. token-integrity, data, CSP, headers, hygiene & CI contracts) |
| E2E | Playwright (Chromium) — 31 specs runnable against dev server and the built artifact (`test:e2e:built`) |
| CI | GitHub Actions (`bun install --frozen-lockfile` → lint → typecheck → unit → build → E2E vs dist) |
| Quality | ESLint 9 (flat config, `--max-warnings 0`), `tsc --noEmit` |

## Design system

- **Tokens** — `oll-blue` (Marian blue 50–950), `oll-gold`, `oll-rose`, `oll-sage` on `oll-cream` / `oll-parchment` surfaces; editorial radius and shadow overrides declared once in `src/index.css`.
- **Type** — Cormorant Garamond for display, Source Sans 3 for body.
- **Motion** — a shared "sacred motion" vocabulary (`rise-in`, `bloom-drift`, `card-lift`, page/drawer transitions), every animation gated behind `prefers-reduced-motion`.
- **Accessibility** — skip link, AA-conscious contrast pairings, full-height focus-trapped mobile drawer, single-open FAQ accordion contract.

## Getting started

```bash
bun install             # or: npm install
bun run dev             # dev server on http://localhost:3000
bun run build           # single-file production build + CSP hash injection
bun run preview         # serve the production build
bun run test            # vitest unit suites
bun run test:e2e        # Playwright suite vs the dev server
bun run test:e2e:built  # Playwright suite vs dist/ via vite preview
bun run test:e2e:report # open the HTML report
bun run lint            # eslint, zero warnings allowed
bun run typecheck       # tsc --noEmit
```

(npm works too: `npm run dev`, `npm run test:e2e`, …)

## Architecture

```
.github/workflows/ci.yml # CI gate (bun): lint, typecheck, unit, build, E2E vs dist
index.html              # meta, JSON-LD Church schema, fonts, CSP
e2e/                    # Playwright specs (smoke, navigation, aliases, worship/sacraments)
playwright.config.ts    # E2E vs dev server (chromium channel, port 3000)
playwright.built.config.ts # E2E vs built artifact (vite preview, port 4173)
scripts/
  inject-csp-hashes.mjs # post-build CSP hardening (script-src sha256 pinning)
  verify-site.mjs       # Playwright self-verification (24 checks, legacy)
src/
  data/                 # single source of truth for all copy
    site.ts             #   canonical parish facts (address, Masses, contacts)
    nav.ts              #   primary + footer navigation model
    content.ts          #   typed arrays: timeline, sacraments, ministries,
                        #   events, giving, devotions, FAQs
  components/           # Layout, Header, Footer, PageHero, Timeline, …
  pages/                # 10 routes + 7 legacy URL aliases from the old site
  hooks/                # useScrolled, useScrollProgress, useScrollSpy
  utils/                # cn, massDay helpers, deep links, category tones
dist/                   # deployment-ready single-file build (gitignored)
```

All parish content is data-driven: pages render from `src/data/*`, and unit tests assert the data contracts (e.g. no invented registration numbers, nav targets must resolve to real routes).

## Build hardening & security

Ported from the hardened our-lady-of-lourdes-church codebase during the 2026-09 remediation
(see `docs/remediation-plan-2026-09-06.md`):

- **CSP hash injection** — `bun run build` = `vite build && node scripts/inject-csp-hashes.mjs`.
  After each build, every inline `<script>` in `dist/index.html` is hashed and the meta CSP's
  `script-src` is rewritten from `'unsafe-inline'` to `'sha256-…'` entries (fail-closed: the CLI
  exits non-zero on any hash/count mismatch). `style-src` deliberately keeps `'unsafe-inline'` —
  React's inline style *attributes* cannot be hash-pinned. Dev mode is untouched (Vite's
  react-refresh preamble is an inline script that only exists in dev). Contract-guarded by
  `src/csp-build-contract.test.ts`.
- **Host security headers** — `public/_headers` (Cloudflare Pages format) ships
  `X-Content-Type-Options`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, `Permissions-Policy`,
  and HSTS for every path. Format-guarded by `src/headers-contract.test.ts`.
- **Repo hygiene** — `src/repo-hygiene.test.ts` fails the suite if key material (e.g.
  `docs/ssh-key.txt`) is tracked or if any tracked file matches a `.gitignore` rule. Secret
  patterns are also blocked in `.gitignore`. **Operational note:** the SSH key previously
  committed at `docs/ssh-key.txt` remains in git history — rotate it.
- **CI** — `.github/workflows/ci.yml` gates every push/PR to `main`:
  lint → typecheck → unit tests → build (CSP-injected) → Playwright E2E against the built
  artifact, with `dist/` and failure reports uploaded as artifacts. Contract-guarded by
  `src/ci-workflow.test.ts`.

## Parish information (verified)

- **Address** — 50 Ophir Road, Rochor, Singapore 188690
- **Phone** — +65 6294 0624
- **Weekend Masses** — Sat 5:00 pm / 6:15 pm / 7:30 pm (English); Sun 8:00 am / 11:00 am / 12:30 pm (English), 9:30 am / 6:30 pm (Tamil)
- **Weekday Masses** — 12:30 pm (English), 7:00 pm (Tamil); public holidays 9:00 am (English) / 10:00 am (Tamil)
- **Devotions** — Rosary Mon/Wed/Thu/Fri 11:35 am, Sat 4:15 pm; Divine Mercy Tue 11:35 am; Adoration room open 8:00 am – 8:00 pm; Reconciliation 15 minutes before every Mass
- **Feast day** — Our Lady of Lourdes, 11 February

Content is sourced from the parish's published pages (ourladyoflourdes.sg); no facts are invented in the data layer.

## Deployment

`bun run build` emits a self-contained `dist/index.html` (all CSS/JS inlined, `script-src`
hash-pinned) plus `dist/images/`, ready for any static host. A `dist/_headers` file ships
caching and security headers for Cloudflare Pages.

## Credits

- Design & architecture foundation: [blessed-sacrament-church](https://github.com/nordeim/blessed-sacrament-church)
- Content: Our Lady of Lourdes Parish, Singapore (ourladyoflourdes.sg)
