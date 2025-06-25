const { z } = require("zod");

const suggestSchema = z.object({
  title: z.string().min(3),
});

module.exports = { suggestSchema };
