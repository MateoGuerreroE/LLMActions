import { describe, it, expect } from "vitest";
import { BooleanParseSchema } from "../src/types";

describe("BooleanParseSchema", () => {
  it("parses true and false values", () => {
    const ok = BooleanParseSchema.parse({ value: true });
    expect(ok.value).toBe(true);
    const ok2 = BooleanParseSchema.parse({ value: false });
    expect(ok2.value).toBe(false);
  });

  it("throws on invalid shape", () => {
    expect(() => BooleanParseSchema.parse({} as any)).toThrow();
    expect(() => BooleanParseSchema.parse({ value: "nope" } as any)).toThrow();
  });
});
