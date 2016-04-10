export default function validate(values) {
  const errors = {};
  const requiredFields = ['rating'];
  requiredFields
    .filter(field => !values[field])
    .forEach(field => {
      errors[field] = 'Please rate the project';
    });
  return errors;
}
