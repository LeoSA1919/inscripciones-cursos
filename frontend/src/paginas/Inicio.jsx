// Inicio.jsx  (ruta "/")
// Página de bienvenida con accesos directos al formulario y a la lista.

import { Link } from 'react-router-dom';

export default function Inicio() {
  return (
    <section className="pagina">
      <h1 className="pagina__titulo">Bienvenido</h1>
      <p>
        Desde aquí puedes registrar una inscripción a un curso y consultar las
        inscripciones ya registradas.
      </p>

      <div className="acciones">
        <Link className="boton" to="/registro">
          Registrar inscripción
        </Link>
        <Link className="boton boton--secundario" to="/lista">
          Ver inscripciones
        </Link>
      </div>
    </section>
  );
}
