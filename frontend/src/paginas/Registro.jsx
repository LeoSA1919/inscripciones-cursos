// Registro.jsx  (ruta "/registro")
// Página del formulario. Se encarga de la petición POST y de mostrar la
// confirmación o el error; el formulario en sí vive en FormularioInscripcion.

import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormularioInscripcion from '../componentes/FormularioInscripcion.jsx';
import TarjetaInscripcion from '../componentes/TarjetaInscripcion.jsx';
import Mensaje from '../componentes/Mensaje.jsx';
import { crearInscripcion } from '../api.js';

export default function Registro() {
  // enviando: true mientras se espera la respuesta del servidor.
  const [enviando, setEnviando] = useState(false);
  // error: objeto Error de la última petición fallida, o null.
  const [error, setError] = useState(null);
  // creada: la inscripción que devolvió el servidor, o null si aún no hay.
  const [creada, setCreada] = useState(null);

  // Envía los datos al servidor. Si falla vuelve a lanzar el error para que
  // el formulario no se limpie.
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

  // Después de registrar se muestra la confirmación en lugar del formulario,
  // con la inscripción creada y la navegación para seguir.
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
          {/* Detalle de los errores de validación que envía el servidor. */}
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
