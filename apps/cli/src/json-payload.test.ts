import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { z } from "zod";

import { jsonPayload } from "./json-payload";
import { afterEach, describe, expect, it } from "bun:test";

const schema = z.object({ value: z.string() });
const parser = jsonPayload(schema, { value: "" });
const temporaryDirectories: string[] = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("jsonPayload", () => {
  it("parses equivalent inline and file payloads", () => {
    const source = '{"value":"tagging"}';
    const directory = mkdtempSync(join(tmpdir(), "bestofjs-cli-"));
    temporaryDirectories.push(directory);
    const filePath = join(directory, "plan.json");
    writeFileSync(filePath, source);

    expect(parser.parse(source)).toEqual({
      success: true,
      value: { value: "tagging" },
    });
    expect(parser.parse(filePath)).toEqual({
      success: true,
      value: { value: "tagging" },
    });
  });

  it("distinguishes unreadable files, malformed JSON, and invalid schemas", () => {
    const missing = parser.parse("does-not-exist.json");
    const malformed = parser.parse("{");
    const invalid = parser.parse('{"value":42}');

    expect(missing.success).toBeFalse();
    expect(malformed.success).toBeFalse();
    expect(invalid.success).toBeFalse();

    if (missing.success || malformed.success || invalid.success) return;
    expect(missing.error).not.toEqual(malformed.error);
    expect(malformed.error).not.toEqual(invalid.error);
    expect(invalid.error).not.toEqual(missing.error);
  });
});
