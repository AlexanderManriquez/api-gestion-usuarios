const express = require('express');
const router = express.Router();
const {
  crearUsuarioController,
  obtenerUsuarioController,
  actualizarUsuarioController,
  eliminarUsuarioController,
  subirImagenUsuarioController
} = require('../controllers/usuario.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// /Usuarios (Crear usuario)
router.post('/usuarios', crearUsuarioController);
// /Usuarios:/:id (Obtener usuario por ID)
router.get('/usuarios/:id', authMiddleware, obtenerUsuarioController);
// /Usuarios/:id (Actualizar usuario)
router.put('/usuarios/:id', authMiddleware, actualizarUsuarioController);
// /Usuarios/:id (Eliminar usuario)
router.delete('/usuarios/:id', authMiddleware, eliminarUsuarioController);
// /Usuarios/:id/imagen (Actualizar imagen de usuario)
router.post('/usuarios/:id/imagen', authMiddleware, subirImagenUsuarioController);

module.exports = router;