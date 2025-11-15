const express = require('express');
const router = express.Router();
const {
  crearUsuarioController,
  obtenerUsuarioController,
  actualizarUsuarioController,
  eliminarUsuarioController,
  actualizarImagenUsuarioController
} = require('../controllers/usuario.controller');

// /Usuarios (Crear usuario)
router.post('/usuarios', crearUsuarioController);
// /Usuarios:/:id (Obtener usuario por ID)
router.get('/usuarios/:id', obtenerUsuarioController);
// /Usuarios/:id (Actualizar usuario)
router.put('/usuarios/:id', actualizarUsuarioController);
// /Usuarios/:id (Eliminar usuario)
router.delete('/usuarios/:id', eliminarUsuarioController);
// /Usuarios/:id/imagen (Actualizar imagen de usuario)
router.put('/usuarios/:id/imagen', actualizarImagenUsuarioController);

module.exports = router;