import { describe, expect, it } from "vitest";
import {
  devotions,
  faqs,
  givingOptions,
  grounds,
  images,
  lifeTimeline,
  ministries,
  sacraments,
  upcomingEvents,
} from "@/data/content";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

describe("content", () => {
  it("lifeTimeline spans 1856 to Today", () => {
    expect(lifeTimeline.length).toBeGreaterThanOrEqual(8);
    expect(lifeTimeline[0].year).toBe("1856");
    expect(lifeTimeline[lifeTimeline.length - 1].year).toBe("Today");
    for (const entry of lifeTimeline) {
      expect(entry.title.length).toBeGreaterThan(0);
      expect(entry.description.length).toBeGreaterThan(0);
    }
  });

  it("grounds has 3 places with local images", () => {
    expect(grounds).toHaveLength(3);
    for (const place of grounds) {
      expect(place.image).toMatch(/^\/images\//);
      expect(place.imageFallback).toMatch(/^\/images\//);
      expect(place.imageAlt.length).toBeGreaterThan(0);
    }
  });

  it("sacraments covers the seven published OLL sacraments", () => {
    expect(sacraments).toHaveLength(7);
    expect(sacraments.map((s) => s.id)).toEqual([
      "infant-baptism",
      "matrimony",
      "communion",
      "confirmation",
      "reconciliation",
      "homebound",
      "anointing",
    ]);
    for (const s of sacraments) {
      expect(s.summary.length).toBeGreaterThan(0);
      expect(s.description.length).toBeGreaterThan(0);
      expect(s.details.length).toBeGreaterThan(0);
    }
  });

  it("ministries groups the twelve published OLL ministries into 4 families", () => {
    expect(ministries.map((m) => m.id)).toEqual([
      "liturgical",
      "formation",
      "pastoral",
      "community",
    ]);
    const detailCount = ministries.reduce(
      (n, m) => n + m.details.length,
      0
    );
    expect(detailCount).toBe(12);
    for (const m of ministries) {
      expect(m.image).toMatch(/^\/images\//);
      expect(m.imageFallback).toMatch(/^\/images\//);
    }
  });

  it("faqs cover mass times, confession, directions, dress code, bookings, and joining", () => {
    expect(faqs).toHaveLength(6);
    const all = faqs.map((f) => f.question + " " + f.answer).join(" ");
    expect(all).toContain("9:30 AM");
    expect(all).toContain("15 minutes");
    expect(all).toContain("Rochor");
    expect(all).toContain("colol.mtn@catholic.org.sg");
    expect(all).toContain("6294 0624");
  });

  it("upcomingEvents have valid categories and the feast leads the parish cycle", () => {
    expect(upcomingEvents).toHaveLength(6);
    const categories = new Set(
      upcomingEvents.map((e) => e.category)
    );
    for (const c of categories) {
      expect(["Parish", "Devotion", "Formation", "Archdiocese"]).toContain(c);
    }
    expect(upcomingEvents[0].title).toContain("Our Lady of Lourdes");
  });

  it("givingOptions stay within verified channels (no invented UEN)", () => {
    expect(givingOptions.length).toBeGreaterThanOrEqual(4);
    const all = JSON.stringify(givingOptions);
    expect(all).toContain("Church of Our Lady of Lourdes");
    expect(all).not.toMatch(/T\d{2}CC\d{4}[A-Z]/); // no fabricated UEN
    expect(all).toContain("6294 0624");
  });

  it("devotions match the published weekday rhythm", () => {
    expect(devotions.length).toBeGreaterThanOrEqual(3);
    const all = JSON.stringify(devotions);
    expect(all).toContain("11:35 AM");
    expect(all).toContain("8:00 AM – 8:00 PM");
  });

  it("image keys resolve to files in public/images", () => {
    for (const key of Object.keys(images) as (keyof typeof images)[]) {
      const file = images[key];
      expect(file.startsWith("/images/"), `${key} must be under /images/`).toBe(
        true
      );
      expect(
        existsSync(resolve(process.cwd(), "public" + file)),
        `${key} -> ${file} must exist on disk`
      ).toBe(true);
    }
  });
});
