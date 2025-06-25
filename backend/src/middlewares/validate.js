const parseZodError = (error) => {
  return error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
};

const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const errors = parseZodError(parsed.error);
      return res.status(400).json({ errors });
    }

    req.validated = parsed.data;
    next();
  };
};

module.exports = validate;
