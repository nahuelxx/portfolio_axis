# Best Practices de Seguridad y Deploy (Portfolio Axis)

Este documento resume las prácticas recomendadas para operar el monorepo (Django backend + Next.js frontend) en desarrollo y producción, con foco en secretos, CORS/CSRF, cookies, HSTS y despliegue en Railway/Vercel.

## 1) Gestión de secretos y variables
- Nunca commitear secretos. Mantener:
  - `backend/.env` y `frontend/.env.local` solo en local (ignorados por Git).
  - Plantillas sin secretos: `backend/.env.example`, `frontend/.env.example`.
- Producción: definir variables en las plataformas (no archivos en el repo):
  - Railway (backend): SECRET_KEY, DEBUG=False, ALLOWED_HOSTS, CSRF_TRUSTED_ORIGINS, CORS_ALLOWED_ORIGINS, DATABASE_URL, EMAIL_*, DEFAULT_FROM_EMAIL, CONTACT_RECIPIENT.
  - Vercel (frontend): NEXT_PUBLIC_API_URL.
- Si algún secreto se subió alguna vez, rotarlo y limpiar el historial (BFG o git-filter-repo).

## 2) Seguridad en Django (según DEBUG)
En `settings.py` se activan flags automáticamente:
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
Cuándo usarlos: staging sin HTTPS, troubleshooting de redirecciones o HSTS gradual. En producción estable, mantener los valores por defecto (seguros).

## 3) CORS/CSRF/Hosts: formato correcto
- `ALLOWED_HOSTS`: solo hostnames, sin `https://` (ej. `api.tudominio.com,subdominio.up.railway.app`).
- `CSRF_TRUSTED_ORIGINS`: con esquema y sin `/` final (ej. `https://api.tudominio.com,https://subdominio.up.railway.app`).
- `CORS_ALLOWED_ORIGINS`: igual que CSRF (con esquema, sin slash final). Incluir dominio del frontend (Vercel) y el propio si aplica.

## 4) Estáticos (Django)
- `STATIC_ROOT = BASE_DIR / "staticfiles"` y `STATIC_URL = "/static/"`.
- WhiteNoise en `MIDDLEWARE` y `STORAGES` (ya configurado).
- En Railway:
  - Build command: `python manage.py collectstatic --noinput` (para que `/app/staticfiles` exista al arrancar).
  - Deploy command: `python manage.py migrate`.
  - Start command: `gunicorn portfolio_axis.wsgi:application`.

## 5) Email
- Producción: SMTP (Workspace o transaccional) con dominio verificado (SPF/DKIM/DMARC).
- `DEFAULT_FROM_EMAIL` debe ser del mismo dominio autenticado; usar `reply_to` con el email del usuario del formulario.
- Desarrollo: backend de consola (`django.core.mail.backends.console.EmailBackend`).

## 6) Base de datos
- Prod: Postgres gestionado (Railway/Neon/etc.).
- Usar `DATABASE_URL` y ejecutar migraciones en cada deploy.
- Activar backups.

## 7) Despliegue
- Railway (backend): Root Directory `backend/`.
  - Build: collectstatic
  - Deploy: migrate
  - Start: gunicorn
- Vercel (frontend): Root Directory `frontend/`.
  - `NEXT_PUBLIC_API_URL` debe terminar en `/api` (ej. `https://api.tudominio.com/api`).

## 8) Anti‑abuso en /contact
- Frontend: honeypot + time‑gate (ya implementados).
- Backend: throttling/rate‑limit (p.ej. `django-ratelimit` o DRF throttle).
- Opcional: Turnstile/hCaptcha si hay abuso.

## 9) Observabilidad y logs
- Sentry para backend (DSN por env).
- Alertas en Railway (crashes, reinicios).
- Loguear `email_sent` true/false para diagnóstico de correo.

## 10) Higiene Git (monorepo)
- Un solo repo en la raíz; evitar repos anidados.
- `.gitignore` raíz: `backend/venv`, `frontend/node_modules`, `frontend/.next`, `**/.env*`, `backend/staticfiles`, `backend/db.sqlite3` (si lo usas en local), temporales y carpetas de IDE.
- Mantener `backend/.env.example` y `frontend/.env.example` como guía.

---

### Cheatsheet — Variables (producción)
Railway (backend):
```
SECRET_KEY=...
DEBUG=False
ALLOWED_HOSTS=api.tudominio.com,subdominio.up.railway.app
CSRF_TRUSTED_ORIGINS=https://api.tudominio.com,https://subdominio.up.railway.app
CORS_ALLOWED_ORIGINS=https://tu-front.vercel.app
DATABASE_URL=postgres://...
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
# Overrides opcionales
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
SECRET_KEY=django-insecure-change-me
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=http://localhost:8000
CORS_ALLOWED_ORIGINS=http://localhost:3000
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
```
frontend/.env.local:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Con este setup:
- Producción es segura por defecto y configurable vía overrides.
- Local es cómodo y aislado (sin secretos en Git).

