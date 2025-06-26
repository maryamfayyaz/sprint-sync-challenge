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
    const where = req.user.isAdmin ? {} : { userId: req.user.id };

    const [tasks, summary] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      req.user.isAdmin
        ? prisma.task.aggregate({
            _sum: {
              totalMinutes: true,
            },
          })
        : prisma.task.groupBy({
            by: ["userId"],
            where,
            _sum: {
              totalMinutes: true,
            },
          }),
    ]);

    const totalMinutes = req.user.isAdmin
      ? summary._sum?.totalMinutes || 0
      : summary[0]?._sum?.totalMinutes || 0;

    res.json({ tasks, totalMinutes });
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
      where: { id: req.params.id },
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
        userId: req.user.id,
        ...req.validated,
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
router.patch(
  "/:id/status",
  requireAuth,
  validate(statusSchema),
  asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.id);
    const newStatus = req.validated.status;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || (!req.user.isAdmin && task.userId !== req.user.id)) {
      return res.status(404).json({ error: "Task not found" });
    }

    const now = new Date();
    const dataToUpdate = { status: newStatus };

    if (newStatus === "IN_PROGRESS") {
      dataToUpdate.inProgressAt = now;
    } else if (newStatus === "DONE") {
      dataToUpdate.completedAt = now;

      if (task.inProgressAt) {
        const ms = now.getTime() - new Date(task.inProgressAt).getTime();
        const minutes = Math.round(ms / 60000);
        dataToUpdate.totalMinutes = minutes;
      }
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: dataToUpdate,
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
    const taskId = parseInt(req.params.id);
    const newStatus = req.validated.status;

    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task || (!req.user.isAdmin && task.userId !== req.user.id)) {
      return res.status(404).json({ error: "Task not found" });
    }

    const statusTimestamps = {};
    if (newStatus === "IN_PROGRESS") {
      statusTimestamps.inProgressAt = new Date();
    } else if (newStatus === "DONE") {
      statusTimestamps.completedAt = new Date();
    }

    const updated = await prisma.task.update({
      where: { id: taskId },
      data: {
        status: newStatus,
        ...statusTimestamps,
      },
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
