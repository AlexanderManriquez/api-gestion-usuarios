require('dotenv').config();
const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const usuarioRoutes = require('./routes/usuario.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();

// Middleware globales: Uso json, carpeta uploads para subida de archivos
app.use(express.json());
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  createParentPath: true
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas: Rutas para la API y ruta de prueba
app.use('/api', usuarioRoutes);
app.use('/auth', authRoutes)

app.get('/health', (req, res) => {
  res.send('API de gestión de usuarios funcionando');
});

//Manejo de errores generales
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

//Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});