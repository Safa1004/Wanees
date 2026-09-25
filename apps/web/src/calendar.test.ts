import { describe, it, expect } from "vitest";
import { calendar } from "./api";
describe("Muscat calendar export", () => {
  it("converts 09:00 in Muscat into 05:00 UTC with CRLF", () => {
    const out = calendar("2026-10-10", "09:00");
    expect(out).toContain("DTSTART:20261010T050000Z\r\n");
    expect(out).toContain("DTEND:20261010T060000Z\r\n");
    expect(out).toContain("SUMMARY:Personal appointment");
    expect(out).not.toContain("X-ray");
  });
  it("handles previous UTC date at midnight", () =>
    expect(calendar("2026-10-10", "00:30")).toContain(
      "DTSTART:20261009T203000Z",
    ));
  it("rejects invalid dates", () =>
    expect(() => calendar("invalid", "09:00")).toThrow());
});
