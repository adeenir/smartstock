class ControllerBase {
  constructor(modelo) {
    this.modelo = modelo;
  }

  async adicionar(req, res) {
    try {
      const item = await this.modelo.create(req.body);
      return res.status(201).json(item);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async listar(req, res) {
    try {
      const itens = await this.modelo.findAll();
      return res.json(itens);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }

  async buscarPorCodigo(req, res) {
    try {
      const item = await this.modelo.findByPk(req.params.id);
      if (!item) {
        return res.status(404).json({ erro: "Não encontrado" });
      }
      return res.json(item);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }

  async atualizar(req, res) {
    try {
      const [atualizado] = await this.modelo.update(req.body, {
        where: { id: req.params.id },
      });
      if (!atualizado) {
        return res.status(404).json({ erro: "Não encontrado" });
      }
      const itemAtualizado = await this.modelo.findByPk(req.params.id);
      return res.json(itemAtualizado);
    } catch (erro) {
      return res.status(400).json({ erro: erro.message });
    }
  }

  async deletar(req, res) {
    try {
      const deletado = await this.modelo.destroy({
        where: { id: req.params.id },
      });
      if (!deletado) {
        return res.status(404).json({ erro: "Não encontrado" });
      }
      return res.status(204).send();
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
}

module.exports = ControllerBase;
