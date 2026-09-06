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
| Testing | Vitest + Testing Library (47 unit tests, incl. token-integrity & data guards) |
| Quality | ESLint 9 (flat config, `--max-warnings 0`), `tsc --noEmit`, Playwright browser verification |

## Design system

- **Tokens** — `oll-blue` (Marian blue 50–950), `oll-gold`, `oll-rose`, `oll-sage` on `oll-cream` / `oll-parchment` surfaces; editorial radius and shadow overrides declared once in `src/index.css`.
- **Type** — Cormorant Garamond for display, Source Sans 3 for body.
- **Motion** — a shared "sacred motion" vocabulary (`rise-in`, `bloom-drift`, `card-lift`, page/drawer transitions), every animation gated behind `prefers-reduced-motion`.
- **Accessibility** — skip link, AA-conscious contrast pairings, full-height focus-trapped mobile drawer, single-open FAQ accordion contract.

## Getting started

```bash
bun install        # or: npm install
npm run dev        # dev server on http://localhost:3000
npm run build      # single-file production build into dist/
npm run preview    # serve the production build
npm run test       # vitest unit suites
npm run lint       # eslint, zero warnings allowed
npm run typecheck  # tsc --noEmit
```

## Architecture

```
index.html              # meta, JSON-LD Church schema, fonts, CSP
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
scripts/verify-site.mjs # Playwright self-verification (24 checks)
dist/                   # deployment-ready single-file build + images
```

All parish content is data-driven: pages render from `src/data/*`, and unit tests assert the data contracts (e.g. no invented registration numbers, nav targets must resolve to real routes).

## Parish information (verified)

- **Address** — 50 Ophir Road, Rochor, Singapore 188690
- **Phone** — +65 6294 0624
- **Weekend Masses** — Sat 5:00 pm / 6:15 pm / 7:30 pm (English); Sun 8:00 am / 11:00 am / 12:30 pm (English), 9:30 am / 6:30 pm (Tamil)
- **Weekday Masses** — 12:30 pm (English), 7:00 pm (Tamil); public holidays 9:00 am (English) / 10:00 am (Tamil)
- **Devotions** — Rosary Mon/Wed/Thu/Fri 11:35 am, Sat 4:15 pm; Divine Mercy Tue 11:35 am; Adoration room open 8:00 am – 8:00 pm; Reconciliation 15 minutes before every Mass
- **Feast day** — Our Lady of Lourdes, 11 February

Content is sourced from the parish's published pages (ourladyoflourdes.sg); no facts are invented in the data layer.

## Deployment

`npm run build` emits a self-contained `dist/index.html` (all CSS/JS inlined) plus `dist/images/`, ready for any static host. A `dist/_headers` file ships sane caching and security headers for Cloudflare Pages.

## Credits

- Design & architecture foundation: [blessed-sacrament-church](https://github.com/nordeim/blessed-sacrament-church)
- Content: Our Lady of Lourdes Parish, Singapore (ourladyoflourdes.sg)
