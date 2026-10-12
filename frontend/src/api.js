// api.js
// Único lugar del frontend que conoce la URL de la API y hace las peticiones
// HTTP. Los componentes llaman a estas funciones y no usan fetch directamente.

// URL base de la API. Se lee de la variable de entorno VITE_API_URL (archivo
// .env); si no está definida se usa el backend local en el puerto 3001.
const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Hace la petición y devuelve el JSON de la respuesta.
// Si algo falla lanza un Error con un mensaje listo para mostrar al usuario;
// cuando el servidor envía una lista de errores, va en error.errores.
async function pedir(ruta, opciones) {
  let respuesta;

  try {
    respuesta = await fetch(`${URL_API}${ruta}`, opciones);
  } catch {
    // fetch solo falla así cuando no hay conexión con el servidor.
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté iniciado.');
  }

  // El cuerpo puede no ser JSON si el error viene de otro lado; no debe romper.
  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const error = new Error(datos?.mensaje || `El servidor respondió con un error (${respuesta.status}).`);
    error.errores = datos?.errores || [];
    throw error;
  }

  return datos;
}

// GET /registros -> array de inscripciones.
export function obtenerInscripciones() {
  return pedir('/registros');
}

// POST /registros -> inscripción creada (con su id).
export function crearInscripcion(inscripcion) {
  return pedir('/registros', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inscripcion),
  });
}
