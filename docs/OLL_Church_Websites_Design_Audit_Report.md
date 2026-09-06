# Visual & UX Design Comparison — OLL Church Websites

**Source:** <https://01a074eb-9888-7d3c-82f3-c27a3e430ff3.arena.site/> · **Extracted:** 2026-09-06 · **Method:** headless-browser DOM extraction (see Appendix)

---

**Visual & UX Design Comparison** — OLL Church websites

> **EVIDENCE-BACKED DESIGN AUDIT**
>
> **Comparing the visual aesthetic and UI/UX design of two OLL church websites.**
>
> This report evaluates two React + Vite + Tailwind implementations for the Church of Our Lady of Lourdes, Singapore. Findings are derived from live HTML/CSS inspection and source-code review.
>
> Compared deployments: [Open Site A](https://01a073b3-1058-7981-ba9f-ca26fc390139.arena.site/) · [Open Site B](https://our-lady-of-lourdes.jesspete.shop/)

**Contents** (site navigation): Executive Summary · Visual Identity · Typography · Colour Palette · Layout & Composition · UI Components · Motion & Interaction · Accessibility & Performance · Content & IA · Recommendations

---

## 1. Executive Summary

### Site A — Arena deployment
A polished, production-hardened SPA built on the Blessed Sacrament codebase foundation. It uses **Fraunces** for display type, a sapphire-blue token palette, and proven routing/animation patterns. The design is warm and editorial, though some imagery is inherited from the upstream reference project.

### Site B — jesspete.shop
A redesign that keeps Site A’s architecture but refines the visual identity:**Cormorant Garamond** display type, a Marian blue palette with rose and sage accents, authentic OLL photography, and an improved information architecture (Sacraments page, public-holiday Mass card, stronger data model).

**Overall verdict:** Site B offers the stronger visual identity and content architecture for the parish, while Site A offers the more battle-tested build and test pipeline. The ideal production site would combine Site B’s design and content model with Site A’s CSP/E2E hardening.

## 2. Visual Identity Comparison

| Dimension | Site A (Arena) | Site B (jesspete.shop) | Impact |
| --- | --- | --- | --- |
| Display typeface | Fraunces — a soft, variable serif with rounded terminals and a friendly, editorial warmth. | Cormorant Garamond — a high-contrast classical serif with sharp serifs and a more formal, liturgical tone. | Site A feels contemporary and inviting; Site B feels more solemn, monumental, and historically rooted. |
| Hero headline | A grotto in the city. | The grotto in the city. | The definite article in Site B implies a single, well-known landmark; Site A reads more like a general welcome. |
| Primary palette | bsc-* tokens: sapphire blue (cooler, slightly brighter), gold, cream/parchment, terracotta/pine accents. | oll-* tokens: Marian blue (deeper, slightly greener), gold, rose, sage, cream/parchment. | Site B’s palette is semantically richer (rose for the Mystical Rose, sage for formation) and better tied to parish symbolism. |
| Imagery | Reference-quality photography; some images carried over from the upstream BSC codebase. | Real OLL photography sourced for the project (spire, dusk facade, grotto, nave, stained glass). | Site B’s visuals are site-specific and more credible; Site A can feel slightly generic in places. |
| Page inventory | Home, About, History, Worship, Ministries, News & Events, Serve, Give, FAQ, 404. | Home, About, History, Worship, Sacraments, Ministries, News & Events, Give, FAQ, 404. | Site B adds a dedicated Sacraments page, improving discoverability of Baptism, Marriage, etc. |
| Mass schedule layout | 3 cards: Monday–Friday, Saturday, Sunday. | 4 cards: Monday–Friday, Saturday, Sunday, Public Holidays. | Site B surfaces public-holiday Masses explicitly, reducing user error for visitors. |
| Content model | File-backed content.ts + site.ts; well-typed arrays. | Refined data layer with stronger canonical facts, computed getters, and unit-test guards. | Site B’s data model is more maintainable and has regression protection (47 tests). |

## 3. Typography

Site A
A grotto in the city.
Fraunces is a variable serif with soft, rounded forms and a generous x-height. It gives the parish a contemporary, approachable voice — closer to a modern magazine than a historic monument.

Site B
The grotto in the city.
Cormorant Garamond is a high-contrast classical serif. Its sharp serifs and vertical stress echo the Neo-Gothic architecture and the formal register of a national monument.

### Shared body type
Both sites use **Source Sans 3** for body copy, navigation, and labels. This is a safe, highly legible humanist sans-serif that pairs well with either display serif and keeps long-form reading comfortable across devices.

## 4. Colour Palette

### Site A — Sapphire system

| Token | Hex | Usage |
| --- | --- | --- |
| bsc-sapphire-900 | `#0f1a33` | Hero/footer backgrounds |
| bsc-sapphire-500 | `#3458a8` | Primary links/buttons |
| bsc-gold-400 | `#d4ad42` | Accent, rules, CTAs |
| bsc-parchment | `#efe8d8` | Section bands |
| bsc-cream | `#f8f5ef` | Page background |

### Site B — Marian system

| Token | Hex | Usage |
| --- | --- | --- |
| oll-blue-900 | `#121e3c` | Hero/footer backgrounds |
| oll-blue-600 | `#2c4a8e` | Primary links/buttons |
| oll-gold-400 | `#d4ad42` | Accent, rules, CTAs |
| oll-rose-600 | `#8a4a5f` | Mystical Rose accent |
| oll-sage-600 | `#2f4f37` | Formation accent |

Both palettes share the same conceptual recipe — cream/parchment page, deep blue hero, gold accents — but Site B extends the vocabulary with rose and sage, giving it more thematic range for categories like devotions, formation, and parish life.

## 5. Layout & Composition

### Container rhythm
Both use a centred max-width container with generous vertical padding, creating calm, breathable pages.
### Hero treatment
Full-bleed photography with a dark scrim gradient, Ken Burns motion, and staggered rise-in text.
### Section alternation
Cream and parchment bands alternate, providing clear visual landmarks without heavy borders.
### Card grids
Responsive grids (1 → 2 → 3/4 columns) with subtle borders and hover lift effects.
### Overlap device
A pulled-up quote/overlap card sits at the hero boundary on the Home page.
### Sticky navigation
Fixed header with dropdown menus on desktop and a full-height modal drawer on mobile.

## 6. UI Components & Patterns

| Pattern | Observation |
| --- | --- |
| Buttons | Primary gold-filled CTA, secondary/outline-light, ghost, and icon variants. Consistent across both sites. |
| Cards | card-lift and card-tint utilities provide consistent hover feedback and tonal variation. |
| Navigation | Desktop dropdowns triggered by hover/focus; mobile drawer with Escape and outside-tap close. |
| Hero component | PageHero primitive accepts title, subtitle, image, and variant props; reused across interior pages. |
| Mass cards | Site A uses 3 cards; Site B uses 4 cards (adds Public Holidays) and highlights the current day. |
| Timeline | Vertical timeline with gradient rail and halo pulse for historical milestones. |

## 7. Motion & Interaction

### Shared motion vocabulary
- rise-in staggered entrance animations on hero text.
- reveal utility for scroll-triggered section entrances.
- card-lift hover effect (translateY + shadow + gold border).
- link-underline gold line that draws in on hover/focus.
- drawer-in / menu-in / page-in route/dropdown transitions.

### Accessibility notes
Motion is gated by a global `prefers-reduced-motion` media query that disables animations for users who request reduced motion. Focus states use a visible 2px gold outline with 3px offset. These are strong inclusive-design choices present in both codebases.

## 8. Accessibility & Performance

| Check | Site A | Site B |
| --- | --- | --- |
| Skip link | Yes ✓ | Yes ✓ |
| Visible focus ring | Yes ✓ | Yes ✓ |
| Reduced-motion gate | Yes ✓ | Yes ✓ |
| Semantic landmarks | Yes ✓ | Yes ✓ |
| CSP meta tag | Yes ✓ | Yes ✓ |
| JSON-LD structured data | Yes ✓ | Yes ✓ |
| Open Graph / Twitter cards | Yes ✓ | Yes ✓ |
| Single-file build | Yes ✓ | Yes ✓ |
| Unit tests | None in tree | 47 tests |
| Playwright E2E | 10 specs | Deferred |
| CSP hash injection | Yes ✓ | No ✗ |
| Public _headers file | Yes ✓ | No ✗ |

## 9. Content & Information Architecture

### Site A content model
Content lives in typed arrays in `src/data/content.ts` and canonical site facts in `src/data/site.ts`. The model supports priests, PPC members, timeline, ministries, events, FAQs, and giving options.

### Site B content model
Builds on Site A’s pattern but adds computed getters (e.g., full address), a Sacraments array, more granular Mass data, and unit-test guards against invented facts such as UENs.

### Information-architecture winner
Site B wins on IA clarity: it separates Sacraments from Worship, highlights public holidays, and uses authentic parish copy ("Two tongues, one faith, one family."). Site A is slightly more condensed, which can make key pastoral services harder to discover.

## 10. Strengths & Weaknesses

### Site A strengths
- Mature, stable build pipeline (single-file, CSP hashing, Playwright specs).
- Proven navigation patterns and alias routing.
- Warm Fraunces typography creates approachable, parish-friendly tone.

### Site A weaknesses
- Some imagery is not OLL-specific, weakening authenticity.
- No dedicated Sacraments page; worship content is denser.
- Public-holiday Mass times are not highlighted on the Worship page.

### Site B strengths
- Authentic, site-specific photography increases trust.
- Cormorant Garamond aligns with Neo-Gothic/monument gravitas.
- Sacraments page and public-holiday Mass card improve IA.
- Stronger data model with unit-test coverage.

### Site B weaknesses
- Younger codebase (v1.0.0) with fewer production cycles than Site A.
- Playwright E2E suite noted as deferred debt in worklog.
- Live deploy on a non-canonical subdomain (jesspete.shop).

## 11. Recommendations

### 1. Adopt Site B’s visual direction for production

The Cormorant Garamond + Marian blue + rose/sage system is more distinctive and better matches the national-monument identity.

### 2. Keep Site A’s build hardening

Site A’s CSP hash injection, Playwright E2E scaffolding, and CI workflow should be ported to whichever codebase is canonical.

### 3. Standardise on Site B’s content model

Canonical facts, computed address getters, and unit-test guards reduce the risk of stale or contradictory information.

### 4. Surface public-holiday Masses and Sacraments

Both UX improvements from Site B directly reduce visitor friction and pastoral-office inquiries.

### 5. Audit image provenance

Replace any non-OLL stock/reference images with parish-owned photography or licensed shots to maintain authenticity.

## 12. Evidence & Sources

- **Live Site A HTML:** fetched `01a073b3-1058-7981-ba9f-ca26fc390139.arena.site/index.html` — confirms Fraunces font, bsc-* tokens, single-file React SPA, JSON-LD Church schema.
- **Live Site B HTML:** fetched `our-lady-of-lourdes.jesspete.shop/index.html` — confirms Cormorant Garamond, oll-* tokens, and same SPA architecture.
- **Source review:** raw files from `nordeim/our-lady-of-lourdes-church` and `nordeim/our-lady-of-lourdes` repositories on GitHub.
- **Worklog:** Site B worklog documents design decisions, image sourcing, and verification of 24/24 browser checks.

---

*Comparison generated for evaluation purposes. No affiliation with either host.*

---

## Appendix — Extraction & Verification Notes

*This appendix was added by the extraction agent and is not part of the audited page's content.*

**Extraction method.** The source URL serves an Arena preview wrapper that embeds the audited application in a same-origin sandboxed iframe (loaded with `?embed=true` and `Sec-Fetch-Dest: iframe`). The application is a single-file React + Vite + Tailwind production build (~224 KB minified inline JS, ~21.8 KB inline CSS) rendering entirely client-side into `<div id="root">`. Content was therefore extracted from the **rendered DOM** using a headless browser (agent-browser) after network idle, cross-checked against the accessibility-tree snapshot and full-page screenshots. Raw HTTP requests were used for the wrapper document and response-header inspection.

**Fidelity notes.**

- Section numbering (1–12) was added for report readability; the source page uses unnumbered `<h2>` headings plus a scroll-spy navigation menu (reproduced above as *Contents*).
- Card-grid sections (Colour Palette swatch cards, Accessibility & Performance check cards, Recommendations numbered cards) were re-tabulated into Markdown tables; every token name, hex value, status badge, and sentence is preserved verbatim from the DOM text.
- Check/cross icons were interpreted from their `aria-label="Yes"/"No"` attributes (`lucide-check` / `lucide-x`); text badges ("None in tree", "47 tests", "10 specs", "Deferred") are quoted as rendered.
- The "Skip to content" link and decorative inline SVG icons (`aria-hidden="true"`) are omitted from the body as presentation chrome; the skip link's presence is itself recorded in the audited matrix ("Skip link: A Yes / B Yes").
- The hero tagline is rendered in CSS `uppercase`; it is shown here in caps to match the visual presentation.

**Verification ledger.**

| # | Check | Method | Result |
| --- | --- | --- | --- |
| 1 | Wrapper page reachable — HTTP/2 200, `content-type: text/html`, `server: cloudflare`, `x-frame-options: SAMEORIGIN` | curl response headers | Verified |
| 2 | Inner app document retrieved in full (246,705 bytes; 13 `<section>` blocks + header + footer) | curl with `Sec-Fetch-Dest: iframe` header | Verified |
| 3 | Rendered DOM extraction complete (`#root` innerHTML = 57,732 chars) | agent-browser `eval` on iframe `contentDocument` | Verified |
| 4 | Heading inventory matches DOM census (1×h1, 13×h2, 25×h3) | tag count cross-check | Verified |
| 5 | Browser console clean — no errors or page errors during render | agent-browser `console` / `errors` | Verified |
| 6 | Comparison tables intact (7-row identity table; 6-row components table) | row-count cross-check DOM vs. output | Verified |
| 7 | Both outbound deployment links preserved byte-for-byte from anchor `href`s | href inspection | Verified |
| 8 | No content edits, additions, or omissions beyond the notes above | section-text diff vs. DOM text | Verified |

**Extraction context.** The audited page self-identifies as Arena content — "Content is user-generated and unverified" (wrapper banner). Its factual claims about the two compared deployments were extracted verbatim and were **not** independently re-verified against those deployments in this pass.
