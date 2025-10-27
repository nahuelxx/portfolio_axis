# Best Practices de Seguridad y Deploy (Portfolio Axis)

Este documento resume las practicas recomendadas para operar el monorepo (Django backend + Next.js frontend) en desarrollo y produccion, con foco en secretos, CORS/CSRF, cookies, HSTS, base de datos y despliegue en Railway/Vercel.

## 1) Gestion de secretos y variables
- Nunca commitear secretos. Mantener:
  - `backend/.env` y `frontend/.env.local` solo en local (ignorados por Git).
  - Plantillas sin secretos: `backend/.env.example`, `frontend/.env.example`.
- Produccion: definir variables en las plataformas (no archivos en el repo):
  - Railway (backend): SECRET_KEY, DEBUG, ENVIRONMENT, ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS, CORS_ALLOWED_ORIGINS, DATABASE_URL, (opcional DB_SSLMODE), EMAIL_*, DEFAULT_FROM_EMAIL, CONTACT_RECIPIENT.
  - Vercel (frontend): NEXT_PUBLIC_API_URL.
- Si algun secreto se subio alguna vez, rotarlo y limpiar el historial (BFG o git-filter-repo).

## 2) Seguridad en Django (segun DEBUG)
En `settings.py` se activan flags automaticamente:
- Con `DEBUG=False` (prod):
  - `SECURE_SSL_REDIRECT=True`
  - `SESSION_COOKIE_SECURE=True`
  - `CSRF_COOKIE_SECURE=True`
  - `SECURE_HSTS_SECONDS=31536000`, `SECURE_HSTS_INCLUDE_SUBDOMAINS=True`, `SECURE_HSTS_PRELOAD=True`
  - `SECURE_PROXY_SSL_HEADER=('HTTP_X_FORWARDED_PROTO', 'https')`
- Con `DEBUG=True` (dev): se desactivan por defecto.

Overrides opcionales por entorno (Railway):
```
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
SECURE_HSTS_SECONDS=0
SECURE_HSTS_INCLUDE_SUBDOMAINS=False
SECURE_HSTS_PRELOAD=False
```
Cuando usarlos: staging sin HTTPS, troubleshooting de redirecciones o HSTS gradual. En produccion estable, mantener los valores por defecto (seguros).

## 3) CORS/CSRF/Hosts: formato correcto
- `ALLOWED_HOSTS`: solo hostnames, sin `https://` (ej. `api.tudominio.com,subdominio.up.railway.app`).
- `CSRF_TRUSTED_ORIGINS`: con esquema y sin `/` final (ej. `https://api.tudominio.com,https://subdominio.up.railway.app`).
- `CORS_ALLOWED_ORIGINS`: igual que CSRF (con esquema, sin slash final). Incluir dominio del frontend (Vercel) y el propio si aplica.
- No agregues comentarios al final de la linea; van en su propia linea (evita errores tipo "should not have fragment").

## 4) Estaticos (Django)
- `STATIC_ROOT = BASE_DIR / "staticfiles"` y `STATIC_URL = "/static/"`.
- WhiteNoise en `MIDDLEWARE` y `STORAGES`.
- En Railway:
  - Build: `python manage.py collectstatic --noinput` (para que `/app/staticfiles` exista al arrancar).
  - Deploy: `python manage.py migrate`.
  - Start: `gunicorn portfolio_axis.wsgi:application`.
- Si el admin devuelve 500 por "Missing staticfiles manifest...", prueba temporalmente `CompressedStaticFilesStorage` (sin Manifest) para confirmar y luego vuelve a Manifest cuando el pipeline este alineado.

## 5) Email
- Produccion: SMTP (Workspace o transaccional) con dominio verificado (SPF/DKIM/DMARC).
- `DEFAULT_FROM_EMAIL` del mismo dominio autenticado; usar `reply_to` con el email del usuario del formulario (implementado con `EmailMessage`).
- El backend devuelve `{ ok: true, email_sent: true|false }`. El frontend ya interpreta `email_sent=false` como error.
- Desarrollo: backend de consola (`django.core.mail.backends.console.EmailBackend`).

