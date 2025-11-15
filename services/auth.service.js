const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { buscarUsuarioPorUsername } = require('./usuario.service');

const ACCESS_TOKEN_SECRET = 'asecretkeyforaccesstoken';
const REFRESH_TOKEN_SECRET = 'anothersecretkeyforrefreshtoken';

const refreshTokensStore = [];

//Función para generar tokens
function generarAccessToken(usuario) {
  return jwt.sign(
    { id: usuario.id, username: usuario.username },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
  );
}

function generarRefreshToken(usuario) {
  return jwt.sign(
    { id: usuario.id },
    REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
}

function refrescarToken(token) {
  if (!token || !refreshTokensStore.includes(token)) {
    throw new Error('Token de refresco inválido');
  }

  return jwt.verify(token, REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) throw new Error('Token de refresco inválido');

    const nuevoAccessToken = jwt.sign(
      { id: decoded.id },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    return nuevoAccessToken;
  });
}

//Funcion para login de usuario
async function login(username, password) {
  const usuario = buscarUsuarioPorUsername(username);

  if (!usuario) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);

  if (!passwordCorrecta) {
    throw new Error('Usuario o contraseña incorrectos');
  }

  const accessToken = generarAccessToken(usuario);
  const refreshToken = generarRefreshToken(usuario);

  refreshTokensStore.push(refreshToken);

  return {
    accessToken,
    refreshToken,
    usuario
  };
}

module.exports = {
  login,
  refrescarToken
};