import vagueTime from 'vague-time'

// Function equivalent to moment(<stringDate>).fromNow()
// but vague-time module is lighter than moment!

export function fromNow(strDate) {
  try {
    const formattedDate = vagueTime.get({ to: new Date(strDate) })
    return formattedDate.replace('a couple of', '2')
  } catch (e) {
    // avoid throwing "Invalid date" errors
    return '?'
  }
}
