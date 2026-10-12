// validacion.js
// Reglas de validación de una inscripción en el servidor.
// El servidor valida siempre, aunque el frontend ya lo haya hecho: cualquiera
// puede llamar a la API directamente sin pasar por el formulario.

// Campos de texto obligatorios y el nombre con el que se muestran en los mensajes.
const CAMPOS_REQUERIDOS = ['participante', 'email', 'curso', 'categoria', 'fecha'];

// Formato básico de correo: algo@algo.algo, sin espacios.
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Formato de fecha YYYY-MM-DD.
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

// Devuelve la fecha de hoy como YYYY-MM-DD usando la hora local del servidor.
function fechaDeHoy() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// Comprueba que la fecha exista en el calendario (rechaza 2026-02-30, por ejemplo).
function esFechaReal(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const objeto = new Date(anio, mes - 1, dia);
  return (
    objeto.getFullYear() === anio &&
    objeto.getMonth() === mes - 1 &&
    objeto.getDate() === dia
  );
}

// Valida el cuerpo recibido en POST /registros.
// Devuelve { errores, datos }:
//   - errores: array de mensajes (vacío si todo es válido)
//   - datos: objeto limpio con solo los campos del modelo, sin espacios sobrantes
function validarInscripcion(cuerpo) {
  const errores = [];

  // El cuerpo debe ser un objeto JSON (no un array, ni texto, ni null).
  if (cuerpo === null || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
    return { errores: ['El cuerpo de la petición debe ser un objeto JSON.'], datos: null };
  }

  const datos = {};

  // Campos obligatorios: deben ser texto y no estar vacíos.
  for (const campo of CAMPOS_REQUERIDOS) {
    const valor = cuerpo[campo];
    if (typeof valor !== 'string' || valor.trim() === '') {
      errores.push(`El campo "${campo}" es obligatorio.`);
    } else {
      datos[campo] = valor.trim();
    }
  }

  // Email: solo se revisa el formato si el campo vino con contenido.
  if (datos.email && !FORMATO_EMAIL.test(datos.email)) {
    errores.push('El campo "email" no tiene un formato de correo válido.');
  }

  // Fecha: formato, que exista en el calendario y que no sea anterior a hoy.
  // Las fechas YYYY-MM-DD se pueden comparar como texto porque van de mayor
  // a menor unidad (año, mes, día).
  if (datos.fecha) {
    if (!FORMATO_FECHA.test(datos.fecha) || !esFechaReal(datos.fecha)) {
      errores.push('El campo "fecha" debe ser una fecha válida con formato YYYY-MM-DD.');
    } else if (datos.fecha < fechaDeHoy()) {
      errores.push('El campo "fecha" no puede ser anterior al día actual.');
    }
  }

  // Descripción: opcional, pero si viene debe ser texto.
  const descripcion = cuerpo.descripcion;
  if (descripcion === undefined || descripcion === null) {
    datos.descripcion = '';
  } else if (typeof descripcion !== 'string') {
    errores.push('El campo "descripcion" debe ser texto.');
  } else {
    datos.descripcion = descripcion.trim();
  }

  return { errores, datos };
}

module.exports = { validarInscripcion };
