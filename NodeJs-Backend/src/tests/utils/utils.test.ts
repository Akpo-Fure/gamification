import { areConsecutiveDays } from "../../utils";

describe("areConsecutiveDays", () => {
  it("should return false if either date is undefined", () => {
    expect(areConsecutiveDays(undefined, new Date())).toBe(false);
    expect(areConsecutiveDays(new Date(), undefined)).toBe(false);
    expect(areConsecutiveDays(undefined, undefined)).toBe(false);
  });

  it("should return false if the dates are not consecutive", () => {
    expect(
      areConsecutiveDays(new Date("2022-01-01"), new Date("2022-01-03"))
    ).toBe(false);
    expect(
      areConsecutiveDays(new Date("2022-01-01"), new Date("2022-01-10"))
    ).toBe(false);
    expect(
      areConsecutiveDays(new Date("2022-01-01"), new Date("2022-02-01"))
    ).toBe(false);
  });

  it("should return true if the dates are consecutive", () => {
    expect(
      areConsecutiveDays(new Date("2022-01-01"), new Date("2022-01-02"))
    ).toBe(true);
    expect(
      areConsecutiveDays(new Date("2022-01-01"), new Date("2022-01-02"))
    ).toBe(true);
    expect(
      areConsecutiveDays(new Date("2022-01-01"), new Date("2022-01-02"))
    ).toBe(true);
  });
});
