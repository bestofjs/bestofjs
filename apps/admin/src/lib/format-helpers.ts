export function formatStars(stars: number | null) {
  if (stars === null) return "N/A";
  return stars.toLocaleString() + "☆"; // "★" looks cool too
}

export function formatDateTime(date: Date) {
  return date
    .toISOString()
    .replace("T", " ")
    .replace(/\.\d+Z$/, "");
}

export function formatDateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function formatNumber(value: number, formatType: "compact" | "full") {
  switch (formatType) {
    case "full":
      return new Intl.NumberFormat("en-US").format(value);
    default:
      return new Intl.NumberFormat("en-US", {
        maximumSignificantDigits: 3,
        notation: "compact",
      })
        .format(value)
        .replace("K", "k");
  }
}
