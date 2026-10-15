import { useState } from 'react';
import { validarFormulario, fechaDeHoy, CATEGORIAS, CURSOS } from '../validacion.js';

const VALORES_INICIALES = {
  participante: '',
  email: '',
  curso: '',
  categoria: '',
  fecha: '',
  descripcion: '',
};

// Cada curso pertenece a una categoría fija.
const CATEGORIA_POR_CURSO = {
  'Introducción a la Programación': 'Programación',
  'Desarrollo Web': 'Programación',
  'Bases de Datos': 'Programación',
  'Inglés A1': 'Idiomas',
  'Diseño Gráfico': 'Diseño',
};

export default function FormularioInscripcion({ onEnviar, enviando }) {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});

  function manejarCambio(evento) {
    const { name, value } = evento.target;
    setValores((anteriores) => ({ ...anteriores, [name]: value }));

    if (errores[name]) {
      setErrores((anteriores) => ({ ...anteriores, [name]: undefined }));
    }

    // Al elegir un curso, la categoría se completa sola (vacía si no hay curso).
    if (name === 'curso') {
      const categoria = CATEGORIA_POR_CURSO[value] || '';
      setValores((anteriores) => ({ ...anteriores, categoria }));
      setErrores((anteriores) => ({ ...anteriores, categoria: undefined }));
    }
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    const erroresEncontrados = validarFormulario(valores);
    setErrores(erroresEncontrados);

    if (Object.keys(erroresEncontrados).length > 0) {
      return;
    }

    try {
      await onEnviar(valores);
      setValores(VALORES_INICIALES);
    } catch {
    }
  }

  return (
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
        <select
          id="curso"
          name="curso"
          value={valores.curso}
          onChange={manejarCambio}
          aria-invalid={Boolean(errores.curso)}
        >
          <option value="">Elige un curso</option>
          {CURSOS.map((curso) => (
            <option key={curso} value={curso}>
              {curso}
            </option>
          ))}
        </select>
        {errores.curso && <p className="formulario__error">{errores.curso}</p>}
      </div>

      <div className="formulario__campo">
        <label htmlFor="categoria">Categoría *</label>
        <select
          id="categoria"
          name="categoria"
          value={valores.categoria}
          disabled
          aria-invalid={Boolean(errores.categoria)}
        >
          <option value="">Se completa al elegir un curso</option>
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

      <div className="formulario__campo formulario__campo--completo">
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
