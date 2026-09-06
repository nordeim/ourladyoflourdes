import { describe, expect, it } from "vitest";
import { cn } from "@/utils/cn";

describe("cn", () => {
  it("merges class strings", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("deduplicates conflicting Tailwind classes via tailwind-merge", () => {
    expect(cn("px-2 px-6")).toBe("px-6");
    expect(cn("text-sm text-lg")).toBe("text-lg");
  });

  it("handles conditional and falsy values via clsx", () => {
    const showHidden = false;
    const showB = true;
    const showC = false;
    expect(cn("base", showHidden && "hidden", undefined, null, "extra")).toBe("base extra");
    expect(cn("a", showB && "b", showC && "c")).toBe("a b");
  });

  it("merges palette variants correctly", () => {
    expect(cn("bg-oll-cream bg-oll-blue-900")).toBe("bg-oll-blue-900");
  });

  it("handles array and object inputs", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
    expect(cn({ "px-2": true, "hidden": false, "block": true })).toBe("px-2 block");
  });
});
