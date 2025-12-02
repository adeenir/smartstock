const express = require("express");
const router = express.Router();
const { Settings } = require("../models");
const { authenticate } = require("../middleware/authMiddleware");

// Get user settings
router.get("/", authenticate, async (req, res) => {
  try {
    const settings = await Settings.findOne({ where: { userId: req.user.id } });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch settings", error });
  }
});

// Update user settings
router.put("/", authenticate, async (req, res) => {
  try {
    const { notificacoes, vencimentos, prazo, sugestoes, camera } = req.body;
    const settings = await Settings.findOne({ where: { userId: req.user.id } });

    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    await settings.update({ notificacoes, vencimentos, prazo, sugestoes, camera });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: "Failed to update settings", error });
  }
});

module.exports = router;