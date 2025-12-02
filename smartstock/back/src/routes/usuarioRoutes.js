const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post("/", usuarioController.adicionar);
router.get("/", usuarioController.listar);
router.get("/:id", usuarioController.buscarPorCodigo);
router.put("/:id", usuarioController.atualizar);
router.delete("/:id", usuarioController.deletar);

router.post("/login", usuarioController.login);
router.post("/redefinir-senha", usuarioController.resetPassword);
router.post("/atualizar-senha", usuarioController.updatePassword);
router.post("/alterar-senha", usuarioController.alterarSenha);

module.exports = router;