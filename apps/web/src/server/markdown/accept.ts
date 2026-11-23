export const MARKDOWN_FALLBACK_HEADER = "x-bestofjs-markdown-fallback";

/** Wildcard browser Accept headers keep HTML; Markdown must be explicit. */
export function prefersMarkdown(accept: string | null) {
  const ranges = (accept ?? "")
    .toLowerCase()
    .split(",")
    .map((part) => {
      const [type, ...parameters] = part.trim().split(";");
      const parameter = parameters
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const q = parameter ? Number(parameter.slice(2)) : 1;
      return {
        type: type.trim(),
        q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0,
      };
    });
  const quality = (type: string) => {
    for (const pattern of [type, `${type.split("/")[0]}/*`, "*/*"]) {
      const matches = ranges.filter((range) => range.type === pattern);
      if (matches.length) return Math.max(...matches.map((range) => range.q));
    }
    return 0;
  };
  return (
    ranges.some((range) => range.type === "text/markdown") &&
    quality("text/markdown") > 0 &&
    quality("text/markdown") >= quality("text/html")
  );
}
