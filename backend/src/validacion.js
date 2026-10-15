const CAMPOS_REQUERIDOS = ['participante', 'email', 'curso', 'categoria', 'fecha'];

const CATEGORIAS = ['Programación', 'Idiomas', 'Diseño', 'Negocios', 'Otros'];

const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;

function fechaDeHoy() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

function esFechaReal(fecha) {
  const [anio, mes, dia] = fecha.split('-').map(Number);
  const objeto = new Date(anio, mes - 1, dia);
  return (
    objeto.getFullYear() === anio &&
    objeto.getMonth() === mes - 1 &&
    objeto.getDate() === dia
  );
}

function validarInscripcion(cuerpo) {
  const errores = [];

  if (cuerpo === null || typeof cuerpo !== 'object' || Array.isArray(cuerpo)) {
    return { errores: ['El cuerpo de la petición debe ser un objeto JSON.'], datos: null };
  }

  const datos = {};

  for (const campo of CAMPOS_REQUERIDOS) {
    const valor = cuerpo[campo];
    if (typeof valor !== 'string' || valor.trim() === '') {
      errores.push(`El campo "${campo}" es obligatorio.`);
    } else {
      datos[campo] = valor.trim();
    }
  }

  if (datos.email && !FORMATO_EMAIL.test(datos.email)) {
    errores.push('El campo "email" no tiene un formato de correo válido.');
  }

  if (datos.categoria && !CATEGORIAS.includes(datos.categoria)) {
    errores.push('El campo "categoria" debe de ser una de las opciones permitidas.');
  }

  if (datos.fecha) {
    if (!FORMATO_FECHA.test(datos.fecha) || !esFechaReal(datos.fecha)) {
      errores.push('El campo "fecha" debe ser una fecha válida con formato YYYY-MM-DD.');
    } else if (datos.fecha < fechaDeHoy()) {
      errores.push('El campo "fecha" no puede ser anterior al día actual.');
    }
  }

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
