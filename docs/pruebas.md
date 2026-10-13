# Pruebas en el navegador

Responsable: Josué
Entorno: backend en http://localhost:3001, frontend en http://localhost:5173 (Node v26.11.1).

## Resumen

| Prueba | Resultado esperado | Resultado obtenido | ¿Pasó? |
|---|---|---|---|
| Lista vacía | Mensaje de "no hay inscripciones" | Se muestra "Todavía no hay inscripciones registradas." | Sí |
| Registro válido | Se guarda y muestra confirmación | | |
| Formulario vacío | Mensajes de validación, no se envía | | |
| Email inválido | Se rechaza y explica el error | | |
| Fecha pasada | Se rechaza y explica el error | | |
| Inscripción adicional | Se conserva la anterior | | |
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
