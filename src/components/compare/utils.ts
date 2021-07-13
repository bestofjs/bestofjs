import numeral from 'numeral'

export function formatDelta(value: number, options) {
  const formattedNumber = formatNumber(value, options)
  return value > 0 ? `+${formattedNumber}` : formattedNumber
}

export function formatNumber(value: number, { decimals = 0 } = {}) {
  const numberFormat =
    decimals === 0 || value < 1000 ? '0' : `0.${'0'.repeat(decimals)}`
  const formattedNumber = numeral(value).format(`${numberFormat}a`)
  return formattedNumber
}
