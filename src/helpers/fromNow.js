import vagueTime from 'vague-time';

// Function equivalent to moment(<stringDate>).fromNow()
// but vague-time module is lighter than moment!

export default function (strDate) {
  return vagueTime.get({
    to: new Date(strDate),
  });
}
