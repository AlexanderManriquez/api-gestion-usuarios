const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = 'asecretkeyforaccesstoken';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensaje: 'Token de acceso faltante' });
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ mensaje: 'Token de acceso inválido' });
  }

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ mensaje: 'Token de acceso inválido o expirado' });
    }

    req.user = decoded;
    next();
  });
}

module.exports = authMiddleware;