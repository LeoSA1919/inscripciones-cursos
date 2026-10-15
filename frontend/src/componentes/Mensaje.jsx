export default function Mensaje({ tipo = 'info', children }) {
  const rol = tipo === 'error' ? 'alert' : 'status';

  return (
    <div className={`mensaje mensaje--${tipo}`} role={rol}>
      {children}
    </div>
  );
}
