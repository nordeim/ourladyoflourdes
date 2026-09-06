# Remediation Plan — Port Site A Build/Test Hardening to Site B

**Date:** 2026-09-06 · **Prepared by:** remediation agent (Super Z)
**Inputs:** `OLL_Church_Websites_Design_Audit_Report.md` (evidence-backed design audit) · Site A repo (`nordeim/our-lady-of-lourdes-church`) as hardening reference · Site B repo (`nordeim/ourladyoflourdes`) as remediation target
**Planning skills consulted** (from `skills/skills-catalog.md`, 224 skills reviewed): `planning-and-task-breakdown` (task structure, checkpoints), `tdd-workflow` (RED-GREEN-REFACTOR), `verification-and-review-protocol` (Iron Law — evidence before claims), `how-to-git-push-using-ssh-wrapper` (push mechanism), `static-spa-parish-site` (codebase-family architecture), `security-and-hardening`, `lint-and-validate`.

> Note: the audit's `skills/` folder pointer says "Site A repo"; the `skills/` folder and `skills-catalog.md` actually live in the Site B repo (`ourladyoflourdes`, commit "add skills"). Site A instead carries `blessed-sacrament-queenstown_SKILL.md`. The catalog was located and used regardless.

---

## 1. Overview

The audit's verdict: *the ideal production site would combine Site B's design and content model with Site A's CSP/E2E hardening.* Site B (this repo) already "wins" visual identity, IA, imagery, and data model (audit Recommendations 1, 3, 4 are already satisfied by Site B). The remaining gap is **Recommendation 2 — "Keep Site A's build hardening"**, which the audit's §8 matrix localises to four concrete deficits:

| # | Audit check (§8) | Site A | Site B (verified on this clone) | Remediation |
|---|---|---|---|---|
| 1 | CSP hash injection | Yes | **No** — built `dist/index.html` ships `script-src 'self' 'unsafe-inline'` (verified) | Port `scripts/inject-csp-hashes.mjs` + `.d.mts`, wire `build`, TDD via `src/csp-build-contract.test.ts` |
| 2 | Public `_headers` file | Yes (clean 5-header file) | Present but **malformed** — trailing `*/` line (added in merge commit `2880502`, after the audit snapshot) | Fix format + add `src/headers-contract.test.ts` guard |
| 3 | Playwright E2E | 10 specs | **Deferred** (Site B worklog documents this debt) | Port configs + helpers + 4 OLL-scoped spec files |
| 4 | CI workflow | `.github/workflows/ci.yml` | **None** | Port CI adapted to bun + `ci-workflow.test.ts` guard |

Additional deficit found during validation (not in the audit matrix):

| 5 | Repo hygiene | `src/repo-hygiene.test.ts` guards against key material | **`docs/ssh-key.txt` (a private key) is tracked** | Untrack + `.gitignore` rules + port `src/repo-hygiene.test.ts` |

Already ahead (keep, do not regress): 47 unit tests in 8 files, oll-* token integrity guard, canonical-facts data model, authentic OLL imagery, Sacraments page, public-holiday Mass card.

## 2. Architecture decisions

- **D1 — Port, don't reinvent.** Site A's hardening files carry "OLOL port" annotations themselves (they were ported from blessed-sacrament-church). Porting the same files a third time keeps the family contract identical: pure helpers (`extractInlineScripts`, `sha256`, `rewriteScriptSrc`) + fail-closed CLI + vitest contract importing them.
- **D2 — TDD where a seam exists.** Tests are written and observed failing (RED) before the implementation/wiring that satisfies them (GREEN): CSP contract test → injection script; headers contract test → `_headers` fix; hygiene contract test → untracking; CI contract test → workflow. E2E specs are regression contracts over already-shipped behaviour; they are written first as specifications and iterated to green.
- **D3 — Site B stays on bun.** `bun.lock` is the lockfile of record; CI uses `oven-sh/setup-bun@v2` + `bun install --frozen-lockfile`. (Site A uses pnpm; its CI is ported, not copied verbatim.)
- **D4 — `_headers` keeps `X-Frame-Options: SAMEORIGIN`.** Site B's choice; the audit does not flag it and the change is out of the audit's remediation scope. Only the malformed `*/` line is fixed. (Site A uses DENY — noted for a future decision.)
- **D5 — `docs/ssh-key.txt` is untracked, not history-rewritten.** User constraint: no new branches, commits to main only; history rewrite is out of scope. The key remains in past commits — **rotation is recommended** (Site B worklog already lists "key rotation action"). The hygiene test guards the index going forward, mirroring Site A's approach.
- **D6 — E2E runs Chromium-only, against dev (5173-mapped dev port 3000) and built artifact (vite preview 4173).** The built-artifact config is the audit-meaningful gate: it tests the exact singlefile output that CSP injection rewrites.

