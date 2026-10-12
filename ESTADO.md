# Estado del proyecto: Inscripciones a cursos

Fecha: 2026-10-12

Resumen de lo construido, cómo se verificó y qué falta. Las instrucciones de
instalación y uso están en `README.md`.

## Hecho

### Raíz

| Archivo      | Contenido                                                        |
| ------------ | ---------------------------------------------------------------- |
| `.gitignore` | Excluye `node_modules/`, `.env`, `.claude/` y `dist/`            |
| `README.md`  | Requisitos, instalación, comandos, puertos, API, conexión React–API y pruebas manuales |

### Backend (`/backend`) — Node.js + Express 5, puerto 3001

| Archivo                  | Qué hace                                                      |
| ------------------------ | ------------------------------------------------------------- |
| `src/server.js`          | Configura Express, CORS, JSON, 404 y manejador general de errores |
| `src/rutas/registros.js` | `GET /registros` y `POST /registros`                          |
| `src/validacion.js`      | Reglas de validación del servidor                             |
| `src/almacen.js`         | Lectura y escritura de `inscripciones.json`                   |
| `package.json` y `package-lock.json` | Dependencias: `express`, `cors`                   |

Comportamiento:

- `GET /registros` responde 200 con el array.
- `POST /registros` responde 201 con el objeto creado, o 400 con `mensaje` y
  un array `errores` con todos los fallos.
- El `id` lo genera el servidor con `crypto.randomUUID()`; se ignora el que
  envíe el cliente.
- Validación: campos obligatorios, formato de correo, fecha `YYYY-MM-DD` real
  y no anterior a hoy, `descripcion` opcional (queda `""` si no llega).
- `inscripciones.json` se crea con `[]` si no existe.
- Las escrituras pasan por una cola, así que los POST simultáneos no se pisan.
- Si el archivo está dañado responde 500, no lo sobrescribe y el servidor
  sigue funcionando.
- JSON mal formado en el cuerpo: 400. Ruta desconocida: 404.

### Frontend (`/frontend`) — React 19 + Vite + React Router, puerto 5173

| Archivo                                  | Qué hace                                         |
| ---------------------------------------- | ------------------------------------------------ |
| `src/main.jsx`                           | Punto de entrada, activa el router               |
| `src/App.jsx`                            | Menú y las tres rutas                            |
| `src/api.js`                             | Único archivo con `fetch`; lee `VITE_API_URL`    |
| `src/validacion.js`                      | Validación del formulario en el cliente          |
| `src/componentes/Menu.jsx`               | Navegación, marca la ruta activa                 |
| `src/componentes/FormularioInscripcion.jsx` | Formulario controlado con estado y errores por campo |
| `src/componentes/TarjetaInscripcion.jsx` | Muestra una inscripción                          |
| `src/componentes/Mensaje.jsx`            | Avisos de éxito, error e información             |
| `src/paginas/Inicio.jsx`                 | `/` bienvenida y accesos                         |
| `src/paginas/Registro.jsx`               | `/registro` hace el POST, muestra confirmación o error |
| `src/paginas/Lista.jsx`                  | `/lista` hace el GET; estados de carga, vacío, error y datos |
| `src/estilos.css`                        | CSS básico, variables en `:root`, clases por componente, adaptable a móvil |
| `.env.example`                           | Ejemplo de `VITE_API_URL`                        |
| `index.html`, `vite.config.js`, `package.json`, `package-lock.json` | Configuración       |

Comportamiento:

- Exactamente tres rutas: `/`, `/registro`, `/lista`.
- El formulario no envía nada si hay errores de validación.
- Tras registrar se muestra la confirmación, la tarjeta creada y los botones
  "Registrar otra" y "Ver la lista".
- Si el POST falla se conserva lo escrito y se muestra el error del servidor.
- La lista consulta al servidor cada vez que se abre y tiene "Reintentar".

## Verificado

Backend, contra el servidor en ejecución (con `curl`):

| Prueba                                   | Resultado                       |
| ---------------------------------------- | ------------------------------- |
| GET sin archivo                          | 200 `[]`, archivo creado        |
| POST válido                              | 201 con `id`                    |
| POST sin `descripcion`                   | 201, `descripcion: ""`          |
| POST vacío                               | 400 con 5 errores               |
| Correo inválido y fecha pasada           | 400 con 2 errores               |
| Fecha inexistente (`2027-02-30`)         | 400                             |
| JSON mal formado                         | 400                             |
| Ruta desconocida                         | 404                             |
| 10 POST simultáneos                      | 10 guardados, ids únicos        |
| Archivo dañado                           | 500 y el servidor sigue vivo    |
| Reinicio del servidor                    | Los registros siguen            |
| Preflight CORS desde `localhost:5173`    | 204 con cabeceras correctas     |

Frontend:

- `npm run build` compila sin errores.
- `validacion.js` probado con Node: formulario válido, vacío, correo inválido
  y fecha pasada.

## Falta

### Sin verificar

- **El frontend no se probó en un navegador.** Nadie ha hecho clic en la
  interfaz todavía. Hay que ejecutar las cinco pruebas manuales del README:
  lista vacía, registro válido, datos inválidos, consulta y persistencia.
- **Vista en móvil**: revisar con el modo responsive del navegador.

### Por decidir o hacer

- **Git**: el repositorio no está inicializado y no hay commits. Los commits
  van sin líneas de atribución de Claude.
- **`backend/inscripciones.json` no está en `.gitignore`.** Si no se quieren
  subir datos de prueba, agregarlo.
- **Categoría es texto libre.** Si la asignatura define categorías fijas,
  cambiar el campo por un desplegable.
- **Estilado fino**: pendiente para la persona encargada. Punto de partida:
  las variables de `:root` en `frontend/src/estilos.css`.

### Limitaciones conocidas

- "Hoy" se calcula con la hora local de cada lado (navegador y servidor). En
  la misma máquina coinciden; en máquinas con zonas horarias distintas podrían
  diferir cerca de la medianoche.
- No hay ruta comodín: una URL desconocida en el frontend muestra solo el menú.
- No hay pruebas automatizadas; el alcance pedía pruebas manuales.

### Fuera de alcance (no agregar)

Panel de administración, login, roles, pagos, agenda, base de datos, más rutas
de API, librerías de componentes o temas elaborados.
