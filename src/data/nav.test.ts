import { describe, expect, it } from "vitest";
import { footerNav, primaryNav } from "@/data/nav";

describe("nav", () => {
  it("primaryNav has 6 top-level items", () => {
    expect(primaryNav).toHaveLength(6);
  });

  it("exactly 4 primaryNav items have children (About, Worship, Sacraments, Ministries)", () => {
    const withChildren = primaryNav.filter(
      (item) => item.children && item.children.length > 0
    );
    expect(withChildren).toHaveLength(4);
    expect(withChildren.map((i) => i.label).sort()).toEqual(
      ["About", "Ministries", "Sacraments", "Worship"].sort()
    );
  });

  it("all nav links have label and to (including children)", () => {
    for (const item of primaryNav) {
      expect(item.label.length).toBeGreaterThan(0);
      if (item.to) {
        expect(item.to.length).toBeGreaterThan(0);
      }
      if (item.children) {
        for (const child of item.children) {
          expect(child.label.length).toBeGreaterThan(0);
          expect(child.to.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("Worship children target the three worship anchors", () => {
    const worship = primaryNav.find((n) => n.label === "Worship");
    expect(worship).toBeDefined();
    expect(worship!.children!.map((c) => c.to)).toEqual([
      "/worship#mass",
      "/worship#confession",
      "/worship#visit",
    ]);
  });

  it("Sacraments children are hash-anchored to existing sacrament ids", () => {
    const sacraments = primaryNav.find((n) => n.label === "Sacraments");
    expect(sacraments).toBeDefined();
    for (const child of sacraments!.children!) {
      const [, id] = child.to.split("#");
      expect(id).toBeTruthy();
    }
    expect(sacraments!.children!.map((c) => c.to.split("#")[1])).toContain(
      "infant-baptism"
    );
    expect(sacraments!.children!.map((c) => c.to.split("#")[1])).toContain(
      "anointing"
    );
  });

  it("Ministries children target the four ministry families", () => {
    const ministries = primaryNav.find((n) => n.label === "Ministries");
    expect(ministries).toBeDefined();
    expect(ministries!.children!.map((c) => c.to)).toEqual([
      "/ministries#liturgical",
      "/ministries#formation",
      "/ministries#pastoral",
      "/ministries#community",
    ]);
  });

  it("footerNav has 10 links", () => {
    expect(footerNav).toHaveLength(10);
  });

  it("footerNav covers all major site areas", () => {
    const labels = footerNav.map((l) => l.label);
    expect(labels).toContain("Give");
    expect(labels).toContain("FAQ");
    expect(labels).toContain("Contact");
  });
});
