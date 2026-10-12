// Menu.jsx
// Menú de navegación que aparece en todas las páginas.
// NavLink agrega la clase "activo" al enlace de la ruta actual.

import { NavLink } from 'react-router-dom';

// Devuelve las clases del enlace según si es la ruta actual o no.
function claseEnlace({ isActive }) {
  return isActive ? 'menu__enlace menu__enlace--activo' : 'menu__enlace';
}

export default function Menu() {
  return (
    <header className="menu">
      <span className="menu__titulo">Inscripciones a cursos</span>

      <nav className="menu__enlaces" aria-label="Navegación principal">
        <NavLink to="/" end className={claseEnlace}>
          Inicio
        </NavLink>
        <NavLink to="/registro" className={claseEnlace}>
          Registrar
        </NavLink>
        <NavLink to="/lista" className={claseEnlace}>
          Lista
        </NavLink>
      </nav>
    </header>
  );
}
