export function truncate(input: string, maxLength = 50) {
  const isTruncated = input.length > maxLength;
  return isTruncated ? `${input.slice(0, maxLength)}...` : input;
}
