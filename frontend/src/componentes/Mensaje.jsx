// Mensaje.jsx
// Caja de aviso reutilizable para confirmaciones, errores e información.
//
// Props:
//   tipo:     'exito' | 'error' | 'info'  (define el color de la caja)
//   children: el texto o contenido del mensaje

export default function Mensaje({ tipo = 'info', children }) {
  // Los errores se anuncian de inmediato a los lectores de pantalla (alert);
  // el resto se anuncia sin interrumpir (status).
  const rol = tipo === 'error' ? 'alert' : 'status';

  return (
    <div className={`mensaje mensaje--${tipo}`} role={rol}>
      {children}
    </div>
  );
}
