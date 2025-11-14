const {
  crearUsuario,
  buscarUsuarioPorId,
  actualizarUsuario,
  eliminarUsuario,
  actualizarImagenUsuario
} = require('../services/usuario.service');

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
      usuario: nuevoUsuario
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
    res.json(usuario);
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
      usuario: usuarioActualizado
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
    usuario: eliminado
  });
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
}

//Controlador para actualizar imagen de usuario /usuarios/:id/imagen
function actualizarImagenUsuarioController(req, res) {
  try {
    const { id } = req.params;
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({ mensaje: 'La ruta de la imagen es obligatoria' });
    }

    const usuario = actualizarImagenUsuario(id, imagePath);

    res.json({
      mnesaje: 'Imagen de usuario actualizada exitosamente',
      usuario
    })
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
}

module.exports = {
  crearUsuarioController,
  obtenerUsuarioController,
  actualizarUsuarioController,
  eliminarUsuarioController,
  actualizarImagenUsuarioController
};