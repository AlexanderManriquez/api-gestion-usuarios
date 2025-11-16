const { login, refrescarToken } = require('../services/auth.service');
const { toPublicUsuario } = require('../utils/user.util');

async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
    }

    const data = await login(username, password);
    const { accessToken, refreshToken, usuario } = data;

    res.json({
      mensaje: 'Login exitoso',
      accessToken,
      refreshToken,
      usuario: toPublicUsuario(usuario)
    });
  } catch (error) {
    res.status(401).json({ mensaje: error.message });
  }
}

async function refreshTokenController(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ mensaje: 'Token de refresco es obligatorio' });
    }

    const nuevoAccessToken = await refrescarToken(refreshToken);

    res.json({ accessToken: nuevoAccessToken });
  } catch (error) {
    res.status(401).json({ mensaje: error.message });
  }
}

module.exports = {
  loginController,
  refreshTokenController
};