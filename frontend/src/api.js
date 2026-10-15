const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function pedir(ruta, opciones) {
  let respuesta;

  try {
    respuesta = await fetch(`${URL_API}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté iniciado.');
  }

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = new Error(datos?.mensaje || `El servidor respondió con un error (${respuesta.status}).`);
    error.errores = datos?.errores || [];
    throw error;
  }

  return datos;
}

export function obtenerInscripciones() {
  return pedir('/registros');
}

export function crearInscripcion(inscripcion) {
  return pedir('/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inscripcion),
  });
}