## 3. Task list

### Phase 1 — Build hardening (TDD)

**Task 1: CSP hash injection (audit §8 row "CSP hash injection", Recommendation 2)**
- RED: write `src/csp-build-contract.test.ts` — helper contract (extract inline scripts incl. JSON-LD, deterministic base64 sha256, rewrite script-src dropping `'unsafe-inline'`, style-src untouched) + build-wiring contract (`build` == `vite build && node scripts/inject-csp-hashes.mjs`, source `index.html` keeps dev-mode `'unsafe-inline'`). Observe failure (missing module/script).
- GREEN: port `scripts/inject-csp-hashes.mjs` + `scripts/inject-csp-hashes.d.mts` from Site A (helpers exported, CLI fail-closed, vitest-only guard), set `package.json` `build`.
- Verify: contract test green; real `bun run build` → `dist/index.html` script-src contains one `'sha256-…'` per inline script, zero `'unsafe-inline'` in script-src, style-src untouched.
- Files: `src/csp-build-contract.test.ts`, `scripts/inject-csp-hashes.mjs`, `scripts/inject-csp-hashes.d.mts`, `package.json`. Scope: S/M.

**Task 2: `_headers` format fix (audit §8 row "Public _headers file")**
- RED: write `src/headers-contract.test.ts` — file exists, carries the five host security headers, and is **well-formed**: every non-empty line is either the `/*` splat path or an indented `Header: value` continuation; no stray `*/` / non-header tokens.
- GREEN: rewrite `public/_headers` without the trailing `*/` line (keep SAMEORIGIN per D4).
- Verify: contract test green; `dist/_headers` (build copy) identical contract.
- Files: `src/headers-contract.test.ts`, `public/_headers`. Scope: S.

