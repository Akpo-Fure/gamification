const validate = async (schema, data) => {
  if (!schema) return { errors: null, data };
  try {
    await schema.validate(data, { abortEarly: false });
    return { errors: null, data };
  } catch (error) {
    const errors = {};
    error.inner.forEach((e) => {
      errors[e.path] = e.message;
    });
    return { errors, data: null };
  }
};

export default validate;
