const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const requireAuth = require("../middlewares/requireAuth");
const {
  createTaskSchema,
  updateTaskSchema,
  statusSchema,
} = require("../schemas/taskSchema");
const validate = require("../middlewares/validate");
const asyncHandler = require("express-async-handler");

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management endpoints
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const tasks = await prisma.task.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(tasks);
  })
);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task data
 *       404:
 *         description: Task not found
 */
router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!task || task.userId !== req.user.id)
      return res.status(404).json({ error: "Task not found" });

    res.json(task);
  })
);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Task created
 */
router.post(
  "/",
  requireAuth,
  validate(createTaskSchema),
  asyncHandler(async (req, res) => {
    const task = await prisma.task.create({
      data: {
        ...req.validated,
        userId: req.user.id,
      },
    });

    res.status(201).json(task);
  })
);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               totalMinutes:
 *                 type: number
 *     responses:
 *       200:
 *         description: Task updated
 */
router.put(
  "/:id",
  requireAuth,
  validate(updateTaskSchema),
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!task || task.userId !== req.user.id)
      return res.status(404).json({ error: "Task not found" });

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: req.validated,
    });

    res.json(updated);
  })
);

/**
 * @swagger
 * /tasks/{id}/status:
 *   patch:
 *     summary: Update task status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [TODO, IN_PROGRESS, DONE]
 *     responses:
 *       200:
 *         description: Status updated
 */

router.patch(
  "/:id/status",
  requireAuth,
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!task || task.userId !== req.user.id)
      return res.status(404).json({ error: "Task not found" });

    const updated = await prisma.task.update({
      where: { id: task.id },
      data: { status: req.validated.status },
    });

    res.json(updated);
  })
);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted
 *       404:
 *         description: Task not found
 */
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const task = await prisma.task.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!task || (task.userId !== req.user.id && !req.user.isAdmin))
      return res.status(404).json({ error: "Task not found" });

    await prisma.task.delete({ where: { id: task.id } });
    res.status(204).send();
  })
);

module.exports = router;
