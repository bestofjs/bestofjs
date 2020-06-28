export function shuffle<T>(arr: T[]): T[] {
  if (!Array.isArray(arr)) {
    throw new Error('expected an array')
  }
  var len = arr.length
  var result = Array(len)
  for (var i = 0, rand; i < len; i++) {
    rand = Math.floor(Math.random() * i)
    if (rand !== i) {
      result[i] = result[rand]
    }
    result[rand] = arr[i]
  }
  return result
}
