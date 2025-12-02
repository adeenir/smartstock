const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { Usuario } = require("../models"); // Importa o model já instanciado
const BaseController = require("./ControllerBase.js");
const jwt = require("jsonwebtoken");

class UsuarioController extends BaseController {
  constructor() {
    super(Usuario);
  }

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ message: "Preencha email e senha" });
      }

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario)
        return res.status(404).json({ message: "Usuário não encontrado" });
      if (usuario.senha !== senha)
        return res.status(401).json({ message: "Senha inválida" });

      // Gerar token com expiração de 1 dia
      const token = jwt.sign(
        { id: usuario.id, email: usuario.email },
        process.env.JWT_SECRET || "segredo_super_secreto",
        { expiresIn: "1d" }
      );

      return res.json({
        message: "Login realizado com sucesso",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
        },
      });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ message: "Erro no login" });
    }
  }

  async resetPassword(req, res) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Informe o email" });

      const usuario = await this.modelo.findOne({ where: { email } });
      if (!usuario)
        return res.status(404).json({ message: "Usuário não encontrado" });

      // Gerar token seguro
      const token = crypto.randomBytes(32).toString("hex");
      const expiration = new Date();
      expiration.setHours(expiration.getHours() + 1); // expira em 1 hora

      usuario.resetToken = token;
      usuario.resetTokenExpiration = expiration;
      await usuario.save();

      // Configuração do Gmail
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetUrl = `http://localhost:3000/usuarios/redefinir-senha/${token}`;

      await transporter.sendMail({
        from: `"SmartStock" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Redefinição de senha",
        html: `<p>Você solicitou redefinição de senha.</p>
               <p>Clique aqui para redefinir: <a href="${resetUrl}">${resetUrl}</a></p>`,
      });

      return res.json({ message: "Email de redefinição enviado!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao enviar email" });
    }
  }

  async updatePassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword)
        return res.status(400).json({ message: "Campos obrigatórios" });

      const usuario = await this.modelo.findOne({
        where: {
          resetToken: token,
          resetTokenExpiration: { [require("sequelize").Op.gt]: new Date() },
        },
      });

      if (!usuario)
        return res.status(400).json({ message: "Token inválido ou expirado" });

      usuario.senha = newPassword; // ⚠️ usar 'senha' conforme seu model
      usuario.resetToken = null;
      usuario.resetTokenExpiration = null;
      await usuario.save();

      return res.json({ message: "Senha redefinida com sucesso!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao redefinir senha" });
    }
  }

  // Change password for authenticated user (requires Bearer token)
  async alterarSenha(req, res) {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
      if (!token) return res.status(401).json({ message: 'Token não fornecido' });

      let payload;
      try {
        payload = jwt.verify(token, process.env.JWT_SECRET || 'segredo_super_secreto');
      } catch (err) {
        return res.status(401).json({ message: 'Token inválido' });
      }

      const usuario = await this.modelo.findByPk(payload.id);
      if (!usuario) return res.status(404).json({ message: 'Usuário não encontrado' });

      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword)
        return res.status(400).json({ message: 'Campos obrigatórios' });

      if (usuario.senha !== currentPassword)
        return res.status(401).json({ message: 'Senha atual inválida' });

      usuario.senha = newPassword;
      await usuario.save();

      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao alterar senha' });
    }
  }

  
}

const usuarioController = new UsuarioController();
module.exports = {
  adicionar: usuarioController.adicionar.bind(usuarioController),
  listar: usuarioController.listar.bind(usuarioController),
  buscarPorCodigo: usuarioController.buscarPorCodigo.bind(usuarioController),
  atualizar: usuarioController.atualizar.bind(usuarioController),
  deletar: usuarioController.deletar.bind(usuarioController),
  login: usuarioController.login.bind(usuarioController),
  resetPassword: usuarioController.resetPassword.bind(usuarioController),
  updatePassword: usuarioController.updatePassword.bind(usuarioController),
  alterarSenha: usuarioController.alterarSenha.bind(usuarioController),
};
