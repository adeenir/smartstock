const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const produtoController = require("../controllers/ProdutoController");

// Rotas principais
router.post("/", upload.single("imagem"), produtoController.adicionar);
router.get("/", produtoController.listar);
// Buscar por código de barras
router.get('/barcode/:code', produtoController.buscarPorCodigoBarras);
router.get("/:id", produtoController.buscarPorCodigo);
router.put("/:id", upload.single("imagem"), produtoController.atualizar);
router.delete("/:id", produtoController.deletar);

module.exports = router;
