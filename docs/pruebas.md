# Pruebas en el navegador

Responsable: Josué
Entorno: backend en http://localhost:3001, frontend en http://localhost:5173 (Node v26.11.1).

## Resumen

| Prueba | Resultado esperado | Resultado obtenido | ¿Pasó? |
|---|---|---|---|
| Lista vacía | Mensaje de "no hay inscripciones" | Se muestra "Todavía no hay inscripciones registradas." | Sí |
| Registro válido | Se guarda y muestra confirmación | Se muestra "La inscripción se registró correctamente." y se guarda en el JSON con un UUID | Sí |
| Formulario vacío | Mensajes de validación, no se envía | Aparece un mensaje bajo cada uno de los 5 campos obligatorios; no se guarda nada | Sí |
| Email inválido | Se rechaza y explica el error | `ana@correo` se rechaza con "Escribe un correo válido, por ejemplo nombre@correo.com." | Sí |
| Fecha pasada | Se rechaza y explica el error | `2025-01-15` se rechaza con "La fecha no puede ser anterior a hoy." | Sí |
| Inscripción adicional | Se conserva la anterior | El JSON queda con las 2 inscripciones; la primera no se borró | Sí |
| Datos inválidos directo a la API | Responde 400 | `400 Bad Request` con la lista de 5 errores; no se guarda nada | Sí |
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

### (c) Datos inválidos en cliente y servidor

Antes de estas pruebas `inscripciones.json` tenía 2 registros (los del Paso 4). Al terminar seguía
teniendo 2, así que ningún dato inválido se guardó.

#### Formulario vacío

**Pasos:** abrir http://localhost:5173/registro y presionar "Registrar inscripción" sin llenar nada.

**Resultado esperado:** mensajes por campo y no se envía nada.

**Resultado obtenido:** cada campo obligatorio queda marcado en rojo con su mensaje:
- Participante: "Escribe el nombre del participante."
- Correo electrónico: "Escribe un correo electrónico."
- Curso: "Escribe el nombre del curso."
- Categoría: "Escribe la categoría del curso."
- Fecha: "Elige una fecha."

La descripción (opcional) no muestra error. No aparece aviso del servidor porque la validación del
cliente detiene el envío antes de hacer la petición.

**¿Pasó?** Sí. **Captura:** [capturas/04-formulario-vacio.jpg](capturas/04-formulario-vacio.jpg)

#### Email inválido

**Pasos:** llenar todos los campos con datos correctos excepto el correo, que se escribe
`ana@correo`, y enviar.

**Resultado esperado:** se rechaza con un mensaje claro.

**Resultado obtenido:** solo el campo de correo queda marcado, con el mensaje "Escribe un correo
válido, por ejemplo nombre@correo.com." No se envía al servidor.

**¿Pasó?** Sí. **Captura:** [capturas/05-email-invalido.jpg](capturas/05-email-invalido.jpg)

#### Fecha pasada

**Pasos:** con el correo ya corregido (`ana.perez@correo.com`), poner la fecha `2025-01-15` y enviar.

**Resultado esperado:** se rechaza con un mensaje claro.

**Resultado obtenido:** solo el campo de fecha queda marcado, con el mensaje "La fecha no puede ser
anterior a hoy." No se envía al servidor.

**¿Pasó?** Sí. **Captura:** [capturas/06-fecha-pasada.jpg](capturas/06-fecha-pasada.jpg)

#### Datos inválidos directo a la API

**Pasos:** enviar la petición sin pasar por el formulario:

```bash
curl -i -X POST http://localhost:3001/registros \
  -H "Content-Type: application/json" \
  -d '{"participante":"","email":"malo","curso":"","fecha":"2020-01-01","categoria":""}'
```

**Resultado esperado:** código 400 con la lista de errores.

**Resultado obtenido:**

```
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8

{"mensaje":"Los datos de la inscripción no son válidos.","errores":[
  "El campo \"participante\" es obligatorio.",
  "El campo \"curso\" es obligatorio.",
  "El campo \"categoria\" es obligatorio.",
  "El campo \"email\" no tiene un formato de correo válido.",
  "El campo \"fecha\" no puede ser anterior al día actual."]}
```

**¿Pasó?** Sí. Esto demuestra que el servidor valida por su cuenta aunque alguien se salte el
formulario.