## 6) Base de datos (switch por entorno)
- En `settings.py`:
  - `ENVIRONMENT`: `development` | `production` (default `development`).
  - `POSTGRES_LOCALLY`: bool (default `False`).
  - `DATABASE_URL`: URL completa de Postgres.
  - Logica: usa Postgres cuando `ENVIRONMENT=production` o `POSTGRES_LOCALLY=True`; si no, SQLite.
  - Si usa Postgres y falta `DATABASE_URL`, lanza error (`ImproperlyConfigured`).
  - `DB_SSLMODE`: opcional; si no esta y el host no es `.internal`, fuerza `sslmode=require`.
- Railway (produccion): ENVIRONMENT=production, DEBUG=False, DATABASE_URL (interna) y migraciones en Deploy.
- Local (dev): sin `DATABASE_URL` -> SQLite. Si queres Postgres: `POSTGRES_LOCALLY=True` + `DATABASE_URL` local o publica (`?sslmode=require`).

## 7) Despliegue
- Railway (backend): Root Directory `backend/`.
  - Build: collectstatic
  - Deploy: migrate
  - Start: gunicorn
- Vercel (frontend): Root Directory `frontend/`.
  - `NEXT_PUBLIC_API_URL` debe terminar en `/api` (ej. `https://api.tudominio.com/api`).

## 8) Anti-abuso en /contact
- Frontend: honeypot + time-gate (implementados con RHF + Zod).
- Backend: throttling/rate-limit (p.ej. `django-ratelimit` o DRF throttle).
- Opcional: Turnstile/hCaptcha si hay abuso.

## 9) Observabilidad y logs
- Sentry para backend (DSN por env).
- Alertas en Railway (crashes, reinicios).
- Para depurar 500 en prod: aumenta logs (LOGGING -> consola, `PYTHONUNBUFFERED=1`, gunicorn `--log-level=info`) y reproduce la URL.

## 10) Higiene Git (monorepo)
- Un solo repo en la raiz; evitar repos anidados.
- `.gitignore` raiz: `backend/venv`, `frontend/node_modules`, `frontend/.next`, `**/.env*`, `backend/staticfiles`, `backend/db.sqlite3`, caches de Python/IDE/logs.
- Si se trackearon artefactos pesados: `git rm --cached` de esas rutas y commit.
- Si quedaron blobs >100MB en el historial: `git filter-repo --invert-paths` y/o `--strip-blobs-bigger-than`, luego `git push --force --prune`. Evitar LFS para node_modules/venv.

---

### Cheatsheet — Variables (produccion)
Railway (backend):
```
ENVIRONMENT=production
DEBUG=False
ALLOWED_HOSTS=api.tudominio.com,subdominio.up.railway.app
CSRF_TRUSTED_ORIGINS=https://api.tudominio.com,https://subdominio.up.railway.app
CORS_ALLOWED_ORIGINS=https://tu-front.vercel.app
DATABASE_URL=postgresql://postgres:***@postgres.railway.internal:5432/railway
# DB_SSLMODE=require   # si usas host publico
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_USE_SSL=False
EMAIL_TIMEOUT=30
EMAIL_HOST_USER=info@tudominio.com
EMAIL_HOST_PASSWORD=app_password
DEFAULT_FROM_EMAIL=Nombre <info@tudominio.com>
CONTACT_RECIPIENT=info@tudominio.com
# Overrides opcionales de seguridad
# SECURE_SSL_REDIRECT=False
# SESSION_COOKIE_SECURE=False
# CSRF_COOKIE_SECURE=False
# SECURE_HSTS_SECONDS=0
# SECURE_HSTS_INCLUDE_SUBDOMAINS=False
# SECURE_HSTS_PRELOAD=False
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
# Si queres Postgres local o remoto en dev:
# POSTGRES_LOCALLY=True
# DATABASE_URL=postgresql://user:pass@localhost:5432/mi_db
# DB_SSLMODE=require
```
frontend/.env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Con este setup:
- Produccion es segura por defecto y configurable via overrides.
- Local es comodo y aislado (sin secretos en Git) y podes optar por SQLite o Postgres segun necesites.