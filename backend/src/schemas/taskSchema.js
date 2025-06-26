const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  totalMinutes: z.number().min(0),
  userId: z.number().optional(),
});

const updateTaskSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  totalMinutes: z.number().optional(),
  userId: z.number().optional(),
});

const statusSchema = z.object({
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  statusSchema,
};
