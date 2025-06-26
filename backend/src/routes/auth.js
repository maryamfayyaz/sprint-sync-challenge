const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const validate = require("../middlewares/validate");
const requireAuth = require('../middlewares/requireAuth');
const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in
 */
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(async (req, res) => {
    const { email, password } = req.validated;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, isAdmin: user.isAdmin },
    });
  })
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                 email:
 *                   type: string
 *                 name:
 *                   type: string
 *                 isAdmin:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { id, email, name, isAdmin } = req.user;
    res.json({ id, email, name, isAdmin });
  })
);

module.exports = router;
