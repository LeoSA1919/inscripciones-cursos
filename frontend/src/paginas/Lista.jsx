import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TarjetaInscripcion from '../componentes/TarjetaInscripcion.jsx';
import Mensaje from '../componentes/Mensaje.jsx';
import { obtenerInscripciones } from '../api.js';

export default function Lista() {
  const [inscripciones, setInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    let vigente = true;

    setCargando(true);
    setError(null);

    obtenerInscripciones()
      .then((datos) => {
        if (vigente) setInscripciones(datos);
      })
      .catch((errorPeticion) => {
        if (vigente) setError(errorPeticion);
      })
      .finally(() => {
        if (vigente) setCargando(false);
      });

    return () => {
      vigente = false;
    };
  }, [intento]);

  return (
    <section className="pagina">
      <h1 className="pagina__titulo">Inscripciones registradas</h1>

      {cargando && <Mensaje tipo="info">Cargando inscripciones…</Mensaje>}

      {!cargando && error && (
        <>
          <Mensaje tipo="error">{error.message}</Mensaje>
          <div className="acciones">
            <button className="boton" type="button" onClick={() => setIntento(intento + 1)}>
              Reintentar
            </button>
          </div>
        </>
      )}

      {!cargando && !error && inscripciones.length === 0 && (
        <Mensaje tipo="info">Todavía no hay inscripciones registradas.</Mensaje>
      )}

      {!cargando && !error && inscripciones.length > 0 && (
        <>
          <p>Total: {inscripciones.length}</p>
          <div className="lista">
            {inscripciones.map((inscripcion) => (
              <TarjetaInscripcion key={inscripcion.id} inscripcion={inscripcion} />
            ))}
          </div>
        </>
      )}

      <div className="acciones">
        <Link className="boton boton--secundario" to="/registro">
          Registrar una inscripción
        </Link>
      </div>
    </section>
  );
}
