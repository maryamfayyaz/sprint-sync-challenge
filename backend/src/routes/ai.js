const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { suggestSchema } = require("../schemas/aiSchema");
const openai = require("../clients/openaiClient");
const requireAuth = require("../middlewares/requireAuth");
const asyncHandler = require("express-async-handler");

/**
 * @swagger
 * /ai/suggest:
 *   post:
 *     summary: Suggest a task description using OpenAI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Suggested description
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 description:
 *                   type: string
 */
router.post(
  "/suggest",
  requireAuth,
  validate(suggestSchema),
  asyncHandler(async (req, res) => {
    const { title } = req.validated;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // or "gpt-4"
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that writes helpful, concise task descriptions.",
          },
          {
            role: "user",
            content: `Write a task description for: "${title}"`,
          },
        ],
        temperature: 0.7,
        max_tokens: 80,
      });

      const description = completion.choices[0].message.content.trim();
      res.json({ description });
    } catch (err) {
      console.error("OpenAI error:", err);
      res.status(500).json({ error: "Failed to generate description." });
    }
  })
);

module.exports = router;
