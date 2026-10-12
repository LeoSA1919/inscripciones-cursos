// App.jsx
// Estructura general de la SPA: el menú siempre visible y, debajo, la página
// que corresponde a la ruta actual. Hay exactamente tres rutas.

import { Routes, Route } from 'react-router-dom';
import Menu from './componentes/Menu.jsx';
import Inicio from './paginas/Inicio.jsx';
import Registro from './paginas/Registro.jsx';
import Lista from './paginas/Lista.jsx';

export default function App() {
  return (
    <div className="app">
      <Menu />

      <main className="contenido">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/lista" element={<Lista />} />
        </Routes>
      </main>
    </div>
  );
}
