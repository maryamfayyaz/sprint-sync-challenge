const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const requireAuth = require("../middlewares/requireAuth");
const { createUserSchema, updateUserSchema } = require("../schemas/userSchema");
const validate = require("../middlewares/validate");
const asyncHandler = require("express-async-handler");

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });

    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, isAdmin: true },
    });
    res.json(users);
  })
);

router.get(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });

    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: { id: true, name: true, email: true, isAdmin: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  })
);

router.post(
  "/",
  requireAuth,
  validate(createUserSchema),
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });

    const { name, email, password, isAdmin } = req.validated;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, isAdmin: !!isAdmin },
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  })
);

router.put(
  "/:id",
  requireAuth,
  validate(updateUserSchema),
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });

    const { password, ...rest } = req.validated;
    const updateData = { ...rest };
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: updateData,
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });

    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).send();
  })
);

module.exports = router;
