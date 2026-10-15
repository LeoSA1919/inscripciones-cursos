const express = require('express');
const crypto = require('crypto');
const { leerInscripciones, agregarInscripcion } = require('../almacen');
const { validarInscripcion } = require('../validacion');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const inscripciones = await leerInscripciones();
    res.status(200).json(inscripciones);
  } catch (error) {
    console.error('Error al leer las inscripciones:', error.message);
    res.status(500).json({ mensaje: 'No se pudieron leer las inscripciones.' });
  }
});

router.post('/', async (req, res) => {
  const { errores, datos } = validarInscripcion(req.body);

  if (errores.length > 0) {
    return res.status(400).json({
      mensaje: 'Los datos de la inscripción no son válidos.',
      errores,
    });
  }

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
