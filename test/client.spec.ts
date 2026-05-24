import { describe, it, expect } from "vitest";
import { LLMActions } from "../src/client";

describe("LLMActions (basic)", () => {
  it("throws for unsupported provider at runtime", () => {
    // Bypass TypeScript with an any cast to simulate an invalid runtime value
    const badArgs: any = { provider: "unknown", client: null, model: "x" };
    expect(() => new LLMActions(badArgs)).toThrow(/Unsupported provider/);
  });
});
