import { useState } from 'react';
import { validarFormulario, fechaDeHoy, CATEGORIAS } from '../validacion.js';

const VALORES_INICIALES = {
  participante: '',
  email: '',
  curso: '',
  categoria: '',
  fecha: '',
  descripcion: '',
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
