import { describe, expect, it } from "vitest";
import { site } from "@/data/site";

describe("site", () => {
  it("has canonical address 50 Ophir Road with full and encoded query", () => {
    expect(site.address.street).toBe("50 Ophir Road");
    expect(site.address.city).toBe("Singapore");
    expect(site.address.zip).toBe("188690");
    expect(site.address.full).toContain(site.address.street);
    expect(site.address.full).toContain(site.address.zip);
    expect(site.address.query).toBe(encodeURIComponent(site.address.full));
  });

  it("has mapsUrl and mapsEmbedSrc matching google.com/maps", () => {
    expect(site.mapsUrl).toMatch(/google\.com\/maps/);
    expect(site.mapsEmbedSrc).toMatch(/google\.com\/maps/);
  });

  it("has contact phone (+65), secretariat and bookings emails, chequePayee", () => {
    expect(site.contact.officePhone).toBe("+65 6294 0624");
    expect(site.contact.email).toBe("colol.secretariat@catholic.org.sg");
    expect(site.contact.bookingsEmail).toBe("colol.mtn@catholic.org.sg");
    expect(site.chequePayee).toBe("Church of Our Lady of Lourdes");
    // OLL publishes no social accounts or UEN on its website — none invented.
    expect(site).not.toHaveProperty("facebook");
    expect(site).not.toHaveProperty("instagram");
    expect(site).not.toHaveProperty("uen");
  });

  it("has hours for church, office, reception, adoration, confession", () => {
    expect(site.hours.church.length).toBeGreaterThan(0);
    expect(site.hours.office.length).toBeGreaterThan(0);
    expect(site.hours.reception.length).toBeGreaterThan(0);
    expect(site.hours.adoration.length).toBeGreaterThan(0);
    expect(site.hours.confessionWeekday.length).toBeGreaterThan(0);
    expect(site.hours.confessionWeekend.length).toBeGreaterThan(0);
  });

  it("has mass schedule with weekday/saturday/sunday[5]/publicHoliday/confession/adoration", () => {
    expect(site.mass.weekdayEnglish).toBe("12:30 PM");
    expect(site.mass.weekdayTamil).toBe("7:00 PM");
    expect(site.mass.saturday).toContain("5:00 PM");
    expect(site.mass.sunday).toHaveLength(5);
    expect(site.mass.publicHoliday).toHaveLength(2);
    for (const slot of site.mass.sunday) {
      expect(slot.time.length).toBeGreaterThan(0);
      expect(slot.language.length).toBeGreaterThan(0);
    }
    expect(site.mass.confession).toContain("15 minutes");
    expect(site.mass.adoration).toContain("8:00 AM – 8:00 PM");
    expect(site.mass.note).toContain("public holidays");
  });

  it("has feast Our Lady of Lourdes on 11 February", () => {
    expect(site.feast.name).toBe("Our Lady of Lourdes");
    expect(site.feast.date).toBe("11 February");
  });

  it("has canonical url https://ourladyoflourdes.sg with ogImage", () => {
    expect(site.url).toBe("https://ourladyoflourdes.sg/");
    expect(site.ogImage).toBe(
      "https://ourladyoflourdes.sg/images/hero-church.jpg"
    );
  });

  it("exposes archdiocese, holy see, readings, and myCatholic links", () => {
    expect(site.archdiocese).toMatch(/^https:\/\//);
    expect(site.holySee).toMatch(/^http:\/\//);
    expect(site.dailyReadings).toMatch(/^http:\/\//);
    expect(site.myCatholic).toMatch(/^https:\/\//);
  });
});
