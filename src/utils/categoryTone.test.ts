import type { EventItem } from "@/data/content";
import { categoryTone } from "@/utils/categoryTone";

describe("categoryTone", () => {
  const cases: Array<[EventItem["category"], RegExp]> = [
    ["Parish", /oll-blue/],
    ["Devotion", /oll-gold/],
    ["Formation", /oll-sage/],
    ["Archdiocese", /oll-rose/],
  ];

  it.each(cases)("maps %s to its oll tone", (category, pattern) => {
    expect(categoryTone(category)).toMatch(pattern);
  });

  it("always pairs a text tone with a border and background", () => {
    for (const [category] of cases) {
      const tone = categoryTone(category);
      expect(tone).toMatch(/text-/);
      expect(tone).toMatch(/border-/);
      expect(tone).toMatch(/bg-/);
    }
  });
});
