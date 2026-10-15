const fs = require('fs/promises');
const path = require('path');

const RUTA_ARCHIVO = path.join(__dirname, '..', 'inscripciones.json');

let colaEscritura = Promise.resolve();

async function leerInscripciones() {
  let contenido;

  try {
    contenido = await fs.readFile(RUTA_ARCHIVO, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(RUTA_ARCHIVO, '[]', 'utf8');
      return [];
    }
    throw error;
  }

  if (contenido.trim() === '') {
    return [];
  }

  const datos = JSON.parse(contenido);

  if (!Array.isArray(datos)) {
    throw new Error('El archivo inscripciones.json no contiene un array.');
  }

  return datos;
}

function agregarInscripcion(inscripcion) {
  const operacion = colaEscritura.then(async () => {
    const inscripciones = await leerInscripciones();
    inscripciones.push(inscripcion);
    await fs.writeFile(RUTA_ARCHIVO, JSON.stringify(inscripciones, null, 2), 'utf8');
    return inscripcion;
  });

  colaEscritura = operacion.catch(() => {});

  return operacion;
}

module.exports = { leerInscripciones, agregarInscripcion };
