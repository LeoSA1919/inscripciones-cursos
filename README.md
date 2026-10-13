# Inscripciones a cursos

Aplicación web para registrar y consultar inscripciones a cursos.

Flujo de extremo a extremo: formulario en React → petición HTTP → API REST en
Express → archivo JSON → consulta y visualización en React.

## Estructura

```
/backend     API REST (Node.js + Express)
  src/server.js            configura Express y arranca el servidor
  src/rutas/registros.js   rutas GET y POST /registros
  src/validacion.js        reglas de validación del servidor
  src/almacen.js           lectura y escritura de inscripciones.json
  inscripciones.json       datos (se crea solo al primer uso)

/frontend    SPA (React + Vite + React Router)
  src/main.jsx             punto de entrada
  src/App.jsx              menú y las tres rutas
  src/api.js               peticiones HTTP a la API
  src/validacion.js        validación del formulario en el cliente
  src/componentes/         Menu, FormularioInscripcion, TarjetaInscripcion, Mensaje
  src/paginas/             Inicio (/), Registro (/registro), Lista (/lista)
  src/estilos.css          estilos básicos, comentados por componente
```

## Requisitos

- Node.js 20.19 o superior (incluye npm). Desarrollado y probado con Node 24.

## Instalación

Las dependencias se instalan por separado en cada carpeta:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Cómo iniciar

Se necesitan dos terminales, una para cada parte.

**Terminal 1 — backend**

```bash
cd backend
npm start
```

**Terminal 2 — frontend**

```bash
cd frontend
npm run dev
```

Luego abre <http://localhost:5173> en el navegador.

| Parte    | Comando       | Puerto | URL                     |
| -------- | ------------- | ------ | ----------------------- |
| Backend  | `npm start`   | 3001   | <http://localhost:3001> |
| Frontend | `npm run dev` | 5173   | <http://localhost:5173> |

En el backend también existe `npm run dev`, que reinicia el servidor al guardar
cambios en el código. El puerto del backend se puede cambiar con la variable de
entorno `PORT`.

## Modelo de datos

| Campo        | Tipo   | Reglas                                           |
| ------------ | ------ | ------------------------------------------------ |
| id           | string | único, lo genera el servidor                     |
| participante | string | requerido                                        |
| email        | string | requerido, formato de correo válido              |
| curso        | string | requerido                                        |
| categoria    | string | requerido, una de: Programación, Idiomas, Diseño, Negocios, Otros |
| fecha        | string | requerida, `YYYY-MM-DD`, no anterior al día actual |
| descripcion  | string | opcional                                         |

## API

### GET /registros

Devuelve todas las inscripciones.

```bash
curl http://localhost:3001/registros
```

Respuesta `200`:

```json
[
  {
    "id": "fbea2e4a-b323-4ba2-b7a6-39901efbe4c4",
    "participante": "Ana Ruiz",
    "email": "ana@correo.com",
    "curso": "React",
    "categoria": "Programación",
    "fecha": "2026-12-01",
    "descripcion": "Turno tarde"
  }
]
```

### POST /registros

Crea una inscripción. El servidor valida los datos y genera el `id`.

```bash
curl -X POST http://localhost:3001/registros \
  -H "Content-Type: application/json" \
  -d '{"participante":"Ana Ruiz","email":"ana@correo.com","curso":"React","categoria":"Programación","fecha":"2026-12-01","descripcion":"Turno tarde"}'
```

En PowerShell usa `curl.exe` y escapa las comillas, o prueba desde el
formulario del frontend.

Respuesta `201`: el objeto creado, con su `id`.

Respuesta `400` cuando los datos no son válidos:

```json
{
  "mensaje": "Los datos de la inscripción no son válidos.",
  "errores": [
    "El campo \"email\" no tiene un formato de correo válido.",
    "El campo \"fecha\" no puede ser anterior al día actual."
  ]
}
```

Otras respuestas: `400` si el cuerpo no es JSON válido, `404` para cualquier
otra ruta y `500` si el archivo de datos no se puede leer o escribir (el
servidor sigue funcionando).

## Cómo se conecta React con la API

Todas las peticiones salen de `frontend/src/api.js`. Ese archivo arma la URL
con la variable de entorno `VITE_API_URL`; si no está definida, usa
`http://localhost:3001`:

```js
const URL_API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

Para apuntar a otra URL, copia `frontend/.env.example` como `frontend/.env`,
cambia el valor y reinicia `npm run dev` (Vite solo lee `.env` al arrancar).

El frontend y el backend corren en puertos distintos, así que el navegador
exige CORS: el backend lo habilita con `app.use(cors())` en `server.js`.

## Pruebas manuales

Con el backend y el frontend iniciados.

**1. Lista vacía**

1. Detén el backend, borra `backend/inscripciones.json` si existe y vuelve a
   iniciarlo.
2. Abre <http://localhost:5173/lista>.
3. Esperado: el mensaje "Todavía no hay inscripciones registradas." y el
   archivo `inscripciones.json` creado con `[]`.

**2. Registro válido**

1. Ve a `/registro` y completa todos los campos con una fecha de hoy o
   posterior.
2. Pulsa "Registrar inscripción".
3. Esperado: mensaje de confirmación en verde, la tarjeta con los datos
   guardados y los botones "Registrar otra" y "Ver la lista".

**3. Datos inválidos**

1. En `/registro`, pulsa "Registrar inscripción" con el formulario vacío.
   Esperado: un mensaje bajo cada campo obligatorio y ninguna petición enviada
   (se puede comprobar en la pestaña Red del navegador).
2. Escribe `correo-malo` en el correo. Esperado: aviso de formato de correo.
3. Escribe a mano una fecha pasada. Esperado: "La fecha no puede ser anterior
   a hoy."
4. Validación del servidor, sin pasar por el formulario:

   ```bash
   curl -X POST http://localhost:3001/registros \
     -H "Content-Type: application/json" \
     -d '{"participante":"Ana","email":"malo","curso":"React","categoria":"Programación","fecha":"2020-01-01"}'
   ```

   Esperado: respuesta `400` con la lista de errores.

**4. Consulta**

1. Registra dos o tres inscripciones.
2. Ve a `/lista`.
3. Esperado: una tarjeta por inscripción y el total correcto. Mientras llega la
   respuesta se ve "Cargando inscripciones…".

**5. Persistencia**

1. Con inscripciones registradas, detén el backend (Ctrl + C).
2. Recarga `/lista`. Esperado: mensaje de error de conexión y el botón
   "Reintentar".
3. Inicia de nuevo el backend con `npm start` y pulsa "Reintentar".
4. Esperado: aparecen las mismas inscripciones que antes de reiniciar.
