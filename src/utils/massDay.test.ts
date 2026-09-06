import { describe, expect, it } from "vitest";
import { massDayKey } from "@/utils/massDay";

/**
 * The Worship page highlights the Mass card matching the visitor's day.
 * massDayKey is the single source for that mapping — getDay(): 0=Sun … 6=Sat.
 */
describe("massDayKey", () => {
  it("maps Sunday (getDay 0) to 'sunday'", () => {
    // 2026-08-30 is a Sunday.
    expect(massDayKey(new Date(2026, 7, 30))).toBe("sunday");
  });

  it("maps Saturday (getDay 6) to 'saturday'", () => {
    expect(massDayKey(new Date(2026, 7, 29))).toBe("saturday");
  });

  it("maps Monday–Friday (getDay 1–5) to 'weekdays'", () => {
    expect(massDayKey(new Date(2026, 7, 31))).toBe("weekdays"); // Mon
    expect(massDayKey(new Date(2026, 8, 1))).toBe("weekdays"); // Tue
    expect(massDayKey(new Date(2026, 8, 2))).toBe("weekdays"); // Wed
    expect(massDayKey(new Date(2026, 8, 3))).toBe("weekdays"); // Thu
    expect(massDayKey(new Date(2026, 8, 4))).toBe("weekdays"); // Fri
  });

  it("maps every date-of-month consistently (31-day sweep, Sept 2026 starts on a Tuesday)", () => {
    const keys = Array.from({ length: 30 }, (_, i) => massDayKey(new Date(2026, 8, i + 1)));
    expect(new Set(keys)).toEqual(new Set(["weekdays", "saturday", "sunday"]));
    expect(keys.filter((k) => k === "sunday")).toHaveLength(4);
    expect(keys.filter((k) => k === "saturday")).toHaveLength(4);
    expect(keys.filter((k) => k === "weekdays")).toHaveLength(22);
  });

  it("always returns one of the three canonical keys", () => {
    for (let day = 0; day < 7; day += 1) {
      const d = new Date(2026, 7, 24 + day); // 2026-08-24 is a Monday
      expect(["weekdays", "saturday", "sunday"]).toContain(massDayKey(d));
    }
  });
});
