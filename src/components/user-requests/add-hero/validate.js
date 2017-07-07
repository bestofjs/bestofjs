function checkDuplicate (values, heroes) {
  const found = Object.keys(heroes)
    .map(key => heroes[key])
    .find(hero => hero.username === values.hero.value)
  if (found) return false
  return true
}

export default function validate (values, props) {
  const { heroes } = props
  const errors = {}
  const requiredFields = [
    {
      name: 'hero',
      message: () => 'Please select a user on GitHub'
    },
    {
      name: 'comment',
      message: hero => `Tell us why ${hero.value} is great!`
    }
  ]
  requiredFields
    .filter(field => !values[field.name])
    .forEach(field => {
      errors[field.name] = field.message(values.hero || 'she/he')
    })

  if (values.hero && !checkDuplicate(values, heroes)) {
    errors.hero = `${values.hero.value} already belongs to the hall of fame!`
  }
  return errors
}
