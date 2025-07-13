export type MetaValue = boolean | number | undefined;
export type MetaResult = { [key: string]: MetaValue };

export type CallbackResult<T> = {
  meta: MetaResult;
  data: T | null; // `null` data returned when errors are triggered
};

type AggregatedMeta = { [key: string]: number };

export function aggregateResults<T>(results: CallbackResult<T>[]) {
  return results.reduce(
    (acc, val) => {
      const meta = Object.entries(val.meta).reduce(sumMetaReducer, acc.meta);
      return {
        meta,
        data: val.data ? [...acc.data, val.data] : acc.data, // skip `null` data
      };
    },
    { meta: {}, data: [] as (T | null)[] },
  );
}

function sumMetaReducer(
  acc: AggregatedMeta,
  [key, value]: [string, MetaResult[keyof MetaResult]],
) {
  const number = convertMetaValueToNumber(value);

  return {
    ...acc,
    [key]: acc[key] ? acc[key] + number : number,
  };
}

function convertMetaValueToNumber(value: MetaValue) {
  if (!value) return 0;
  if (value === true) return 1;
  return value;
}
