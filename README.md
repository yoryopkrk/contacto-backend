# portafolio-backend

Backend del formulario de contacto de [yoryopkrk.cl](https://www.yoryopkrk.cl). Expone las rutas que ya consume el frontend Angular (`ContactoService` y `MailService`):

- `POST /correos/createTransport` — envia el correo de aviso (a Jorge) o de respuesta automatica (a quien escribio), segun `cualNotificacion`.
- `POST /contactos/postContacto` — guarda el mensaje en Postgres. Publica, sin autenticacion (la usa el formulario).
- `GET /contactos/getContactos`, `GET /contactos/allContactos`, `GET /contactos/getContacto/:id`, `PUT /contactos/putContacto/:id`, `DELETE /contactos/deleteContacto/:id` — protegidas con header `x-api-key` (ver `ADMIN_API_KEY`).

## Desarrollo local

```bash
npm install
cp .env.example .env   # completar MAIL_PASS, POSTGRES_URL y ADMIN_API_KEY
npm run start:dev
```

## Deploy en Railway

1. Sube este repo a GitHub (privado esta bien, no hace falta que sea publico).
2. En Railway: **New Project > Deploy from GitHub repo**, elige este repo.
3. Agrega el plugin de **PostgreSQL** al proyecto (Railway crea `DATABASE_URL` solo; copia ese valor a la variable `POSTGRES_URL` del servicio, o renombra la variable segun prefieras).
4. En el servicio del backend, agrega las variables de entorno de `.env.example`:
   - `CORS_ORIGINS`: dominios del portafolio.
   - `POSTGRES_URL` y `POSTGRES_SSL=true`.
   - `MAIL_USER` y `MAIL_PASS` (contrasena de aplicacion de Gmail, no la contrasena normal).
   - `MAIL_TO` (opcional, por defecto usa `MAIL_USER`).
   - `ADMIN_API_KEY` (un valor random largo, para las rutas de administracion).
5. Railway define `PORT` automaticamente, no hace falta tocarlo.
6. Una vez desplegado, copia la URL publica que te da Railway (algo como `https://portafolio-backend-production.up.railway.app`) y ponla como `apiUrl` en `src/environments/environment.prod.ts` del proyecto `portafolio`.

## Migraciones

No hay `synchronize` activo (evita perder datos por accidente). Para crear las tablas en Postgres:

```bash
npm run migration:generate
npm run migration:run
```
