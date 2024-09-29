/**
 * Convert a URLSearchParams object to a plain key-value object we can parse with Zod
 * From: https://github.com/ethanniser/next-typesafe-url/blob/main/packages/next-typesafe-url/src/utils.ts
 */
export function getSearchParamsKeyValues(urlParams: URLSearchParams) {
  const result: Record<string, string | string[] | undefined> = {};

  urlParams.forEach((rawValue, key) => {
    // if a key has no value, URLSearchParams sets the value to an empty string
    // if this is the case, set the value to undefined
    const value = rawValue === "" ? undefined : rawValue;

    const valueAtKey = result[key];

    if (Array.isArray(valueAtKey)) {
      if (value) {
        // if the value in result is an array already, push the value if its not undefined
        valueAtKey.push(value);
      }
    } else if (valueAtKey) {
      // if there is a value and it is not an array, make it an array and push the value if its not undefined
      if (value) {
        result[key] = [valueAtKey, value];
      }
    } else {
      // if there is no value, set the value
      result[key] = value;
    }
  });

  return result;
}
