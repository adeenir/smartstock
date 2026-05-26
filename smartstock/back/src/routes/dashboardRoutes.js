'use strict';

const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');

router.get('/', DashboardController.listar);
router.get('/all', DashboardController.buscarTodos);
router.get('/:slug', DashboardController.buscarPorSlug);

module.exports = router;
