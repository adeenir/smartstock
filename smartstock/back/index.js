const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de usuário
const usuarioRoutes = require("./src/routes/usuarioRoutes");
app.use("/usuarios", usuarioRoutes);

// Rotas de produto
const produtoRoutes = require("./src/routes/produtoRoutes");
app.use("/produtos", produtoRoutes);

// Rotas de estoque (opcional)
let estoqueRoutes;
try {
  estoqueRoutes = require("./src/routes/estoqueRoutes");
  app.use("/estoques", estoqueRoutes);
} catch (err) {
  console.warn('Rotas de estoque não carregadas: ./src/routes/estoqueRoutes não encontrada.');
}

const PORT = process.env.PORT || 3000;

app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do backend!" });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));