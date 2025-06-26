const { z } = require("zod");

const suggestSchema = z.object({
  prompt: z.string().min(3),
});

module.exports = { suggestSchema };
