const express = require("express");
const cors = require("cors");
require("dotenv").config();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images statically (/uploads/<filename>) so frontend can access them
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Rotas de notificações
try {
  const notificacaoRoutes = require('./src/routes/notificacaoRoutes');
  app.use('/notificacoes', notificacaoRoutes);
} catch (err) {
  console.warn('Rotas de notificações não carregadas: ./src/routes/notificacaoRoutes não encontrada.');
}

// Rotas de configurações
const settingsRoutes = require("./src/routes/settingsRoutes");
app.use("/api/settings", settingsRoutes);

const PORT = process.env.PORT || 3000;

app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do backend!" });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Initialize scheduled jobs (notifications)
try {
  const models = require('./src/models');
  const notificationJob = require('./src/jobs/notificationJob');
  notificationJob.init(models);
} catch (err) {
  console.warn('Não foi possível iniciar jobs de notificação automaticamente:', err && err.message ? err.message : err);
}