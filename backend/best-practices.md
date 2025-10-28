# Best Practices de Seguridad, Deploy y Email (Portfolio Axis)

Este documento consolida las prácticas que fuimos aplicando para operar el monorepo (Django backend + Next.js frontend) en desarrollo y producción, incluyendo cambio a Anymail + Resend.
-Apoyarse con `dev_results.md'` en la raiz de proyecto para features del proyecto.

## 1) Gestión de secretos y variables

- Nunca commitear secretos. Mantener:
  - `backend/.env` y `frontend/.env.local` sólo en local (ignorados por Git).
  - Plantillas: `backend/.env.example`, `frontend/.env.example` (sin claves reales).
- Producción: definir variables en las plataformas (no archivos en el repo):
  - Railway (backend): SECRET_KEY, DEBUG, ENVIRONMENT, ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS, CORS_ALLOWED_ORIGINS, DATABASE_URL, (opcional DB_SSLMODE), EMAIL_BACKEND, RESEND_API_KEY, DEFAULT_FROM_EMAIL, CONTACT_RECIPIENT.
  - Vercel (frontend): NEXT_PUBLIC_API_URL.
- Si un secreto se subió alguna vez, rotarlo y limpiar historial (BFG o git-filter-repo).

## 2) Seguridad en Django (según DEBUG)

- `DEBUG=False` (prod):
  - `SECURE_SSL_REDIRECT=True`, `SESSION_COOKIE_SECURE=True`, `CSRF_COOKIE_SECURE=True`.
  - `SECURE_HSTS_SECONDS=31536000`, `SECURE_HSTS_INCLUDE_SUBDOMAINS=True`, `SECURE_HSTS_PRELOAD=True`.
  - `SECURE_PROXY_SSL_HEADER=('HTTP_X_FORWARDED_PROTO','https')`.
- `DEBUG=True` (dev): se desactivan por defecto.
- Overrides opcionales (Railway):

```
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
SECURE_HSTS_SECONDS=0
SECURE_HSTS_INCLUDE_SUBDOMAINS=False
SECURE_HSTS_PRELOAD=False
```

### Verificación rápida (Thunder/REST Client)

- HTTPS redirect: GET a `http://<railway>/api/` debe redirigir (301/302/308) a `https://...` (o forzarse en edge; el tráfico resultante debe ser HTTPS).
- HSTS: GET/HEAD a `https://<railway>/api/` debe incluir el header `Strict-Transport-Security` con `max-age≥31536000` (+ includeSubDomains/preload si aplica).
- Cookies Secure en admin: GET `https://<railway>/heavendoor/` y revisar `Set-Cookie` con flag `Secure` (y SameSite configurado), indicador de `SESSION_COOKIE_SECURE/CSRF_COOKIE_SECURE=True`.
- CORS preflight permitido: OPTIONS `https://<railway>/api/contact/` con `Origin=<tu Vercel>` y `Access-Control-Request-Method: POST` debe responder 200/204 y `access-control-allow-origin=<tu Vercel>`.
- CORS preflight denegado: OPTIONS con `Origin` no permitido no debe devolver `access-control-allow-origin` para ese origen (el navegador bloqueará la request real).

## 3) CORS/CSRF/Hosts (formatos)

- `ALLOWED_HOSTS`: sólo hostnames, sin `https://` (ej. `api.tudominio.com,subdominio.up.railway.app`).
- `CSRF_TRUSTED_ORIGINS`: con esquema y sin `/` final (ej. `https://api.tudominio.com`).
- `CORS_ALLOWED_ORIGINS`: igual que CSRF (con esquema, sin slash final). Incluir Vercel y localhost.
- Evitar comentarios al final de la línea (`# ...`) en variables: generan errores de parseo.

## 4) Estáticos (Django)

- `STATIC_ROOT = BASE_DIR / "staticfiles"`, `STATIC_URL = "/static/"`.
- WhiteNoise en `MIDDLEWARE` y `STORAGES`.
- Railway:
  - Build: `python manage.py collectstatic --noinput`.
  - Deploy: `python manage.py migrate`.
  - Start: `gunicorn portfolio_axis.wsgi:application`.
- Si el admin devuelve 500 por manifest: temporalmente `CompressedStaticFilesStorage` (sin Manifest) para confirmar; luego volver a Manifest cuando el pipeline esté alineado.

## 5) Email – Anymail + Resend

