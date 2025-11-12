'use strict';

const { Notificacao, Produto } = require('../models');

const listar = async (req, res) => {
  try {
    const notifications = await Notificacao.findAll({
      include: [{ model: Produto, as: 'produto' }],
      order: [['createdAt', 'DESC']],
    });
    res.json(notifications);
  } catch (err) {
    console.error('Erro ao listar notificações:', err);
    res.status(500).json({ error: 'Erro ao listar notificações' });
  }
};

const marcarComoLida = async (req, res) => {
  try {
    const { id } = req.params;
    const notif = await Notificacao.findByPk(id);
    if (!notif) return res.status(404).json({ error: 'Notificação não encontrada' });
    notif.lida = true;
    await notif.save();
    res.json(notif);
  } catch (err) {
    console.error('Erro ao marcar notificação como lida:', err);
    res.status(500).json({ error: 'Erro ao atualizar notificação' });
  }
};

module.exports = {
  listar,
  marcarComoLida,
};
