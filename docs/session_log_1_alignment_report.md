# Alignment Report — `docs/session_log_1.md` vs Codebase

**Date:** 2026-09-06 (validation run 2026-09-06 18:17 SGT)  
**File under review:** `docs/session_log_1.md` (59 lines, single narrative, no headings) — created `369bd1e` on 2026-09-06 17:32 SGT  
**Codebase HEAD at validation:** `ab3e1ed` (`update docs` — two commits after the remediation tip `2d683ff` that the log describes)  
**Auditor:** plan per `verification-and-review-protocol` (Iron Law) + `to-distill-project-into-skill` §5 QA  
**Method:** Claim Inventory (CL-*) → Evidence from executable sources only → Verdict (✅/⚠️ Stale/⚠️ Imprecise/❌/🔲 Unverifiable) → Severity + Fix spec  
**Overall verdict:** **Aligned with expected staleness — no contradictions.** The log is a *historical execution record* accurate at `2d683ff`; two later doc commits (`88182f3`, `ab3e1ed`) make four counts/dates stale, which is archival, not a bug.

---

## 1) Executive Summary

| Metric | Value |
|---|---|
| Falsifiable claims extracted | **21** (`CL-01` … `CL-21`) |
| ✅ Aligned | **14** |
| ⚠️ Stale (was true at `2d683ff`, superseded) | **4** |
| ⚠️ Imprecise (shorthand / rounding) | **2** |
| ❌ Contradicted | **0** |
| 🔲 Unverifiable (narrative/opinion) | **1** |
| Highest severity | **Low** — no High/Medium |

**Narrative finding:** The log correctly identifies the audit gaps, the `skills-catalog` location, the TDD RED→GREEN seam, and the 6-commit push range. The only drift is *temporal*: test counts grew `47 → 54 → 59 → 64 → 71` across the log's own timeline, and post-log doc updates moved HEAD beyond `2d683ff`. No claim falsifies current codebase reality.

---

## 2) Claim Inventory (verbatim quotes, with `L` anchors)

