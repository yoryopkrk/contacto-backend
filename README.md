# portafolio-backend

Backend del formulario de contacto de [yoryopkrk.cl](https://www.yoryopkrk.cl). Expone las rutas que ya consume el frontend Angular (`ContactoService` y `MailService`):

Todas las rutas van bajo el prefijo `/api/v1`.

- `POST /api/v1/contactos/postContacto` — guarda el mensaje en Postgres y, desde el servidor, envia el aviso a `MAIL_TO` y una respuesta automatica a quien escribio (via [Resend](https://resend.com), API HTTP; varios hostings como Render bloquean SMTP). Publica, sin autenticacion (la usa el formulario). Los destinatarios no los elige el visitante, el texto va escapado y la respuesta automatica se limita a una por direccion cada 24 h y 40 al dia.
- `POST /api/v1/correos/createTransport` — **obsoleta**: ya no envia nada (antes era un relevo de correo abierto). Se conserva solo para el front antiguo; borrarla cuando nadie la llame.
- `GET /api/v1/contactos/getContactos`, `GET /api/v1/contactos/allContactos`, `GET /api/v1/contactos/getContacto/:id`, `PUT /api/v1/contactos/putContacto/:id`, `DELETE /api/v1/contactos/deleteContacto/:id` — protegidas con header `x-api-key` (ver `ADMIN_API_KEY`).

## Desarrollo local

```bash
npm install
cp .env.example .env   # completar RESEND_API_KEY, POSTGRES_URL y ADMIN_API_KEY
npm run start:dev
```

## Deploy (Render u otro hosting)

1. Sube este repo a GitHub (privado esta bien, no hace falta que sea publico).
2. Crea un Web Service apuntando a este repo. Build command: `npm install && npm run build`. Start command: `npm run start:prod`.
3. Base de datos Postgres: puede ser un plugin del mismo hosting o, como en este caso, un proyecto de Supabase — solo necesitas la connection string en `POSTGRES_URL`.
4. Agrega las variables de entorno de `.env.example`:
   - `CORS_ORIGINS`: dominios del portafolio.
   - `POSTGRES_URL`, `POSTGRES_SSL=true` y `POSTGRES_SCHEMA` si usas un esquema distinto de `public`.
   - `RESEND_API_KEY` (cuenta gratis en resend.com) y `MAIL_FROM` (usa `onboarding@resend.dev` si no verificaste tu propio dominio ahi).
   - `MAIL_TO`: a donde llega el aviso de "nuevo mensaje".
   - `TRUST_PROXY=1` (cuantos proxies hay delante; sin esto el limite por IP cuenta a todos como uno).
   - `ADMIN_API_KEY` (un valor random largo, para las rutas de administracion).
5. El hosting suele definir `PORT` automaticamente, no hace falta tocarlo.
6. Una vez desplegado, copia la URL publica del servicio y ponla como `apiUrl` (con el sufijo `/api/v1`) en `src/environments/environment.prod.ts` del proyecto `portafolio`.

## Migraciones

**Antes de desplegar** esta version hay que correr `npm run migration:run` contra la base (agrega `contactos.respuestaEnviadaAt`, nullable; es compatible con la version anterior).

No hay `synchronize` activo (evita perder datos por accidente). Para crear las tablas en Postgres:

```bash
npm run migration:generate
npm run migration:run
```
