const notie = typeof window === 'undefined' ? {} : require('notie')

const defaultOptions = {
  type: 'SUCCESS',
  duration: 3
}

const getCode = (type) => {
  if (type === 'ERROR') return 3
  if (type === 'WARNING') return 2
  if (type === 'INFO') return 4
  return 1
}

// Screen notification using notie
// code types: 1 => success, 2 => warning, 3 => error, 4 => INFO
export default function (message, { type, duration } = defaultOptions) {
  if (!notie.alert) return console.log('msgbox =>', message)
  notie.alert(getCode(type), message, duration)
}
