import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Token-integrity guard: every `oll-<token>` utility class referenced in
 * non-test `src/` source must be backed by a `--color-oll-<token>` definition
 * in `src/index.css` `@theme`. Tailwind v4 silently drops unknown utilities,
 * so a missing token is an invisible styling no-op.
 */
const root = resolve(__dirname, "..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(join(root, dir))) {
    const rel = `${dir}/${entry}`;
    const full = join(root, rel);
    if (statSync(full).isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

const css = readFileSync(join(root, "src/index.css"), "utf8");
const definedTokens = new Set(
  [...css.matchAll(/--color-oll-([a-z0-9-]+):/g)].map((m) => m[1])
);

const sourceFiles = walk("src").filter(
  (f) => /\.(ts|tsx)$/.test(f) && !/\.test\.(ts|tsx)$/.test(f)
);

const offenders = new Map<string, string[]>();
for (const file of sourceFiles) {
  const text = readFileSync(join(root, file), "utf8");
  const used = new Set(
    [...text.matchAll(/(?<![a-zA-Z-])oll-([a-z]+-[0-9]+|cream|parchment-dark|parchment|stone|ink|charcoal)\b/g)].map(
      (m) => m[1]
    )
  );
  const missing = [...used].filter((t) => !definedTokens.has(t)).sort();
  if (missing.length > 0) offenders.set(file, missing);
}

describe("design-token integrity (src ↔ @theme)", () => {
  it("defines the shadow tokens", () => {
    expect(css).toContain("--shadow-oll:");
    expect(css).toContain("--shadow-oll-lg:");
  });

  it("backs every referenced oll-* class with a defined token", () => {
    expect([...offenders.entries()]).toEqual([]);
  });
});
