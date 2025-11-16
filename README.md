# API de Gestión de Usuarios

**Descripción**: Esta API REST simple permite registrar usuarios, autenticarlos con JWT, actualizar datos, eliminar usuarios y subir imágenes de perfil. El almacenamiento es en memoria (array `models/db.js`), pensado para propósitos de aprendizaje.

***Requisitos**

- `Node.js` (v14+ recomendado)
- `npm` (v6+)

**Instalación**

1. Clona o descarga el repositorio.
2. Desde la raíz del proyecto ejecuta:

```powershell
npm install
```

**Ejecutar el servidor**

```powershell
npm run dev   # con nodemon (desarrollo)
npm start     # producción (node app.js)
```

Al iniciar verás: `Servidor escuchando en el puerto 3000` (o el que configures).

**Rutas / Endpoints**

- `GET /health` — comprobación de salud. Respuesta: texto simple.

- `POST /api/usuarios` — Crear usuario (público)
  - Body JSON: `{ "username": "usuario", "password": "secreto" }`
  - Respuesta: `201` con el usuario creado (incluye `id` y `passwordHash`).

- `POST /auth/login` — Login (público)
  - Body JSON: `{ "username": "usuario", "password": "secreto" }`
  - Respuesta: `{ mensaje, accessToken, refreshToken, usuario }`

- `POST /auth/refresh` — Refrescar access token (público)
  - Body JSON: `{ "refreshToken": "..." }`
  - Respuesta: `{ accessToken: "..." }`

- `GET /api/usuarios/:id` — Obtener usuario por id (protegido)
  - Requiere header `Authorization: Bearer <accessToken>`

- `PUT /api/usuarios/:id` — Actualizar usuario (protegido)
  - Body JSON: `{ "username": "nuevo", "password": "nuevo" }`

- `DELETE /api/usuarios/:id` — Eliminar usuario (protegido)

- `POST /api/usuarios/:id/imagen` — Subir imagen de perfil (protegido — requiere `Authorization` header)
  - Form-data: campo `imagen` con el archivo.
  - Respuesta: `201` con `imagen` (ruta pública bajo `/uploads/...`).

**Ejemplos con Postman**

Preparación rápida en Postman:

- Crea un *Environment* llamado `Local` y añade variables:
  - `baseUrl` = `http://localhost:3000`
  - `accessToken` = (vacío)
  - `refreshToken` = (vacío)
  - `userId` = (vacío)

1) Crear usuario (POST)

- URL: `{{baseUrl}}/api/usuarios`
- Método: `POST`
- Headers: `Content-Type: application/json`
- Body → raw (JSON):

```json
{
  "username": "juan",
  "password": "1234"
}
```

- Enviar → la respuesta contendrá el objeto `usuario` con `id`. Copia ese `id` a la variable del environment `userId` si quieres reutilizarla.

2) Login (POST) — obtener `accessToken` y `refreshToken`

- URL: `{{baseUrl}}/auth/login`
- Método: `POST`
- Headers: `Content-Type: application/json`
- Body → raw (JSON):

```json
{
  "username": "juan",
  "password": "1234"
}
```

- En la respuesta verás `accessToken` y `refreshToken`. Copia `accessToken` a la variable del environment `accessToken` y `refreshToken` a `refreshToken`.

3) Obtener usuario protegido (GET)

- URL: `{{baseUrl}}/api/usuarios/{{userId}}` (o `/api/usuarios/1` si no usas variable)
- Método: `GET`
- Authorization: usa la pestaña *Authorization* → Type `Bearer Token` y pon `{{accessToken}}` (o añade header `Authorization: Bearer {{accessToken}}`).
- Enviar → recibes los datos del usuario.

4) Subir imagen de perfil (POST multipart/form-data)

- URL: `{{baseUrl}}/api/usuarios/{{userId}}/imagen`
- Método: `POST`
- Authorization: `Bearer {{accessToken}}`
- Body → selecciona `form-data`:
  - Key: `imagen` → type: `File` → selecciona el archivo en tu disco

- Enviar → la respuesta incluirá la ruta pública de la imagen (p. ej. `/uploads/usuario_1_...`).

5) Refrescar `accessToken` (POST)

- URL: `{{baseUrl}}/auth/refresh`
- Método: `POST`
- Headers: `Content-Type: application/json`
- Body → raw (JSON):

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

- Enviar → la respuesta contiene un nuevo `accessToken`. Actualiza la variable `accessToken` con el nuevo valor.

Consejos útiles en Postman:

- Usa *Pre-request Script* o *Tests* para guardar automáticamente valores desde la respuesta en variables del environment (p. ej. `pm.environment.set('accessToken', response.accessToken)`).
- Puedes exportar la colección y compartirla con el equipo (botón *Export* de la colección).

**Notas sobre almacenamiento**

- La aplicación usa un arreglo en memoria (`models/db.js`) para guardar usuarios; todos los datos se pierden al reiniciar el servidor. Es ideal para pruebas y aprendizaje.
