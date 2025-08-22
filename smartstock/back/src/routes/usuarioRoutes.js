const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/", usuarioController.adicionar);
router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.buscarPorCodigo);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.deletar);

module.exports = router;
