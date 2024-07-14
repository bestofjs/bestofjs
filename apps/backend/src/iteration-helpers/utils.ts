export type CallbackResult<T> = {
  meta: { [key: string]: boolean | number | undefined };
  data: T | null;
};

type Meta = { [key: string]: number };

export function aggregateResults<T>(results: CallbackResult<T>[]) {
  return results.reduce(
    (acc, val) => {
      const meta = Object.entries(val.meta).reduce(sumMetaReducer, acc.meta);
      return {
        meta,
        data: val.data ? [...acc.data, val.data] : acc.data, // skip `null` data
      };
    },
    { meta: {}, data: [] as T[] }
  );
}

function sumMetaReducer(acc: Meta, [key, value]: [string, boolean | number]) {
  function convertResultToNumber(result: number | boolean) {
    if (result === false) return 0;
    if (result === true) return 1;
    return result;
  }
  const number = convertResultToNumber(value);

  return {
    ...acc,
    [key]: acc[key] ? acc[key] + number : number,
  };
}
