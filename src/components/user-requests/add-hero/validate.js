function checkDuplicate(values, heroes) {
  const found = Object.keys(heroes)
    .map(key => heroes[key])
    .find(hero => hero.username === values.hero)
  if (found) return false
  return true
}

export default function validate(heroes) {
  return function (values) {
    const errors = {}
    const requiredFields = [
      {
        name: 'hero',
        message: () => 'Please select a user on Github'
      },
      {
        name: 'comment',
        message: hero => `Tell us why ${hero} is great!`
      }
    ]
    requiredFields
      .filter(field => !values[field.name])
      .forEach(field => {
        errors[field.name] = field.message(values.hero || 'she/he')
      })

    if (heroes && !checkDuplicate(values, heroes)) {
      errors.hero = `${values.hero} already belongs to the hall of fame!`
    }
    return errors
  }
}
