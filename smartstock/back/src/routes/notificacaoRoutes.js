'use strict';

const express = require('express');
const router = express.Router();
const NotificacaoController = require('../controllers/NotificacaoController');

router.get('/', NotificacaoController.listar);
router.put('/:id/mark-read', NotificacaoController.marcarComoLida);

module.exports = router;
