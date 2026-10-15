export default function TarjetaInscripcion({ inscripcion }) {
  const { participante, email, curso, categoria, fecha, descripcion } = inscripcion;

  return (
    <article className="tarjeta">
      <h3 className="tarjeta__titulo">{curso}</h3>
      <span className="tarjeta__categoria">{categoria}</span>

      <dl className="tarjeta__datos">
        <dt>Participante</dt>
        <dd>{participante}</dd>

        <dt>Correo</dt>
        <dd>{email}</dd>

        <dt>Fecha</dt>
        <dd>{fecha}</dd>
      </dl>

      {descripcion && <p className="tarjeta__descripcion">{descripcion}</p>}
    </article>
  );
}
