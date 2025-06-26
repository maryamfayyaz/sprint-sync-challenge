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
 *     summary: Generate multiple task prompt and description suggestions using OpenAI
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 example: Improve client onboarding flow
 *     responses:
 *       200:
 *         description: A list of task prompt and description suggestions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 suggestions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       prompt:
 *                         type: string
 *                         example: Audit Onboarding Experience
 *                       description:
 *                         type: string
 *                         example: Review the current onboarding flow to find friction points and improve the process.
 */
router.post(
  "/suggest",
  requireAuth,
  validate(suggestSchema),
  asyncHandler(async (req, res) => {
    const { prompt } = req.validated;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an assistant that suggests improved task titles and helpful descriptions.",
          },
          {
            role: "user",
            content: `I have a task titled: "${prompt}". Suggest 3 improved task titles along with a short description for each. Format each suggestion like this:\n\nTitle: <new title>\nDescription: <description>\n`,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      });

      const raw = completion.choices[0].message.content.trim();

      // Parse suggestions
      const suggestions = raw
        .split(/\n{2,}/) // Split by double newlines
        .map((block) => {
          const titleMatch = block.match(/Title:\s*(.*)/i);
          const descMatch = block.match(/Description:\s*(.*)/i);
          return titleMatch && descMatch
            ? {
                title: titleMatch[1].trim(),
                description: descMatch[1].trim(),
              }
            : null;
        })
        .filter(Boolean);

      res.json({ suggestions });
    } catch (err) {
      console.error("OpenAI error:", err);
      res.status(500).json({ error: "Failed to generate description." });
    }
  })
);

module.exports = router;
