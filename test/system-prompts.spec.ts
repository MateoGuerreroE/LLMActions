import { describe, it, expect } from "vitest";
import { SYSTEM_PROMPTS } from "../src/constants";

describe("SYSTEM_PROMPTS", () => {
  it("contains required actions", () => {
    expect(Object.keys(SYSTEM_PROMPTS).sort()).toEqual(
      ["EXTRACT", "PROCESS", "SUMMARIZE", "VALIDATE"].sort(),
    );
  });

  it("prompts are non-empty strings", () => {
    for (const k of Object.keys(SYSTEM_PROMPTS)) {
      const v = (SYSTEM_PROMPTS as Record<string, unknown>)[k];
      expect(typeof v).toBe("string");
      expect((v as string).length).toBeGreaterThan(0);
    }
  });
});
