const jwt = require('jsonwebtoken');
const { Usuario } = require('../src/models');

async function authenticate(req, res, next) {
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

    // Optionally fetch the user from DB and attach to request
    const usuario = await Usuario.findByPk(payload.id);
    if (!usuario) return res.status(401).json({ message: 'Usuário não encontrado' });

    req.user = { id: usuario.id, email: usuario.email, nome: usuario.nome };
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    res.status(500).json({ message: 'Erro no middleware de autenticação' });
  }
}

module.exports = { authenticate };
