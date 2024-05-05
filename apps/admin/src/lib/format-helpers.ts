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