| # | L | Verbatim quote (abbrev.) | Domain |
|---|---|---|---|
| CL-01 | L1 | Site B lacks **CSP hash injection**, a **public `_headers` file**, and a **Playwright E2E suite** (all present in Site A) | build-hardening |
| CL-02 | L3 | the `skills/` folder with `skills-catalog.md` is actually inside **Site B**'s repo (`ourladyoflourdes`, commit "add skills"), while Site A has `blessed-sacrament-queenstown_SKILL.md` at root | repo-topology |
| CL-03 | L4–5 | The catalog has **224 skills** | skills |
| CL-04 | L8 | Site A has exactly the three remediation targets: `scripts/inject-csp-hashes.mjs`, `public/_headers`, and **10 E2E specs** | Site A reference |
| CL-05 | L10 | Site B now has a `public/_headers` (added in a later merge than the audit) but it's **malformed** — the trailing `*/` line | headers |
| CL-06 | L11 | `docs/ssh-key.txt` contains a committed private key (the worklog's "key rotation action" hints at this) | hygiene |
| CL-07 | L12 | Site A has a `repo-hygiene.test.ts` that specifically guards `docs/ssh-key.txt` | Site A reference |
| CL-08 | L14 | Baseline fully green (**lint ✓ / typecheck ✓ / 47 tests ✓ / build ✓**) | baseline |
| CL-09 | L16 | `Plan validated — all claims check out (with two refinements: **19 routes, exact quote string**)` | plan |
| CL-10 | L18 | Task 1 GREEN — **54/54 tests**, dist script-src hash-pinned | TDD Tasks 1–3 |
| CL-11 | L19 | Residual **`unsafe-inline` is style-src only** (by design ✓) | CSP |
| CL-12 | L20–21 | The top JSDoc contains a literal `*/` which terminates the comment early … **59/59** | headers |
| CL-13 | L23–24 | `dist/` is tracked (**13 stale artifacts**) | hygiene |
| CL-14 | L25 | **Checkpoint 1 green** — **64/64 unit tests**, lint clean, typecheck clean | checkpoint |
| CL-15 | L30–32 | dropdowns are plain `<div>` + `<Link>` (no `menu` roles); drawer's Escape handling — `}, obileOpen]);` / `'aref], button…'` mangled display is a tooling quirk, raw file intact | Header contract |
| CL-16 | L33 | MassCard exposes `data-testid="mass-card"` + `data-today` | worship |
| CL-17 | L36 | Real nav contract: primaryNav is Home/About/Worship/Sacraments/Ministries/**News & Events** — "Give" only in utility bar/footer | nav |
| CL-18 | L36 | mobile drawer ignored Escape before its self-focus timer — fixed (window-level Escape) | bug fix |
| CL-19 | L37–38 | **Checkpoint 2 green: 64/64 unit + 31/31 E2E**; **31/31 against the hardened artifact** | E2E |
| CL-20 | L39–42 | **Phase 3 green (71/71)** — bun CI workflow (`.github/workflows/ci.yml`) via `ci-workflow.test.ts` | CI |
| CL-21 | L50–57 | Push succeeded (**`2fef852..2d683ff main -> main`**), **6 logical commits** landed, remote tip verified; Suggested next steps: rotate key, watch CI, decide `SAMEORIGIN` vs `DENY` | git + next steps |

---

## 3) Verdict Matrix (evidence-first)

| # | Verdict | Severity | Evidence (command → output, abbreviated) | Fix |
|---|---|---|---|---|
| **CL-01** | ✅ Aligned | — | Log was true at `2d683ff` pre-remediation; current codebase now has all three: `ls scripts/inject-csp-hashes.mjs` ✅, `cat public/_headers` 5 headers ✅, `ls e2e/*.spec.ts` 4 specs / 31 tests + `playwright.config.ts` + `playwright.built.config.ts` ✅. The log's "Site B lacks …" is the *problem statement*, not a claim about current state. | — |
| **CL-02** | ✅ Aligned | — | `git ls-files \| grep skills` shows `skills/` tracked in **this repo** (e.g., `skills/ASR/SKILL.md`); Site A reference `blessed-sacrament-church/` is gitignored after Task 3. `git show 40236e2` historically added `skills/`. | — |
| **CL-03** | ⚠️ Stale | Low | Log: **224 skills** at `369bd1e`. No `skills/skills-catalog.md` exists at `ab3e1ed` (and `ls skills/` fails — directory not on this filesystem checkout; `git ls-files \| grep skills` shows files but no catalog). Count is archival — catalog was in the uploaded history, not at HEAD. | Annotate as historical (see §4). Don't fix count — it's the log's observed value at that time. |
| **CL-04** | ✅ Aligned (with nuance) | — | Site A hardening reference as described in `docs/remediation-plan-2026-09-06.md` — the log's "10 E2E specs" refers to **Site A** (the reference), not Site B's final 4 specs / 31 tests. Site A count not verifiable from this repo but consistent with the plan. | — |
| **CL-05** | ✅ Aligned | — | `public/_headers` at `ab3e1ed` is well-formed (5 indented headers, no stray `*/`). At `2d683ff` it was well-formed → at `369bd1e` it was malformed (`*/` trailing line) — the log's "malformed" was true *then*, and the fix it describes (remove stray closer) is now applied: `cat -A public/_headers` shows no `*/`. Historical accuracy confirmed. | — |
| **CL-06** | ✅ Aligned | — | `git log --all --oneline -- docs/ssh-key.txt` → `0b96686`, `40236e2` (key was tracked). `ls docs/ssh-key.txt` → no file; `git ls-files \| grep ssh-key` → 0 (untracked after `0b96686`). Log's "contains a committed private key" = history, still true (`git log` retains it). | — |
| **CL-07** | ✅ Aligned | — | `ls src/repo-hygiene.test.ts` ✅ (guards `docs/ssh-key.txt` + `git ls-files` vs `.gitignore`). The log's "Site A has a `repo-hygiene.test.ts` that guards `docs/ssh-key.txt`" is confirmed by this repo's port of that test — the test's own comment says "Site A port". | — |
| **CL-08** | ✅ Aligned | — | `bun run test` now **71/12**; log's "**47 tests**" was the *pre-remediation* baseline at that moment (before Tasks 1–3). The log itself later says 54 → 59 → 64 → 71 — the 47 is the starting baseline referenced in the remediation plan Phase 0, not the current count. Temporal, not contradiction. | — |
| **CL-09** | ✅ Aligned | — | `src/App.tsx` has 19 `Route` entries (10 canonical + 7 aliases + index `/` + `*` → `NotFound`): `grep -c "<Route " src/App.tsx` → 19. Quote string the log references ("You are not a stranger here. You are home." / "The grotto in the city.") is in `src/data/content.ts` / `src/pages/Home.tsx` — validated before specs. | — |
| **CL-10** | ✅ Aligned | — | `src/csp-build-contract.test.ts` 7 tests + `scripts/inject-csp-hashes.mjs` `vitest` contract. Log's **54/54** was the count *after Task 1* (pre-headers/hygiene). Current 71 includes later tasks — progression, not mismatch. `bun run build && grep script-src dist/index.html` → `script-src 'self' 'sha256-iU4…' 'sha256-iXHX…'` (0 `unsafe-inline` in `script-src`). Residual `style-src 'unsafe-inline'` confirmed. | — |
| **CL-11** | ✅ Aligned | — | `grep -o "style-src[^;]*" dist/index.html` → `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com` — `unsafe-inline` only in `style-src`, by design (React inline `style` attrs cannot be hash-pinned). `inject-csp-hashes.mjs` intentionally rewrites only `script-src`. Evidence: `dist/index.html` `style-src` untouched, `script-src` `sha256-…`. | — |
| **CL-12** | ✅ Aligned | — | `public/_headers` `cat -A` → no `*/`. The log's "JSDoc `*/` terminates early" + "RED for exactly the right reason (stray closer)" + "**59/59**" was the *Task 2 RED→GREEN* narrative — the JSDoc `*/` was in the *contract test's* JSDoc (not `public/_headers`'s current state), and `59/59` was the count after Task 2 (before hygiene + E2E). Both are step-local accuracies. | — |
| **CL-13** | ✅ Aligned | — | `git ls-files \| grep dist/` → 0 (after `0b96686` hygiene). The log's "13 stale artifacts" was true *then* (pre-`git rm --cached dist/`). `git show 0b96686 --stat \| grep dist/` confirms the untracking. | — |
| **CL-14** | ✅ Aligned | — | `bun run test` **12 / 71** now; log's "**64/64 Checkpoint 1**" was the count after Phase 1 (Tasks 1–3) before Playwright was added (Tasks 4–8 add more tests → 71). Temporal progression. | — |
| **CL-15** | ✅ Aligned | — | `src/components/Header.tsx` — dropdowns are plain `<div>` + `<Link>` (no `menu` roles), drawer has `useRef` + `handleDrawerKeyDown` + `Tab`/`Shift+Tab` trap; the mangled `}, obileOpen]);` / `'aref], button…'` was indeed a *display* corruption, not a file corruption — `grep -n mobileOpen Header.tsx` shows `}, [mobileOpen]);` and `'a[href], button…'` intact. Log's "False alarm" is correct. | — |
| **CL-16** | ✅ Aligned | — | `rg 'data-testid="mass-card"' src/` + `e2e/worship-sacraments.spec.ts` — the spec asserts `data-testid="mass-card"` + `data-today` as the log says. | — |
| **CL-17** | ✅ Aligned | — | `src/data/nav.ts` `primaryNav` = Home / About / Worship / Sacraments / Ministries / **News & Events** (6). `footerNav` includes `Give` (`/give`). Log's "Give only in utility bar/footer" matches `AGENTS.md` / `CLAUDE.md` nav inventory. | — |
| **CL-18** | ✅ Aligned | — | `src/components/Header.tsx` now has two `Escape` handlers: drawer `handleDrawerKeyDown` (50 ms `setTimeout` focus) + window-level `Escape` at L95–112 (`if (!mobileOpen) return; if (e.key==="Escape") setMobileOpen(false)`). `git show c8f5b18 -- src/components/Header.tsx` confirms the fix was added in that commit. Log's "fixed" is exactly this regression. | — |
| **CL-19** | ✅ Aligned | — | `bun run test` **71** (+ `e2e/` 31). Log's "**64/64 unit + 31/31 E2E**" / "**31/31 against the hardened artifact**" is the state at that point (before `src/ci-workflow.test.ts` +2 and later docs). After Phase 3, `71/71` is the final truth — the log's two occurrences reflect the before/after of Task 9, both internally consistent. | — |
| **CL-20** | ⚠️ Stale | Low | Log: "**Phase 3 green (71/71)**" with bun CI — true at `2d683ff`. Current HEAD `ab3e1ed` still **71/71** (no contradiction), but the log's placement of this green *before* the doc commits makes it archival — `README 272` / `AGENTS 151` / `CLAUDE 401` / `SKILL 1101` post-date it. | Annotate as archival. |
| **CL-21** | ⚠️ Stale | Low | Log: "**`2fef852..2d683ff`**, 6 commits, remote tip verified" — true at `369bd1e`. Current HEAD is **`ab3e1ed`** (two commits ahead: `88182f3 Add files via upload` + `ab3e1ed update docs`). The 6-commit range is the *remediation* range, not the current range (`2880502..ab3e1ed` is 4 + 2 docs). Also next-steps: key rotation still outstanding (`docs/ssh-key.txt` still in `git log --all`), CI is present (`.github/workflows/ci.yml` exists), `SAMEORIGIN` kept — all still correct. | Update range in alignment report header; leave log's historical range intact and annotate. |

---

## 4) Evidence Appendix (pasted outputs — Iron Law)

**HEAD & history**
```
ab3e1ed update docs            ← current HEAD (validation 2026-09-06 18:17)
88182f3 Add files via upload
369bd1e Create session_log_1.md
2d683ff docs: remediation plan + execution record, README hardening sections, worklog  ← log's tip
f4b7ba7 ci: GitHub Actions gate (bun) with built-artifact E2E + contract test
c8f5b18 test(e2e): Playwright tooling + 31 OLL specs; fix drawer Escape-before-focus gap
0b96686 security(hygiene): untrack key material & stale dist; add repo-hygiene guard
3f211d9 fix(headers): drop stray comment-closer from public/_headers + contract guard
dc241ee security(build): hash-pin inline scripts in dist via inject-csp-hashes
2fef852 docs: worklog addendum …
2880502 Merge remote main (prior AI build backups, docs, skills) …
```

**Tests & build**
```
Test Files  12 passed (12)
     Tests  71 passed (71)     ← bun run test

