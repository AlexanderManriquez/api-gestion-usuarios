const path = require('path');
const fs = require('fs');
const {
  crearUsuario,
  buscarUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  actualizarImagenUsuario
} = require('../services/usuario.service');
const { toPublicUsuario } = require('../utils/user.util');

//Controlador para POST /usuarios
async function crearUsuarioController(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ mensaje: 'Usuario y contraseña son obligatorios' });  
    }

    const nuevoUsuario = await crearUsuario({ username, password });

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: toPublicUsuario(nuevoUsuario)
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

//Controlador para GET /usuarios/:id
function obtenerUsuarioController(req, res) {
  try {
    const { id } = req.params;
    const usuario = buscarUsuarioPorId(id);
    res.json(toPublicUsuario(usuario));
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
}

//Controlador para PUT /usuarios/:id
async function actualizarUsuarioController(req, res) {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const usuarioActualizado = await actualizarUsuario(id, { username, password });

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: toPublicUsuario(usuarioActualizado)
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

//Controlador para DELETE /usuarios/:id
function eliminarUsuarioController(req, res) {
  try {
  const { id } = req.params;
    
  const eliminado = eliminarUsuario(id);

  res.json({
    mensaje: 'Usuario eliminado exitosamente',
    usuario: toPublicUsuario(eliminado)
  });
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
}

//Controlador para subir imagen de usuario /usuarios/:id/imagen
async function subirImagenUsuarioController(req, res) {
  try {
    const { id } = req.params;
    
    buscarUsuarioPorId(id);

    if (!req.files || !req.files.imagen) {
      return res.status(400).json({ mensaje: 'No se ha subido ninguna imagen' });
    }

    const imagen = req.files.imagen;
    //Validar tipo de archivo
    const mimeTypesValidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!mimeTypesValidos.includes(imagen.mimetype)) {
      return res.status(400).json({ mensaje: 'Tipo de archivo no válido. Solo se permiten imágenes en formato JPEG, PNG, GIF o WEBP.' });
    }
    //Generar nombre único para la imagen
    const nombreArchivo = `usuario_${id}_${Date.now()}${path.extname(imagen.name)}`;
    const rutaDestino = path.join(__dirname, '../uploads/', nombreArchivo);

    await imagen.mv(rutaDestino);

    const rutaImagen = `/uploads/${nombreArchivo}`;
    const usuarioActualizado = await actualizarImagenUsuario(id, rutaImagen);

    res.status(201).json({
      mensaje: 'Imagen subida con éxito',
      imagen: rutaImagen,
      usuario: toPublicUsuario(usuarioActualizado)
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

module.exports = {
  crearUsuarioController,
  obtenerUsuarioController,
  actualizarUsuarioController,
  eliminarUsuarioController,
  subirImagenUsuarioController
};