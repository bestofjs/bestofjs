import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { message } from "@optique/core/message";
import type { ValueParser } from "@optique/core/valueparser";
import type { z } from "zod";

/**
 * Optique parser for a JSON value: inline `{...}`/`[...]`, or a file path,
 * then Zod-validated.
 */
export function jsonPayload<T>(
  schema: z.ZodType<T>,
  placeholder: T,
): ValueParser<"sync", T> {
  return {
    mode: "sync",
    metavar: "JSON",
    placeholder,
    parse(input) {
      const source = readJsonSource(input);
      if (!source.success) return source;

      const parsed = parseJson(source.value, input);
      if (!parsed.success) return parsed;

      const result = schema.safeParse(parsed.value);
      if (!result.success) {
        return {
          success: false,
          error: message`JSON schema validation failed: ${formatIssues(result.error)}`,
        };
      }

      return { success: true, value: result.data };
    },
    format(value) {
      return JSON.stringify(value);
    },
  };
}

function isInlineJson(input: string) {
  const trimmed = input.trimStart();
  return trimmed.startsWith("{") || trimmed.startsWith("[");
}

function readJsonSource(input: string) {
  if (isInlineJson(input)) {
    return { success: true as const, value: input };
  }

  try {
    return {
      success: true as const,
      value: readFileSync(resolve(process.cwd(), input), "utf8"),
    };
  } catch (error) {
    return {
      success: false as const,
      error: message`Unable to read JSON file ${input}: ${errorMessage(error)}`,
    };
  }
}

function parseJson(source: string, input: string) {
  try {
    return { success: true as const, value: JSON.parse(source) as unknown };
  } catch (error) {
    const location = isInlineJson(input) ? "inline JSON" : `JSON file ${input}`;
    return {
      success: false as const,
      error: message`Invalid ${location}: ${errorMessage(error)}`,
    };
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function formatIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => {
      const path = issue.path.length > 0 ? issue.path.join(".") : "payload";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}
