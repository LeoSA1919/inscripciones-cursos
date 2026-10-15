# Inscripciones a cursos

Aplicación web para registrar y consultar inscripciones a cursos.

Formulario en React → API REST en Express → archivo JSON → lista en React.

## Estructura

```
backend/    API REST (Node.js + Express), guarda en inscripciones.json
frontend/   SPA (React + Vite + React Router): rutas /, /registro y /lista
docs/       pruebas realizadas y capturas
```

## Requisitos

- Node.js 20.19 o superior (incluye npm).

## Instalación

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Comandos y puertos

Inicia cada parte en una terminal distinta:

| Parte    | Carpeta     | Comando       | URL                     |
| -------- | ----------- | ------------- | ----------------------- |
| Backend  | `backend/`  | `npm start`   | <http://localhost:3001> |
| Frontend | `frontend/` | `npm run dev` | <http://localhost:5173> |

Después abre <http://localhost:5173> en el navegador.

## Datos de una inscripción

| Campo        | Reglas                                                    |
| ------------ | --------------------------------------------------------- |
| id           | lo genera el servidor                                     |
| participante | obligatorio                                               |
| email        | obligatorio, formato de correo válido                     |
| curso        | obligatorio                                               |
| categoria    | obligatoria: Programación, Idiomas, Diseño, Negocios u Otros |
| fecha        | obligatoria, `YYYY-MM-DD`, no anterior a hoy              |
| descripcion  | opcional                                                  |

Las inscripciones se guardan en `backend/inscripciones.json`, que se crea vacío
(`[]`) la primera vez que se usa.

## Uso de la API

**Consultar inscripciones** (`GET /registros`, responde `200`):

```bash
curl http://localhost:3001/registros
```

**Crear una inscripción** (`POST /registros`, responde `201` con el registro creado):

```bash
curl -X POST http://localhost:3001/registros \
  -H "Content-Type: application/json" \
  -d '{"participante":"Ana Ruiz","email":"ana@correo.com","curso":"React","categoria":"Programación","fecha":"2026-12-01","descripcion":"Turno tarde"}'
```

Si los datos no son válidos responde `400` con la lista de errores:

```json
{
  "mensaje": "Los datos de la inscripción no son válidos.",
  "errores": ["El campo \"email\" no tiene un formato de correo válido."]
}
```

En PowerShell usa `curl.exe`. También se puede probar con Postman.

## Conexión entre React y la API

Las peticiones salen de `frontend/src/api.js`, que usa la variable
`VITE_API_URL` (por defecto `http://localhost:3001`). Para cambiarla, copia
`frontend/.env.example` como `frontend/.env` y reinicia el frontend.

Como el frontend y el backend usan puertos distintos, el backend habilita CORS.

## Pruebas

Las pruebas funcionales, con sus resultados y capturas, están en
[docs/pruebas.md](docs/pruebas.md).
