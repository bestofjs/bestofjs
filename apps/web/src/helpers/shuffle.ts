export function shuffle<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new Error("expected an array");
  }
  const len = arr.length;
  const result = Array(len);
  for (let i = 0, rand; i < len; i++) {
    rand = Math.floor(Math.random() * i);
    if (rand !== i) {
      result[i] = result[rand];
    }
    result[rand] = arr[i];
  }
  return result;
}
