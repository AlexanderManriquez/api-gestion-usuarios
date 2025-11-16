require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { buscarUsuarioPorUsername } = require('./usuario.service');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

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

  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET);
    const nuevoAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    return nuevoAccessToken;
  } catch (err) {
    throw new Error('Token de refresco inválido');
  }
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