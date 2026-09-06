I'll continue from the previous session. The audit report exists and identifies the key gaps: Site B lacks **CSP hash injection**, a **public `_headers` file**, and a **Playwright E2E suite** (all present in Site A). My job: plan, validate, implement (TDD), document, and push to Site B's repo.

Both repos cloned on `main`. Now updating todos and exploring both codebases:
Note: the `skills/` folder with `skills-catalog.md` is actually inside **Site B**'s repo (`ourladyoflourdes`, commit "add skills"), while Site A has `blessed-sacrament-queenstown_SKILL.md` at root. Let me verify Site A's skills dir and read the catalog:
The catalog has 224 skills. Let me search it for those relevant to this remediation (TDD, security/CSP, E2E testing, CI/CD, verification):
Highly relevant skills identified. Per the user's instruction, let me read the key ones for planning: `tdd`, `static-spa-parish-site` (the codebase family), `how-to-git-push-using-ssh-wrapper`, `planning-and-task-breakdown`, and `verification-and-review-protocol`:
Now let me read the `static-spa-parish-site` skill (the architecture family reference) and explore Site A's build-hardening implementation:
Site A has exactly the three remediation targets: `scripts/inject-csp-hashes.mjs`, `public/_headers`, and 10 E2E specs. Let me read Site A's hardening implementation:
Now examining Site B's structure — package.json, vite config, index.html, src layout, and existing tests:
Key discovery: Site B now has a `public/_headers` (added in a later merge than the audit) but it's **malformed** — the trailing `*/` line. Site A has CI workflow + CSP contract test. Let me read Site A's contract test, CI, and Site B's index.html CSP:
The worklog confirms Playwright E2E was explicitly deferred debt, and I notice `docs/ssh-key.txt` contains a committed private key (the worklog's "key rotation action" hints at this) — a hygiene issue worth guarding. Let me check Site A's identity/parity and its repo-hygiene guard:
This is a goldmine — Site A has a `repo-hygiene.test.ts` that specifically guards `docs/ssh-key.txt` (Site A hit the same key-leak issue and fixed it). Site A is the direct remediation reference. Let me finish exploring Site B's app surface for spec design:
Exploration complete. Now let me establish Site B's baseline: install deps and verify the current gates (lint/typecheck/tests/build) are green before any changes:
Baseline fully green (lint ✓ / typecheck ✓ / 47 tests ✓ / build ✓). Confirming the audit finding in the built artifact:
Audit finding confirmed in the artifact. Exploration and comparison are complete. Updating the worklog and writing the remediation plan:
Plan written to the repo. Now **Task 6 — validate the plan against Site B again** before executing (per user's explicit requirement). Checking every claim: routes, anchors, hero/quote strings, sacrament sections, and the exact strings my future specs will assert:
Plan validated — all claims check out (with two refinements: 19 routes, exact quote string). Now executing **Phase 1, Task 1 — CSP hash injection, TDD RED first**:
RED confirmed (module missing). Now GREEN — port the injector from Site A and wire the build:
Task 1 GREEN — 54/54 tests, dist script-src hash-pinned. Verifying the residual `unsafe-inline` is style-src only, then **Task 2 RED** — headers contract test:
Residual `unsafe-inline` is style-src (by design ✓). The `_headers` trailing `*/` confirmed malformed. Writing the contract test (RED):
The top JSDoc contains a literal `*/` which terminates the comment early. Fixing:
RED for exactly the right reason (stray closer line). GREEN — fix the file:
59/59. **Task 3 RED** — porting the repo-hygiene guard from Site A:
RED confirmed (4 failures — key tracked + .gitignore contradictions). One nuance: `.gitignore` lists `skills/` yet `skills/` **is deliberately tracked** (user relies on `skills-catalog.md` in the repo) — a stale rule contradicting the repo's own content. GREEN: fix `.gitignore` and untrack the key:
`dist/` is tracked (13 stale artifacts — pre-CSP-injection build output). Untracking it for Site A parity:
**Checkpoint 1 green** — 64/64 unit tests, lint clean, typecheck clean. Phase 1 complete. Now **Phase 2 — Playwright tooling (Task 4)**, then specs. First, gather the exact UI strings the specs will assert:
All strings gathered. **Task 4** — add Playwright tooling:
Now wire the vitest excludes and .gitignore for Playwright artifacts, then install the chromium browser:
Full chromium + headless shell both available. Now **Tasks 5–8** — writing the four OLL E2E specs:
Critical discovery: dropdowns are plain `<div>` + `<Link>` (no `menu` roles) — my spec must assert visibility of child links instead. Checking the drawer's Escape handling too:
I see suspicious content — `}, obileOpen]);` and `'aref], button...'` look like corrupted code, yet typecheck passed. Let me read the raw file to verify:
False alarm — the raw file is intact (`}, [mobileOpen]);`, `'a[href], button...'`); the earlier mangled output was a tooling display quirk. The Header contract is: hover/focus opens dropdown (plain links, no `menu` roles), drawer closes on Escape/outside-tap/any-link-tap. Rewriting the navigation spec to the actual markup contract:
Let me verify the MassCard DOM structure before running (my spec has a guessed testid):
MassCard exposes `data-testid="mass-card"` + `data-today` — updating the spec to the real contract:
Now writing the two Playwright configs' remaining piece and running the suite. First the dev-mode E2E run (RED→GREEN iteration):
29/31 passed on first run. Two navigation failures to investigate — let me see the exact error:
Real nav contract: primaryNav is Home/About/Worship/Sacraments/Ministries/**News & Events** — "Give" only lives in the utility bar/footer. Fixing the spec, and fixing the **Escape defect in Header.tsx** (drawer's Escape only works after its 50ms self-focus; the family contract says Escape closes from anywhere):
**Checkpoint 2 green: 64/64 unit + 31/31 E2E.** Now the audit-meaningful gate — E2E against the CSP-hardened built artifact:
**31/31 against the hardened artifact** — singlefile build + CSP hash injection proven compatible. **Phase 3 — Task 9: CI workflow (TDD)**. Reading Site A's ci-workflow test to port:
RED confirmed. GREEN — writing the CI workflow:
Phase 3 green (71/71). **Phase 4 — Documentation (Tasks 10–12)**. Reading Site B's README:
Updating README with the remediated reality:
I accidentally consumed the "Parish information" heading — restoring it:
README complete. Now updating the plan doc with the execution record and appending the worklog entry:
Now the worklog entry (Task 12), following the repo's existing format:
Repo worklog entry confirmed. **Task 13 — final full gate run with fresh evidence**:
All gates green with fresh evidence. **Task 14 — the commit sequence (main only)**. Checking the working state and preparing precise per-commit staging:
package.json separates into 2 hunks. Splitting precisely — CSP commit takes only the build-wiring hunk:
Hunk 1 merges build + e2e script lines — I'll hand-craft a precise patch for the build line only:
Six commits ready. Verifying tree state, then **Task 15 — push via the SSH wrapper** (procedure from the `how-to-git-push-using-ssh-wrapper` skill):
Push succeeded (`2fef852..2d683ff main -> main`). Final verification — remote tip must equal local HEAD:
All done — remediation executed, verified, and pushed. 🎯

**What happened:** Site B (`ourladyoflourdes`) now carries Site A's build hardening per the audit: **CSP hash injection** (`script-src` pinned by sha256, no more `unsafe-inline`), a **fixed `_headers`**, a **31-spec Playwright suite** (passing against both dev server and the CSP-hardened artifact), a **bun CI workflow**, and **repo-hygiene guards** — all via strict TDD (every contract test observed failing first). The suite even caught a real bug: the mobile drawer ignored Escape before its self-focus timer — fixed. Docs (plan + execution record, README, worklog) are aligned, and 6 logical commits landed on `main` (`2fef852..2d683ff`) via the SSH wrapper, remote tip verified.

**Suggested next steps:**
1. **Rotate the GitHub deploy key** — `docs/ssh-key.txt` was untracked but remains in git history (rotation has been flagged in the repo worklog since the merge).
2. Watch the first **CI run** on GitHub Actions to confirm the bun pipeline greens in CI.
3. Optionally decide `X-Frame-Options: DENY` vs `SAMEORIGIN` (kept Site B's choice) and add firefox/webkit Playwright projects later.
