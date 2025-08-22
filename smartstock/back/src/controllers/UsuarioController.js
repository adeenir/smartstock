const { Usuario } = require("../models");

module.exports = {
  async adicionar(req, res) {
    try {
      const usuario = await Usuario.create(req.body);
      return res.status(201).json(usuario);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async listar(req, res) {
    try {
      const usuarios = await Usuario.findAll();
      return res.json(usuarios);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async buscarPorCodigo(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
      return res.json(usuario);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async atualizar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

      await usuario.update(req.body);
      return res.json(usuario);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  async deletar(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);
      if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });

      await usuario.destroy();
      return res.json({ message: "Usuário excluído com sucesso" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
};