- Dependencias: `django-anymail` y `"anymail"` en `INSTALLED_APPS`.
- Backend (env): `EMAIL_BACKEND=anymail.backends.resend.EmailBackend`.
- Clave: `RESEND_API_KEY=...`.
- Remitente: `DEFAULT_FROM_EMAIL=Nombre <from@dominio-verificado.com>` (dominio verificado en Resend).
- Destino: `CONTACT_RECIPIENT=tu@correo.com`.
- La vista usa `EmailMessage` con `reply_to=[email_del_usuario]`.
- Ventajas: no depende de SMTP (puertos 587/465); usa HTTP/443, mejor entregabilidad y errores claros en logs (Anymail).
- Desarrollo: `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend` para imprimir en logs y no depender de red.

### Pruebas rápidas (Thunder Client)

- POST {{baseUrl}}/contact/ con JSON:

```
{
  "name": "Test",
  "email": "test@example.com",
  "message": "Hola! Probando contacto",
  "honeypot": ""
}
```

- Respuesta esperada: 201 + `{ ok: true, email_sent: true }`.
- Si `email_sent=false`: revisar Logs (runtime) en Railway – Anymail indica causa (API key/dominio verificado/etc.).

## 6) Base de datos – Switch por entorno

- Variables: `ENVIRONMENT` (development|production), `POSTGRES_LOCALLY` (bool), `DATABASE_URL` (Postgres), `DB_SSLMODE` (opcional).
- Regla: usa Postgres cuando `ENVIRONMENT=production` o `POSTGRES_LOCALLY=True`; si no, SQLite.
- Si usa Postgres y falta `DATABASE_URL`, levanta `ImproperlyConfigured`.
- Railway: `ENVIRONMENT=production`, `DATABASE_URL` (interna), migraciones en Deploy.
- Local: sin `DATABASE_URL` -> SQLite; para Postgres: `POSTGRES_LOCALLY=True` + `DATABASE_URL` (si host público, `sslmode=require`).

## 7) Despliegue

- Railway (backend) – Root `backend/`:
  - Build: collectstatic
  - Deploy: migrate
  - Start: gunicorn
- Vercel (frontend) – Root `frontend/`:
  - `NEXT_PUBLIC_API_URL` debe terminar en `/api` (ej. `https://api.tudominio.com/api`).

## 8) Anti‑abuso en /contact

- Frontend: honeypot + time‑gate (RHF+Zod).
- Backend: throttling/rate‑limit (p.ej. `django-ratelimit` o DRF throttle) si fuera necesario.

## 9) Observabilidad y logs

- Sentry (DSN por env) recomendable.
- Railway → pestaña “Logs” para tracebacks (no “HTTP Logs”).
- Depurar 500 en prod: activar LOGGING a consola, `PYTHONUNBUFFERED=1`, gunicorn `--log-level=info`.

## 10) Higiene Git

- `.gitignore` en raíz: `backend/venv`, `frontend/node_modules`, `frontend/.next`, `**/.env*`, `backend/staticfiles`, `backend/db.sqlite3`, caches y carpetas de IDE.
- Si se trackearon artefactos pesados: `git rm --cached` y commit.
- Si quedaron blobs >100MB: `git filter-repo --invert-paths` o `--strip-blobs-bigger-than`, luego `git push --force --prune`.

---

### Cheatsheet — Variables (producción)

Railway (backend):

```
ENVIRONMENT=production
DEBUG=False
ALLOWED_HOSTS=api.tudominio.com,subdominio.up.railway.app
CSRF_TRUSTED_ORIGINS=https://api.tudominio.com,https://subdominio.up.railway.app
CORS_ALLOWED_ORIGINS=https://tu-front.vercel.app
DATABASE_URL=postgresql://postgres:***@postgres.railway.internal:5432/railway
# DB_SSLMODE=require   # si usas host público
EMAIL_BACKEND=anymail.backends.resend.EmailBackend
RESEND_API_KEY=***
DEFAULT_FROM_EMAIL=Nombre <from@dominio-verificado.com>
CONTACT_RECIPIENT=tu@correo.com
```

Vercel (frontend):

```
NEXT_PUBLIC_API_URL=https://api.tudominio.com/api
```

### Cheatsheet — Variables (desarrollo local)

backend/.env:

```
ENVIRONMENT=development
POSTGRES_LOCALLY=False
SECRET_KEY=django-insecure-change-me
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=http://localhost:8000
CORS_ALLOWED_ORIGINS=http://localhost:3000
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
# Para Postgres local/remoto en dev:
# POSTGRES_LOCALLY=True
# DATABASE_URL=postgresql://user:pass@localhost:5432/mi_db
# DB_SSLMODE=require
```

frontend/.env.local:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```
