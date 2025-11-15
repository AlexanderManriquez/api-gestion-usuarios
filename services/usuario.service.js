const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { usuarios } = require('../models/db');

let nextId = 1;

// Crear Usuario
async function crearUsuario({ username, password }) {
  const existe = usuarios.find(u => u.username === username);
  if (existe) {
    throw new Error('El nombre de usuario ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevoUsuario = new Usuario(
    nextId++,
    username,
    passwordHash
  );

  usuarios.push(nuevoUsuario);

  return nuevoUsuario;
}

//Buscar usuario por Id
function buscarUsuarioPorId(id) {
  const usuario = usuarios.find(u => u.id === Number(id));
  if(!usuario) {
    throw new Error('Usuario no encontrado');
  } 
  return usuario;
}

//Buscar usuario por username (para login)
function buscarUsuarioPorUsername(username) {
  return usuarios.find(u => u.username === username);
}

//Actualizar usuario
async function actualizarUsuario(id, { username, password }) {
  const usuario = buscarUsuarioPorId(id);

  if (username) {
    usuario.username = username;
  }

  if (password) {
    usuario.passwordHash = await bcrypt.hash(password, 10);
  }

  return usuario;
}

//Eliminar usuario
function eliminarUsuario(id) {
  const index = usuarios.findIndex(u => u.id === Number(id));
  if (index === -1) {
    throw new Error('Usuario no encontrado');
  }

  const eliminado = usuarios.splice(index, 1)[0];
  return eliminado;
}

//Actualizar imagen de perfil de usuario
function actualizarImagenUsuario(id, imagePath) {
  const usuario = buscarUsuarioPorId(id);
  usuario.image = imagePath;
  return usuario;
}

module.exports = {
  crearUsuario,
  buscarUsuarioPorId,
  buscarUsuarioPorUsername,
  actualizarUsuario,
  eliminarUsuario,
  actualizarImagenUsuario
};