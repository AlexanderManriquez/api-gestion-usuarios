const { login, refrescarToken } = require('../services/auth.service');

async function loginController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });
    }

    const data = await login(username, password);

    res.json({
      mensaje: 'Login exitoso',
      ...data
    });
  } catch (error) {
    res.status(401).json({ mensaje: error.message });
  }
}

function refreshTokenController(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ mensaje: 'Token de refresco es obligatorio' });
    }

    res.json({
      accessToken: nuevoAcccessToken
    });
  } catch (error) {
    res.status(401).json({ mensaje: error.message });
  }
}

module.exports = {
  loginController,
  refreshTokenController
};