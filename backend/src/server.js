const express = require('express');
const cors = require('cors');
const rutasRegistros = require('./rutas/registros');

const app = express();

const PUERTO = process.env.PORT || 3001;

app.use(cors());

app.use(express.json());

app.use('/registros', rutasRegistros);

app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada.' });
});

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
