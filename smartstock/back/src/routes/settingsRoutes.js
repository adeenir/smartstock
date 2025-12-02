const express = require('express');
const router = express.Router();
const { Settings } = require('../models');
const { authenticate } = require('../../middleware/authMiddleware');

// Get user settings
router.get('/', authenticate, async (req, res) => {
  try {
    let settings = await Settings.findOne({ where: { userId: req.user.id } });
    if (!settings) {
      // create default settings for the user
      settings = await Settings.create({
        userId: req.user.id,
        notificacoes: true,
        vencimentos: true,
        prazo: true,
        sugestoes: true,
        camera: true,
      });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch settings', error });
  }
});

// Update user settings
router.put('/', authenticate, async (req, res) => {
  try {
    const { notificacoes, vencimentos, prazo, sugestoes, camera } = req.body;
    let settings = await Settings.findOne({ where: { userId: req.user.id } });
    if (!settings) {
      settings = await Settings.create({
        userId: req.user.id,
        notificacoes: !!notificacoes,
        vencimentos: !!vencimentos,
        prazo: !!prazo,
        sugestoes: !!sugestoes,
        camera: !!camera,
      });
    } else {
      await settings.update({ notificacoes, vencimentos, prazo, sugestoes, camera });
    }

    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update settings', error });
  }
});

module.exports = router;
