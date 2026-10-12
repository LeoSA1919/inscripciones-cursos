// validacion.js
// Validación del formulario en el cliente. Son las mismas reglas que aplica
// el servidor; aquí sirven para avisar al usuario antes de enviar.

// Formato básico de correo: algo@algo.algo, sin espacios.
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Devuelve la fecha de hoy como YYYY-MM-DD en la hora local del navegador.
export function fechaDeHoy() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// Recibe los valores del formulario y devuelve un objeto con un mensaje por
// cada campo inválido, por ejemplo { email: 'Escribe un correo válido...' }.
// Si el objeto vuelve vacío, el formulario es válido.
export function validarFormulario(valores) {
  const errores = {};

  if (valores.participante.trim() === '') {
    errores.participante = 'Escribe el nombre del participante.';
  }

  if (valores.email.trim() === '') {
    errores.email = 'Escribe un correo electrónico.';
  } else if (!FORMATO_EMAIL.test(valores.email.trim())) {
    errores.email = 'Escribe un correo válido, por ejemplo nombre@correo.com.';
  }

  if (valores.curso.trim() === '') {
    errores.curso = 'Escribe el nombre del curso.';
  }

  if (valores.categoria.trim() === '') {
    errores.categoria = 'Escribe la categoría del curso.';
  }

  // Las fechas YYYY-MM-DD se pueden comparar como texto.
  if (valores.fecha === '') {
    errores.fecha = 'Elige una fecha.';
  } else if (valores.fecha < fechaDeHoy()) {
    errores.fecha = 'La fecha no puede ser anterior a hoy.';
  }

  return errores;
}
