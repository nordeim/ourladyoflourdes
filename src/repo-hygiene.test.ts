import { describe, expect, it } from "vitest";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

/**
 * Repo-hygiene guard — Site B remediation port (from Site A's
 * src/repo-hygiene.test.ts).
 *
 * - No private-key material tracked (docs/ssh-key.txt was found tracked
 *   during the 2026-09 remediation validation; untracked there, guarded here)
 * - No tracked file matches a .gitignore rule (ignore does not untrack)
 *
 * Remediation source: OLL_Church_Websites_Design_Audit_Report.md §10
 * (Site A hardening practices) + plan docs/remediation-plan-2026-09-06.md
 * Task 3. Key rotation remains a manual operational action (see worklog).
 */
const root = resolve(__dirname, "..");

function trackedFiles(): string[] {
  const out = execSync("git ls-files", {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  return out.split("\n").filter(Boolean);
}

describe("no secret material is tracked", () => {
  it("does not track docs/ssh-key.txt", () => {
    const tracked = trackedFiles();
    expect(tracked).not.toContain("docs/ssh-key.txt");
  });

  it("tracks no key-like files anywhere (pem/key/id_rsa/ssh-key patterns)", () => {
    const suspicious = trackedFiles().filter((f) =>
      /(^|\/)(id_rsa|id_ed25519|id_ecdsa)(\..*)?$|\.pem$|\.key$|ssh-key/i.test(f),
    );
    expect(suspicious).toEqual([]);
  });

  it("tracks no private-key material in tracked text surface", () => {
    const offenders: string[] = [];
    for (const file of trackedFiles()) {
      // Docs/skills/e2e prose and binaries are out of scan scope (Site A parity).
      if (/^(docs|skills|e2e|backup)\//.test(file) || /\.md$|\.txt$/.test(file)) continue;
      if (/\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|zip|pdf)$/i.test(file)) continue;
      let text: string;
      try {
        text = execSync(`git show "HEAD:${file.replace(/"/g, '\\"')}" 2>/dev/null`, {
          cwd: root,
          encoding: "utf8",
          maxBuffer: 4 * 1024 * 1024,
        });
      } catch {
        continue;
      }
      if (/-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(text)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});

describe("no tracked file matches a .gitignore rule", () => {
  it("intersection of git ls-files and git check-ignore is empty", () => {
    const tracked = trackedFiles();
    let out = "";
    try {
      out = execSync("git check-ignore --stdin --verbose --non-matching --no-index", {
        cwd: root,
        encoding: "utf8",
        input: `${tracked.join("\n")}\n`,
        maxBuffer: 16 * 1024 * 1024,
      });
    } catch (err) {
      out = (err as { stdout?: string }).stdout ?? "";
    }
    const violations = out
      .split("\n")
      .filter(Boolean)
      .filter((line) => {
        if (line.startsWith("::\t")) return false;
        // Negated pattern (! prefix) means file is explicitly not ignored
        const beforeTab = line.slice(0, line.indexOf("\t"));
        if (beforeTab.includes("!")) return false;
        return true;
      })
      .map((line) => line.slice(line.indexOf("\t") + 1));
    expect(violations.sort()).toEqual([]);
  });
});

describe(".gitignore hygiene", () => {
  it("ignores key material and build output", () => {
    const gi = execSync("cat .gitignore", { cwd: root, encoding: "utf8" });
    expect(gi).toContain("dist/");
    expect(gi).toContain("ssh-key");
  });
});
