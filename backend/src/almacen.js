// almacen.js
// Toda la lógica de lectura y escritura del archivo inscripciones.json vive aquí.
// Las rutas no tocan el sistema de archivos: solo llaman a estas funciones.

const fs = require('fs/promises');
const path = require('path');

// Ruta absoluta del archivo de datos: /backend/inscripciones.json
const RUTA_ARCHIVO = path.join(__dirname, '..', 'inscripciones.json');

// Cola de escrituras: cada escritura espera a que termine la anterior.
// Así dos POST simultáneos no se pisan (ambos leerían el mismo array y uno
// de los dos registros se perdería).
let colaEscritura = Promise.resolve();

// Lee el archivo y devuelve el array de inscripciones.
// Si el archivo no existe, lo crea con [] y devuelve un array vacío.
async function leerInscripciones() {
  let contenido;

  try {
    contenido = await fs.readFile(RUTA_ARCHIVO, 'utf8');
  } catch (error) {
    // ENOENT = el archivo no existe todavía: lo iniciamos vacío.
    if (error.code === 'ENOENT') {
      await fs.writeFile(RUTA_ARCHIVO, '[]', 'utf8');
      return [];
    }
    throw error;
  }

  // Un archivo vacío se trata como una lista vacía.
  if (contenido.trim() === '') {
    return [];
  }

  // Si el JSON está dañado, JSON.parse lanza un error. No lo sobrescribimos:
  // dejamos que la ruta responda 500 para no destruir los datos existentes.
  const datos = JSON.parse(contenido);

  if (!Array.isArray(datos)) {
    throw new Error('El archivo inscripciones.json no contiene un array.');
  }

  return datos;
}

// Agrega una inscripción al final del archivo conservando las anteriores.
// Devuelve la misma inscripción cuando ya quedó guardada.
function agregarInscripcion(inscripcion) {
  const operacion = colaEscritura.then(async () => {
    const inscripciones = await leerInscripciones();
    inscripciones.push(inscripcion);
    await fs.writeFile(RUTA_ARCHIVO, JSON.stringify(inscripciones, null, 2), 'utf8');
    return inscripcion;
  });

  // Si esta escritura falla, la cola sigue funcionando para las siguientes.
  colaEscritura = operacion.catch(() => {});

  return operacion;
}

module.exports = { leerInscripciones, agregarInscripcion };
