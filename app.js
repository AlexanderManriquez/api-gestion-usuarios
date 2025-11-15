const express = require('express');
const path = require('path');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();

// Middleware globales: Uso json, carpeta public para archivos estáticos
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Rutas: Rutas para la API y ruta de prueba
app.use('/api', usuarioRoutes);

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