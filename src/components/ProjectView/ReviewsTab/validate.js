export default function validate(values) {
  const errors = {};
  const requiredFields = ['score'];
  requiredFields
    .filter(field => !values[field])
    .forEach(field => {
      errors[field] = 'Please rate the project';
    });

  console.log('Validation errors', errors);
  return errors;
}
