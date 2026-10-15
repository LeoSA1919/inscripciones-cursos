import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormularioInscripcion from '../componentes/FormularioInscripcion.jsx';
import TarjetaInscripcion from '../componentes/TarjetaInscripcion.jsx';
import Mensaje from '../componentes/Mensaje.jsx';
import { crearInscripcion } from '../api.js';

export default function Registro() {
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [creada, setCreada] = useState(null);

  async function manejarEnvio(datos) {
    setEnviando(true);
    setError(null);

    try {
      const inscripcion = await crearInscripcion(datos);
      setCreada(inscripcion);
    } catch (errorPeticion) {
      setError(errorPeticion);
      throw errorPeticion;
    } finally {
      setEnviando(false);
    }
  }

  if (creada) {
    return (
      <section className="pagina">
        <h1 className="pagina__titulo">Registrar inscripción</h1>

        <Mensaje tipo="exito">La inscripción se registró correctamente.</Mensaje>
        <TarjetaInscripcion inscripcion={creada} />

        <div className="acciones">
          <button className="boton" type="button" onClick={() => setCreada(null)}>
            Registrar otra
          </button>
          <Link className="boton boton--secundario" to="/lista">
            Ver la lista
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="pagina">
      <h1 className="pagina__titulo">Registrar inscripción</h1>
      <p>Los campos marcados con * son obligatorios.</p>

      {error && (
        <Mensaje tipo="error">
          <p>{error.message}</p>
          {error.errores?.length > 0 && (
            <ul>
              {error.errores.map((texto) => (
                <li key={texto}>{texto}</li>
              ))}
            </ul>
          )}
        </Mensaje>
      )}

      <FormularioInscripcion onEnviar={manejarEnvio} enviando={enviando} />

      <div className="acciones">
        <Link className="enlace" to="/lista">
          Ir a la lista de inscripciones
        </Link>
      </div>
    </section>
  );
}
