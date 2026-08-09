// All project logos inside /public/logos folder should have a square shape,
// but some source SVGs ship with a non-square viewBox. This centers the
// shorter dimension to square it
// (and updates the matching width/height attrs), e.g. "0 0 67 61" -> "0 -3 67 67".
// Usage: bun run apps/web/scripts/normalize-logo-viewbox.ts <path/to/logo.svg>
import { readFileSync, writeFileSync } from "node:fs";
import { round } from "es-toolkit";

const VIEW_BOX_RE = /viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/;
const WIDTH_HEIGHT_RE = /width="[\d.]+" height="[\d.]+"/;

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: normalize-logo-viewbox.ts <path/to/logo.svg>");
    process.exit(1);
  }

  const content = readFileSync(path, "utf8");
  const result = normalizeViewBox(content);

  if (!result) {
    console.log(`${path}: already square, skipped`);
    return;
  }

  writeFileSync(path, result.content);
  console.log(`${path}: ${result.from} -> ${result.to}`);
}

function normalizeViewBox(content: string) {
  const match = content.match(VIEW_BOX_RE);
  if (!match) return null;

  const [full, minX, minY, w, h] = match;
  const width = Number(w);
  const height = Number(h);
  if (width === height) return null;

  const size = Math.max(width, height);
  const newMinX = round(Number(minX) - (size - width) / 2, 3);
  const newMinY = round(Number(minY) - (size - height) / 2, 3);

  const withViewBox = content.replace(
    full,
    `viewBox="${newMinX} ${newMinY} ${size} ${size}"`,
  );
  const withSize = withViewBox.replace(
    WIDTH_HEIGHT_RE,
    `width="${size}" height="${size}"`,
  );

  return {
    content: withSize,
    from: `${minX} ${minY} ${w} ${h}`,
    to: `${newMinX} ${newMinY} ${size} ${size}`,
  };
}

main();
