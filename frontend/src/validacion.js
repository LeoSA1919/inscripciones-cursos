const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const CATEGORIAS = ['Programación', 'Idiomas', 'Diseño', 'Negocios', 'Otros'];

export const CURSOS = [
  'Introducción a la Programación',
  'Desarrollo Web',
  'Bases de Datos',
  'Inglés A1',
  'Diseño Gráfico',
];

export function fechaDeHoy() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

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
    errores.curso = 'Elige un curso.';
  } else if (!CURSOS.includes(valores.curso)) {
    errores.curso = 'Elige un curso de la lista.';
  }

  if (valores.categoria.trim() === '') {
    errores.categoria = 'Elige una categoría.';
  } else if (!CATEGORIAS.includes(valores.categoria)){
    errores.categoria = 'Elige una categoría de la lista.';
  }

  if (valores.fecha === '') {
    errores.fecha = 'Elige una fecha.';
  } else if (valores.fecha < fechaDeHoy()) {
    errores.fecha = 'La fecha no puede ser anterior a hoy.';
  }

  return errores;
}
