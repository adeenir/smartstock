const { Produto, ImagemProduto, Usuario } = require("../models");
const BaseController = require("./ControllerBase.js");
const path = require("path");
const fs = require("fs");

class ProdutoController extends BaseController {
  constructor() {
    super(Produto);
  }

  // Cadastrar novo produto (com imagem opcional)
  async adicionar(req, res) {
    try {
      const {
        nome,
        descricao,
        preco,
        quantidade,
        dataValidade,
        categoria,
        marca,
        codigoBarras,
        usuarioId,
      } = req.body;

      if (!nome || !preco || !usuarioId) {
        return res
          .status(400)
          .json({ message: "Nome, preço e usuário são obrigatórios" });
      }

      // Cria o produto
      const produto = await Produto.create({
        nome,
        descricao,
        preco,
        quantidade,
        dataValidade,
        categoria,
        marca,
        codigoBarras,
        usuarioId,
      });

      // Se tiver imagem enviada, salva o caminho
      if (req.file) {
        const caminhoImagem = `/uploads/${req.file.filename}`;
        await ImagemProduto.create({
          produtoId: produto.id,
          caminho: caminhoImagem,
        });
      }

      // Retorna produto com imagem associada
      const produtoComImagem = await Produto.findByPk(produto.id, {
        include: [{ model: ImagemProduto, as: "imagens" }],
      });

      return res.status(201).json({
        message: "Produto cadastrado com sucesso!",
        produto: produtoComImagem,
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: "Erro ao cadastrar produto" });
    }
  }

  // Listar todos os produtos (com imagens e usuário)
  async listar(req, res) {
    try {
      const produtos = await Produto.findAll({
        include: [
          { model: ImagemProduto, as: "imagens" },
          { model: Usuario, as: "usuario", attributes: ["id", "nome", "email"] },
        ],
      });
      return res.json(produtos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: "Erro ao listar produtos" });
    }
  }

  // Buscar produto por ID
  async buscarPorCodigo(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id, {
        include: [
          { model: ImagemProduto, as: "imagens" },
          { model: Usuario, as: "usuario", attributes: ["id", "nome", "email"] },
        ],
      });

      if (!produto)
        return res.status(404).json({ message: "Produto não encontrado" });

      return res.json(produto);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: "Erro ao buscar produto" });
    }
  }

  // Atualizar dados de um produto
  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const dadosAtualizados = req.body;

      const produto = await Produto.findByPk(id);
      if (!produto)
        return res.status(404).json({ message: "Produto não encontrado" });

      await produto.update(dadosAtualizados);

      // Atualiza imagem, se enviada
      if (req.file) {
        const caminhoImagem = `/uploads/${req.file.filename}`;

        // Remove imagem antiga (opcional)
        const imagemAntiga = await ImagemProduto.findOne({
          where: { produtoId: id },
        });

        if (imagemAntiga) {
          const caminhoFisico = path.resolve(
            __dirname,
            "..",
            `.${imagemAntiga.caminho}`
          );
          if (fs.existsSync(caminhoFisico)) fs.unlinkSync(caminhoFisico);

          await imagemAntiga.destroy();
        }

        await ImagemProduto.create({
          produtoId: id,
          caminho: caminhoImagem,
        });
      }

      const produtoAtualizado = await Produto.findByPk(id, {
        include: [{ model: ImagemProduto, as: "imagens" }],
      });

      return res.json({
        message: "Produto atualizado com sucesso!",
        produto: produtoAtualizado,
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: "Erro ao atualizar produto" });
    }
  }

  // Deletar produto (e imagem associada)
  async deletar(req, res) {
    try {
      const { id } = req.params;
      const produto = await Produto.findByPk(id);

      if (!produto)
        return res.status(404).json({ message: "Produto não encontrado" });

      // Exclui imagens físicas e registros
      const imagens = await ImagemProduto.findAll({ where: { produtoId: id } });
      for (const img of imagens) {
        const caminhoFisico = path.resolve(__dirname, "..", `.${img.caminho}`);
        if (fs.existsSync(caminhoFisico)) fs.unlinkSync(caminhoFisico);
        await img.destroy();
      }

      await produto.destroy();

      return res.json({ message: "Produto excluído com sucesso!" });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: "Erro ao excluir produto" });
    }
  }
}

// Instância do controller e exportação dos métodos
const produtoController = new ProdutoController();
module.exports = {
  adicionar: produtoController.adicionar.bind(produtoController),
  listar: produtoController.listar.bind(produtoController),
  buscarPorCodigo: produtoController.buscarPorCodigo.bind(produtoController),
  atualizar: produtoController.atualizar.bind(produtoController),
  deletar: produtoController.deletar.bind(produtoController),
};
