/*
Code from https://github.com/sindresorhus/pretty-bytes/blob/master/index.js
We can't use `pretty-bytes` with `create-react-app` v1.x, a compile error occurs at build time.
because node_modules are not compiled with Babel
*/
const UNITS = ["B", "kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

/*
Formats the given number using `Number#toLocaleString`.
- If locale is a string, the value is expected to be a locale-key (for example: `de`).
- If locale is true, the system default locale is used for translation.
- If no value for locale is specified, the number is returned unmodified.
*/
const numberToLocaleString = (number, locale) => {
  let result = number;
  if (typeof locale === "string") {
    result = number.toLocaleString(locale);
  } else if (locale === true) {
    result = number.toLocaleString();
  }

  return result;
};

export function prettyBytes(number: number, options?: any): string {
  if (!Number.isFinite(number)) {
    throw new TypeError(
      `Expected a finite number, got ${typeof number}: ${number}`,
    );
  }

  options = Object.assign({}, options);

  if (options.signed && number === 0) {
    return " 0 B";
  }

  const isNegative = number < 0;
  const prefix = isNegative ? "-" : options.signed ? "+" : "";

  if (isNegative) {
    number = -number;
  }

  if (number < 1) {
    const numberString = numberToLocaleString(number, options.locale);
    return prefix + numberString + " B";
  }

  const exponent = Math.min(
    Math.floor(Math.log10(number) / 3),
    UNITS.length - 1,
  );
  number = Number((number / 1000 ** exponent).toPrecision(3));
  const numberString = numberToLocaleString(number, options.locale);

  const unit = UNITS[exponent];

  return prefix + numberString + " " + unit;
}