**Task 3: Repo hygiene — untrack key material (validation finding #5)**
- RED: port `src/repo-hygiene.test.ts` from Site A (does not track `docs/ssh-key.txt`; no key-like filenames; no `-----BEGIN … PRIVATE KEY-----` in tracked text files). Observe failure (key is tracked).
- GREEN: `git rm --cached docs/ssh-key.txt`; add `.gitignore` rules for key material (`*.pem`, `*.key`, `ssh-key*`, `id_rsa*`, `id_ed25519*`, `id_ecdsa*`).
- Verify: hygiene test green; `git status` shows key deleted-from-index; local copy preserved at `/home/z/my-project` for the push step.
- Files: `src/repo-hygiene.test.ts`, `.gitignore`, (index-only) `docs/ssh-key.txt`. Scope: S.

**Checkpoint 1:** `bun run lint` + `bun run typecheck` + `bun run test` + `bun run build` all green; `dist/index.html` CSP hash-pinned; `dist/_headers` clean.

### Phase 2 — Playwright E2E suite (audit §8 row "Playwright E2E", worklog "deferred debt")

**Task 4: Tooling**
- Add `@playwright/test` devDependency (lockfile updated via bun); port `playwright.config.ts` (chromium `channel: "chromium"`, `reuseExistingServer`, CI retries, 15 s expect timeout) and `playwright.built.config.ts` (`vite preview` on 4173, `E2E_BASE_URL` override) adapted to Site B's dev port 3000; port `e2e/helpers.ts` (`gotoHash`, `expectHash`); wire scripts `test:e2e`, `test:e2e:built`, `test:e2e:report`; extend `vite.config.ts` test excludes (`e2e/**`, `playwright-report/**`, `test-results/**`); `.gitignore` += `playwright-report/`, `test-results/`; install chromium browser.
- Verify: `bun run test:e2e` boots and runs (specs may fail — Task 5-8 make them green); unit suite unaffected.
- Files: `package.json`, `bun.lock`, `playwright.config.ts`, `playwright.built.config.ts`, `e2e/helpers.ts`, `vite.config.ts`, `.gitignore`. Scope: M.

**Task 5: `e2e/smoke.spec.ts` — home + global identity** (hero "The grotto in the city.", tagline "Two tongues, one faith, one family.", address "50 Ophir Road", phone "+65 6294 0624", quote card, 404 route copy). Scope: S.

**Task 6: `e2e/navigation.spec.ts`** — desktop dropdown (Worship/Sacraments/Ministries) hover→visible→navigate; mobile drawer open/navigate/close (Site A round-audit regressions: current-route tap closes drawer). Scope: M.

**Task 7: `e2e/aliases-deep-links.spec.ts`** — legacy aliases (`/mass-times`, `/contact-us`, `/all-sacraments`, `/donate`, `/news-and-events`, …) land on the right page (h1 assertions); path-style deep links rewrite to hash routes; hash anchors `#mass`, `#confession`, `#visit` reachable. Scope: S.

**Task 8: `e2e/worship-sacraments.spec.ts`** — Worship shows 4 Mass cards including **Public Holidays** (audit Recommendation 4), exactly one current-day highlight, Tamil+English Sunday slots; Sacraments shows 7 sections with scrollspy pills; map iframe on `#visit`. Scope: M.

**Checkpoint 2:** `bun run test:e2e` green; `bun run test:e2e:built` green against the CSP-hardened dist (proves singlefile + injection compatibility).

### Phase 3 — CI workflow (Recommendation 2 "and CI workflow")

**Task 9: Port CI + contract guard**
- RED: port `src/ci-workflow.test.ts` — `.github/workflows/ci.yml` exists, triggers on push/PR to main, gate ordering lint→typecheck→test→e2e→build present.
- GREEN: write `.github/workflows/ci.yml` (bun: `oven-sh/setup-bun@v2`, `bun install --frozen-lockfile`, `bun run lint/typecheck/test`, `bunx playwright install --with-deps chromium`, `bun run test:e2e:built`, `bun run build`, artifact uploads for `dist/` and failure `playwright-report/`).
- Verify: contract test green; YAML parses (`node -e "yaml"` or actionlint if available).
- Files: `.github/workflows/ci.yml`, `src/ci-workflow.test.ts`. Scope: S.

### Phase 4 — Documentation alignment (user requirement)

**Task 10: `docs/remediation-plan-2026-09-06.md`** — this plan, with a validation record (§5) and executed-outcome checkboxes updated as tasks complete. Scope: S.

**Task 11: `README.md`** — document the hardening: build pipeline now includes CSP hash injection; new commands (`test:e2e`, `test:e2e:built`); CI badge/steps; `_headers` note; security section (CSP strategy: script-src hash-pinned in build, style-src keeps `'unsafe-inline'` for React inline styles — documented rationale from Site A round-19). Verify against Site B reality (commands exist, no stale claims).

**Task 12: `worklog.md`** — append remediation entry (Task ID, work log, stage summary) per repo convention.

**Checkpoint 3:** docs-contract spot-check — every command/behaviour claimed in README exists in `package.json`/repo.

### Phase 5 — Final gates + ship

**Task 13: Full gate run (Iron Law evidence)** — lint, typecheck, unit (47+new), build + CSP verification greps, e2e:built. Record outputs.

**Task 14: Commits (main only, no new branch)** — logical sequence:
1. `test(security): CSP hash-injection contract (TDD red→green) + injector port` (Task 1 files)
2. `fix(headers): correct public/_headers format + contract guard` (Task 2)
3. `security(hygiene): untrack key material, add repo-hygiene guard + gitignore rules` (Task 3)
4. `test(e2e): Playwright tooling + OLL smoke/navigation/aliases/worship-sacraments specs` (Tasks 4-8)
5. `ci: GitHub Actions workflow (bun) + contract guard` (Task 9)
6. `docs: remediation plan, README hardening sections, worklog entry` (Tasks 10-12)

**Task 15: Push** — `git remote set-url origin git@github.com:nordeim/ourladyoflourdes.git`; push via `GIT_SSH_COMMAND="…/ssh_git_wrapper_v3.py -i <key> -o StrictHostKeyChecking=accept-new" git push origin main`; verify `git status -sb` shows no ahead/behind (procedure per `how-to-git-push-using-ssh-wrapper` skill, incl. paramiko-in-active-venv check).

## 4. Risks and mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Chromium download blocked/slow in sandbox | E2E can't run locally | Attempt `bunx playwright install chromium` early (Task 4); if blocked, document + keep contract/unit gates, still ship tooling with CI green as the runner |
| E2E flake on cold dev server (dep-optimisation ~1900 modules — Site A's documented experience) | False failures | 15 s expect timeout, `reuseExistingServer`, prefer `test:e2e:built` (no dev-server variable) |
| Key remains in git history after untracking | Secret exposure | Documented constraint (no history rewrite on main); rotation recommended and already flagged in Site B worklog; hygiene test prevents recurrence |
| CSP rewrite vs singlefile plugin interplay | Broken build | Site A proves compatibility (same plugin family); fail-closed CLI + contract test + `test:e2e:built` against hardened dist |
| bun/lockfile drift from adding @playwright/test | CI frozen install fails | Update lockfile via `bun install` in the same step as adding the dep; commit both together |

## 5. Validation record (plan ⇄ Site B alignment check)

- [x] Baseline green before any change: lint 0 warnings, typecheck clean, 47/47 unit tests, build 438.54 kB single file.
- [x] Audit finding re-verified on this clone: built `dist/index.html` contains `script-src 'self' 'unsafe-inline'` (CSP injection absent).
- [x] `_headers` malformed-line finding re-verified (trailing `*/`), origin traced to merge commit `2880502` (post-audit addition).
- [x] `docs/ssh-key.txt` tracked in `git ls-files` and contains `-----BEGIN OPENSSH PRIVATE KEY-----`.
- [x] No `.github/` in Site B; Site A's `ci.yml` gates confirmed (lint→typecheck→test→e2e→build).
- [x] Port sources confirmed readable in Site A: `scripts/inject-csp-hashes.mjs` (+`.d.mts`), `src/csp-build-contract.test.ts`, `src/public-contract.test.ts`, `src/repo-hygiene.test.ts`, `src/ci-workflow.test.ts`, `playwright.config.ts`, `playwright.built.config.ts`, `e2e/*`, `.github/workflows/ci.yml`.
- [x] Site B dev server contract: `vite --port 3000 --host 0.0.0.0 --strictPort` → Playwright `baseURL http://localhost:3000`.
- [x] Route/alias inventory for E2E taken from `src/App.tsx` (19 `<Route>` entries incl. 8 legacy aliases + catch-all) and nav labels from `src/data/nav.ts`; canonical facts from `src/data/site.ts`. Spec strings re-verified in source: hero `The grotto in the city.`, quote `You are not a stranger here. You are home.`, Mass cards Monday–Friday/Saturday/Sunday/**Public Holidays**, worship anchors `#mass` `#confession` `#visit`, sacrament section ids data-driven (`infant-baptism`, `matrimony`, `communion`, `confirmation`, `reconciliation`, `homebound`, …).
- [x] Skill guidance applied: task template/sizing + checkpoints (`planning-and-task-breakdown`), RED-first ordering (`tdd-workflow`), evidence-before-claims gates (`verification-and-review-protocol`), push procedure + paramiko venv gotcha (`how-to-git-push-using-ssh-wrapper`).

## 6. Open questions

- None blocking. Future decisions explicitly out of scope: `X-Frame-Options` DENY vs SAMEORIGIN (D4), ssh-key history purge/rotation execution (D5), Playwright firefox/webkit projects (Site A is also Chromium-only in v1).

## 7. Execution record (2026-09-06)

All tasks executed in plan order with TDD (RED observed before GREEN in every contract task). Final evidence:

| Gate | Result |
|---|---|
| `bun run lint` | 0 warnings |
| `bun run typecheck` | 0 errors |
| `bun run test` (unit) | **12 files / 71 tests passed** (47 baseline + 24 new contract tests) |
| `bun run build` | single-file dist + `[inject-csp-hashes] script-src hardened: 2 inline script(s) pinned by sha256` |
| `bun run test:e2e` (dev) | **31 passed** (4 spec files + helpers) |
| `bun run test:e2e:built` (CSP-hardened dist) | **31 passed** |
| dist CSP | `script-src 'self' 'sha256-…' 'sha256-…'` — zero `'unsafe-inline'` in script-src; residual `'unsafe-inline'` only in style-src (by design) |

**Defect found & fixed by the new E2E suite** (the value of Task 6): the mobile drawer ignored
Escape pressed before its 50 ms self-focus timer fired — `Header.tsx` gained a window-level
Escape listener mirroring the desktop-dropdown contract (also closes the desktop dropdown).

**New files:** `scripts/inject-csp-hashes.mjs`, `scripts/inject-csp-hashes.d.mts`,
`src/csp-build-contract.test.ts`, `src/headers-contract.test.ts`, `src/repo-hygiene.test.ts`,
`src/ci-workflow.test.ts`, `e2e/{smoke,navigation,aliases-deep-links,worship-sacraments}.spec.ts`,
`e2e/helpers.ts`, `playwright.config.ts`, `playwright.built.config.ts`,
`.github/workflows/ci.yml`, `docs/remediation-plan-2026-09-06.md` (this file).

**Modified:** `package.json` (build wiring, e2e scripts, @playwright/test), `bun.lock`,
`vite.config.ts` (vitest excludes), `tsconfig.json` (playwright configs included),
`public/_headers` (stray comment-closer removed), `.gitignore` (secret rules, dist/,
playwright artifacts; removed contradictory `skills/` rule), `README.md`,
`src/components/Header.tsx` (drawer Escape fix), `worklog.md`.

**Untracked:** `docs/ssh-key.txt` (key material; kept out of the index — history retains past
commits, rotation recommended), `dist/` stale build artifacts (regenerated per build).
