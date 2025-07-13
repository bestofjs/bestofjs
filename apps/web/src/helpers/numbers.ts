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
