const { z } = require("zod");

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  isAdmin: z.boolean().optional(),
});

const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  isAdmin: z.boolean().optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};