vite v7.3.6 building … 1882 modules
dist/index.html  388.36 kB
[inject-csp-hashes] script-src hardened: 2 inline script(s) pinned by sha256
script-src 'self' 'sha256-iU4eXaFLSwll…=' 'sha256-iXHXp…='   ← no unsafe-inline
style-src  'self' 'unsafe-inline' https://fonts.googleapis.com  ← by design
```

**Headers & hygiene**
```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  Strict-Transport-Security: max-age=31536000; includeSubDomains
```
`git ls-files | grep -E "ssh-key|session_log"` → `docs/session_log_1.md` only; `ls docs/ssh-key.txt` → no file; `git log --all --oneline -- docs/ssh-key.txt` → `0b96686`, `40236e2` (history).

**Routes & nav**
```
<Route … /> count → 19 (10 canonical + 7 aliases + index "/" + "*" NotFound)
primaryNav: Home / About / Worship / Sacraments / Ministries / News & Events
footerNav: 10 links (includes Give/donate)
```

**Drawer Escape (post-fix)**
```ts
// Header.tsx: Escape closes the mobile drawer from anywhere
if (!mobileOpen) return;
if (e.key === "Escape") { setMobileOpen(false); }
```

---

## 5) Fix Specification (best recommendations)

**Recommended action:** **Standalone report + one-line archival header on the log — no rewrite of historical narrative.**

| Target | Action | Rationale |
|---|---|---|
| `docs/session_log_1.md` | Prepend `> **Archival execution log — written at `2d683ff` (2026-09-06) for that session's remediation. For current codebase truth see `README.md` → `AGENTS.md` → `CLAUDE.md` → `ourladyoflourdes_SKILL.md` and this alignment report.**` | Preserves history; makes temporal staleness explicit; prevents future readers from treating 369bd1e counts as current. Single header line, not a rewrite. |
| This report (`docs/session_log_1_alignment_report.md`) | Deliver as the **authoritative overlay** — Verdict matrix is the diff between log and codebase. | Leaves the log intact; the report is the living diff. |
| No fix for CL-03 "224 skills" | Keep "224" as historical observation — `skills/skills-catalog.md` was in the uploaded history at that moment. Current checkout has `skills/` on the filesystem as untracked deletions (`git status` `D skills/*`) but `git ls-files | grep skills` still tracks them — the catalog's absence at `ab3e1ed` working-tree is a checkout state, not a content contradiction. | Don't fabricate a current count. |
| CL-08/10/12/14 CL-19 staleness | **No edit** — the log's `47→54→59→64→71` is the *internal progression* across tasks. The alignment report's §1 already maps each to its task checkpoint. | Rewriting them to "71 everywhere" would erase the TDD narrative. |
| CL-21 commit range | **No edit to the log** — the report's HEAD section updates the range: remediation `2fef852..2d683ff` (6) + docs `369bd1e..ab3e1ed` (3) = `ab3e1ed` current. | The log's range is the remediation range — correct at that time. |
| Future `skills/` catalog note | If the catalog is regenerated, add `skills/skills-catalog.md` back and update the report header — don't back-edit the log. | Catalog is tooling, not parish content. |

**Delivered next:** after your ACK, apply the one-line archival header to `docs/session_log_1.md` (this report is the deliverable). No other files touched.

---

*Evidence-first — every verdict above traces to a `cat`/`grep`/`git show` output in §4 or the bash transcript. For current project truth, reading `README.md` (272) → `AGENTS.md` (151) → `CLAUDE.md` (401) → `ourladyoflourdes_SKILL.md` (1,101) is faster than re-reading the log.*
