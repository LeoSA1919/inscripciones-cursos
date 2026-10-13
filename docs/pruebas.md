# Pruebas en el navegador

Responsable: Josué
Entorno: backend en http://localhost:3001, frontend en http://localhost:5173 (Node v26.11.1).

## Resumen

| Prueba | Resultado esperado | Resultado obtenido | ¿Pasó? |
|---|---|---|---|
| Lista vacía | Mensaje de "no hay inscripciones" | Se muestra "Todavía no hay inscripciones registradas." | Sí |
| Registro válido | Se guarda y muestra confirmación | Se muestra "La inscripción se registró correctamente." y se guarda en el JSON con un UUID | Sí |
| Formulario vacío | Mensajes de validación, no se envía | | |
| Email inválido | Se rechaza y explica el error | | |
| Fecha pasada | Se rechaza y explica el error | | |
| Inscripción adicional | Se conserva la anterior | El JSON queda con las 2 inscripciones; la primera no se borró | Sí |
| Datos inválidos directo a la API | Responde 400 | | |
| Consulta en la lista | Muestra los registros guardados | | |
| Reiniciar backend | Los registros siguen disponibles | | |

## Detalle

### (a) Lista vacía

**Pasos:**
1. Se verificó que `backend/inscripciones.json` contiene `[]`.
2. Se comprobó la API: `GET /registros` responde `200` con `[]`.
3. Se abrió http://localhost:5173/lista.

**Resultado esperado:** mensaje indicando que no hay inscripciones.

**Resultado obtenido:** la página muestra el título "Inscripciones registradas", el aviso
"Todavía no hay inscripciones registradas." y el enlace "Registrar una inscripción". No hay
mensajes de error ni tarjetas vacías.

**¿Pasó?** Sí.

**Captura:** [capturas/01-lista-vacia.jpg](capturas/01-lista-vacia.jpg)

### (b) Registro válido y conservación de registros

**Pasos:**
1. Se abrió http://localhost:5173/registro y se llenaron todos los campos con datos correctos:
   - Participante: Ana Pérez · Correo: ana.perez@correo.com · Curso: Introducción a React ·
     Categoría: Programación · Fecha: 2026-10-13 (hoy) · Descripción: Inscripción de prueba 1
2. Se presionó "Registrar inscripción".
3. Se presionó "Registrar otra" y se envió una segunda inscripción con fecha futura:
   - Participante: Luis Gómez · Correo: luis.gomez@correo.com · Curso: Bases de datos ·
     Categoría: Datos · Fecha: 2026-11-20 · Descripción: Inscripción de prueba 2
4. Se revisó el contenido de `backend/inscripciones.json`.

**Resultado esperado:** mensaje de confirmación, registro guardado en `inscripciones.json` con
un ID generado por el servidor, y la primera inscripción se conserva al agregar la segunda.

**Resultado obtenido:**
- En ambos envíos aparece el aviso "La inscripción se registró correctamente." y una tarjeta con
  los datos guardados, además de los botones "Registrar otra" y "Ver la lista".
- `inscripciones.json` contiene las dos inscripciones, cada una con un `id` UUID que asignó el
  servidor (el formulario no envía ningún `id`):
  - `0ed19a1c-7151-414b-a4dc-6d5b36f58eeb` — Ana Pérez
  - `7d736ac8-5dbb-46a1-bce7-3f007bcd11ca` — Luis Gómez
- La primera inscripción sigue en el archivo después de registrar la segunda.

**¿Pasó?** Sí.

**Capturas:**
- [capturas/02-registro-valido.jpg](capturas/02-registro-valido.jpg)
- [capturas/03-segundo-registro.jpg](capturas/03-segundo-registro.jpg)
