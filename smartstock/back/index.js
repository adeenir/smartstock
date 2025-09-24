const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Rotas de usuário
const usuarioRoutes = require("./src/routes/usuarioRoutes");
app.use("/usuarios", usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Olá do backend!" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});