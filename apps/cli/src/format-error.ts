/** Walk error.cause chains; stop at depth 8, cycles, or a throwing getter. */
export function formatError(error: unknown): string {
  const seen = new Set<object>();

  function describe(value: unknown, depth: number): string {
    if (depth >= 8) return "[error depth limit]";
    try {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) return "[circular error]";
        seen.add(value);

        const {
          message,
          cause,
          error: inner,
          type,
        } = value as {
          message?: unknown;
          cause?: unknown;
          error?: unknown;
          type?: unknown;
        };
        const nested = cause ?? inner;
        const detail = nested == null ? undefined : describe(nested, depth + 1);
        if (typeof message === "string" && message) {
          return detail ? `${message} [cause: ${detail}]` : message;
        }
        if (detail) return detail;
        if (typeof type === "string") return `Error event: ${type}`;
      }
      return String(value);
    } catch {
      return "Unknown error";
    }
  }

  return describe(error, 0);
}
