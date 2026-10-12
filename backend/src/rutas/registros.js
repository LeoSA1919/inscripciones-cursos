// rutas/registros.js
// Define las rutas de la API. Cada ruta recibe la petición, delega la
// validación y el acceso al archivo en otros módulos, y arma la respuesta.

const express = require('express');
const crypto = require('crypto');
const { leerInscripciones, agregarInscripcion } = require('../almacen');
const { validarInscripcion } = require('../validacion');

const router = express.Router();

// GET /registros -> 200 con el array de inscripciones.
router.get('/', async (req, res) => {
  try {
    const inscripciones = await leerInscripciones();
    res.status(200).json(inscripciones);
  } catch (error) {
    console.error('Error al leer las inscripciones:', error.message);
    res.status(500).json({ mensaje: 'No se pudieron leer las inscripciones.' });
  }
});

// POST /registros -> valida y crea una inscripción.
//   válido:   201 con el objeto creado
//   inválido: 400 con un mensaje y la lista de errores
router.post('/', async (req, res) => {
  const { errores, datos } = validarInscripcion(req.body);

  if (errores.length > 0) {
    return res.status(400).json({
      mensaje: 'Los datos de la inscripción no son válidos.',
      errores,
    });
  }

  // El id lo genera siempre el servidor; se ignora cualquier id enviado.
  const nuevaInscripcion = { id: crypto.randomUUID(), ...datos };

  try {
    const guardada = await agregarInscripcion(nuevaInscripcion);
    res.status(201).json(guardada);
  } catch (error) {
    console.error('Error al guardar la inscripción:', error.message);
    res.status(500).json({ mensaje: 'No se pudo guardar la inscripción.' });
  }
});

module.exports = router;
