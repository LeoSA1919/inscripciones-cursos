// FormularioInscripcion.jsx
// Formulario controlado: cada campo guarda su valor en el estado de React.
// Valida en el cliente y, solo si todo es válido, entrega los datos al
// componente padre mediante la prop onEnviar. No hace la petición HTTP.
//
// Props:
//   onEnviar: función async que recibe los datos del formulario. Si termina
//             sin error, el formulario se limpia.
//   enviando: true mientras la petición está en curso (desactiva el botón)

import { useState } from 'react';
import { validarFormulario, fechaDeHoy, CATEGORIAS } from '../validacion.js';

// Valores con los que empieza (y a los que vuelve) el formulario.
const VALORES_INICIALES = {
  participante: '',
  email: '',
  curso: '',
  categoria: '',
  fecha: '',
  descripcion: '',
};

export default function FormularioInscripcion({ onEnviar, enviando }) {
  // valores: lo que el usuario ha escrito en cada campo.
  const [valores, setValores] = useState(VALORES_INICIALES);
  // errores: mensaje de validación de cada campo inválido.
  const [errores, setErrores] = useState({});

  // Un solo manejador para todos los campos: usa el atributo "name" del input
  // para saber qué propiedad del estado actualizar.
  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));

    // Al corregir un campo se quita su mensaje de error.
    if (errores[name]) {
      setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
    }
  }

  async function manejarEnvio(evento) {
    // Evita que el navegador recargue la página al enviar el formulario.
    evento.preventDefault();

    const erroresEncontrados = validarFormulario(valores);
    setErrores(erroresEncontrados);

    // Si hay algún error no se envía nada.
    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    try {
      await onEnviar(valores);
      setValores(VALORES_INICIALES);
    } catch {
      // El padre muestra el error; aquí se conservan los datos escritos
      // para que el usuario pueda corregir y reintentar.
    }
  }

  return (
    // noValidate desactiva los avisos del navegador para usar los nuestros.
    <form className="formulario" onSubmit={manejarEnvio} noValidate>
      <div className="formulario__campo">
        <label htmlFor="participante">Participante *</label>
        <input
          id="participante"
          name="participante"
          type="text"
          value={valores.participante}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.participante)}
        />
        {errores.participante && <p className="formulario__error">{errores.participante}</p>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="email">Correo electrónico *</label>
        <input
          id="email"
          name="email"
          type="email"
          value={valores.email}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.email)}
        />
        {errores.email && <p className="formulario__error">{errores.email}</p>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="curso">Curso *</label>
        <input
          id="curso"
          name="curso"
          type="text"
          value={valores.curso}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.curso)}
        />
        {errores.curso && <p className="formulario__error">{errores.curso}</p>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="categoria">Categoría *</label>
        <select
          id="categoria"
          name="categoria"
          value={valores.categoria}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.categoria)}
        >
          <option value="">Elige una categoría</option>
          {CATEGORIAS.map((categoria)=> (
              <option key={categoria} value={categoria}>
                {categoria}
              </option>
          ))}
        </select>
        {errores.categoria && <p className="formulario__error">{errores.categoria}</p>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="fecha">Fecha *</label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          min={fechaDeHoy()}
          value={valores.fecha}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.fecha)}
        />
        {errores.fecha && <p className="formulario__error">{errores.fecha}</p>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="descripcion">Descripción (opcional)</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows="3"
          value={valores.descripcion}
          onChange={manejarCambio}
        />
      </div>

      <button className="boton" type="submit" disabled={enviando}>
        {enviando ? 'Enviando…' : 'Registrar inscripción'}
      </button>
    </form>
  );
}
