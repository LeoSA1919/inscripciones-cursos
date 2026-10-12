// server.js
// Punto de entrada del backend: configura Express, monta las rutas y arranca
// el servidor.

const express = require('express');
const cors = require('cors');
const rutasRegistros = require('./rutas/registros');

const app = express();

// Puerto del servidor. Se puede cambiar con la variable de entorno PORT.
const PUERTO = process.env.PORT || 3001;

// CORS: permite que el frontend (que corre en otro puerto) llame a la API.
app.use(cors());

// Convierte el cuerpo JSON de las peticiones en req.body.
app.use(express.json());

// Rutas de inscripciones: GET /registros y POST /registros.
app.use('/registros', rutasRegistros);

// Cualquier otra ruta no existe en esta API.
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

// Manejador de errores general. Evita que un error tumbe el servidor.
// El caso más común: el cliente envía un JSON mal formado.
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la petición no es un JSON válido.' });
  }
  console.error('Error inesperado:', error.message);
  res.status(500).json({ mensaje: 'Error interno del servidor.' });
});

app.listen(PUERTO, () => {
  console.log(`API de inscripciones escuchando en http://localhost:${PUERTO}`);
});
