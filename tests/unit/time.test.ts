import { describe, expect, it } from "vitest";
import { addDays, currentIssueDate, nextIssueDate, releaseInstant } from "@/domain/time";

describe("Freigabe um 07:00 deutscher Zeit", () => {
  it("rechnet im Sommer mit UTC+2 und im Winter mit UTC+1", () => {
    expect(releaseInstant("2026-07-15").toISOString()).toBe("2026-07-15T05:00:00.000Z");
    expect(releaseInstant("2026-01-15").toISOString()).toBe("2026-01-15T06:00:00.000Z");
  });
  it("stimmt an den Umstellungstagen", () => {
    expect(releaseInstant("2026-03-29").toISOString()).toBe("2026-03-29T05:00:00.000Z");
    expect(releaseInstant("2026-10-25").toISOString()).toBe("2026-10-25T06:00:00.000Z");
  });
  it("wechselt die Ausgabe erst um 07:00", () => {
    expect(currentIssueDate(new Date("2026-07-15T04:59:59Z"))).toBe("2026-07-14");
    expect(currentIssueDate(new Date("2026-07-15T05:00:00Z"))).toBe("2026-07-15");
    expect(currentIssueDate(new Date("2026-01-15T05:59:59Z"))).toBe("2026-01-14");
    expect(currentIssueDate(new Date("2026-01-15T06:00:00Z"))).toBe("2026-01-15");
  });
  it("kommt über Monats- und Jahreswechsel", () => {
    expect(currentIssueDate(new Date("2027-01-01T05:00:00Z"))).toBe("2026-12-31");
    expect(nextIssueDate(new Date("2026-12-31T12:00:00Z"))).toBe("2027-01-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
  });
});
