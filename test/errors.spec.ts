import { describe, it, expect } from "vitest";
import { ParsingOutputError } from "../src/types";

describe("ParsingOutputError", () => {
  it("stores generated output and message", () => {
    const err = new ParsingOutputError("boom", '{"a":1}');
    expect(err.message).toBe("boom");
    expect(err.generatedOutput).toBe('{"a":1}');
  });
});
