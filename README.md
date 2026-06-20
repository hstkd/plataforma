# HS TKD Academy - OnLine 🥋

Plataforma digital **premium** de Taekwondo del maestro **Henry Sigchos**.
Estética _Netflix + Duolingo + marca deportiva premium_ en **negro, blanco y amarillo**.

Los alumnos aprenden técnicas en video, siguen rutas de progreso por cinturón,
compran cursos o membresías, agendan clases privadas por Zoom y entrenan desde
cualquier lugar. El maestro gestiona todo desde un panel de administración.

---

## ✨ Características

| Área | Qué incluye |
|------|-------------|
| **Landing premium** | Video hero, animaciones (Framer Motion), presentación del maestro, testimonios, planes, CTAs |
| **Usuarios** | Registro/login, sesión JWT (cookie httpOnly), perfil, cinturón, XP, racha, historial |
| **Biblioteca** | 7 categorías (Poomsae, Combate, Técnica, Flexibilidad, Fuerza, Velocidad, Mental). Cada curso: video, descripción, nivel requerido, ejercicios, acceso por membresía/compra |
| **Progreso** | Gamificación estilo Duolingo: +50 XP por lección, barra de cinturón, racha, % de avance |
| **Pagos** | Membresías mensuales, compra de cursos individuales y clases privadas (scaffold Stripe) |
| **Agenda** | Calendario de disponibilidad, reserva de clases 1‑a‑1, confirmación automática + enlace de Zoom (scaffold) |
| **Admin** | Crear cursos y subir videos, ver alumnos, ventas/ingresos, distribución de cinturones y reservas |

---

## 🏗️ Arquitectura

```
src/
├── app/
│   ├── page.tsx                 # Landing premium
│   ├── login · register/        # Autenticación
│   ├── dashboard/               # Área del alumno (layout + sidebar)
│   │   ├── biblioteca/[slug]/   # Detalle de curso + reproductor
│   │   ├── agenda · membresia · perfil/
│   ├── admin/                   # Panel del maestro (rol ADMIN)
│   └── api/                     # Route handlers (auth, progress, checkout, bookings, admin…)
├── components/                  # UI (marketing, app, content, agenda, admin, auth, ui)
└── lib/
    ├── db/                      # Capa de datos (mock en memoria) — misma interfaz que Prisma
    ├── auth/                    # Sesiones JWT (jose) + hash de contraseñas (scrypt)
    ├── payments/stripe.ts       # Integración de pagos (scaffold)
    ├── integrations/zoom.ts     # Clases en vivo (scaffold S2S OAuth)
    ├── access.ts                # Reglas de acceso a cursos
    └── brand.ts · types.ts · utils.ts
prisma/schema.prisma             # Modelo de datos canónico (PostgreSQL) para escalar
```

### Stack
- **Next.js 15** (App Router, React Server Components) + **TypeScript**
- **Tailwind CSS** (sistema de diseño negro/blanco/amarillo, tipografía Oswald/Montserrat/Inter)
- **Framer Motion** (animaciones), **lucide-react** (íconos)
- **jose** (JWT), **zod** (validación)
- **Prisma** (esquema PostgreSQL listo para producción)

### Pensado para escalar
- Render del lado del servidor (RSC) + rutas dinámicas con caché por defecto.
- **Capa de datos desacoplada**: hoy corre con un store en memoria (`DATA_DRIVER=mock`);
  los repositorios en `src/lib/db` exponen la **misma interfaz async** que tendría Prisma,
  así que migrar a PostgreSQL solo implica reimplementar ese módulo — sin tocar la UI.
- Integraciones (Stripe/Zoom) detrás de interfaces con **modo simulado** automático
  cuando no hay credenciales, y puntos de integración (`TODO`) bien marcados.

---

## 🚀 Puesta en marcha

```bash
npm install
cp .env.example .env.local      # opcional: el modo demo funciona sin claves
npm run dev                     # http://localhost:3000
```

### Cuentas de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| 👤 Alumno | `alumno@hstkd.com` | `taekwondo` |
| 🛡️ Admin | `maestro@hstkd.com` | `taekwondo` |

> En **modo demo** los pagos y las reuniones de Zoom se simulan: el checkout activa
> el acceso al instante y se genera un enlace de Zoom ficticio. Es ideal para probar
> el flujo completo sin claves reales.

---

## ☁️ Desplegar en Vercel con base de datos persistente (recomendado)

La app soporta dos modos de datos vía `DATA_DRIVER`:
- `mock` (por defecto) → store en memoria, cero configuración, datos se reinician.
- `prisma` → **PostgreSQL real, los datos persisten** (registros, progreso, reservas…).

Para una demo donde todo se guarde de verdad, usa **Vercel + Postgres** así:

### 1) Crea una base de datos PostgreSQL
La forma más simple junto a Vercel es **Neon** (gratis, serverless):
1. En [vercel.com](https://vercel.com) → tu proyecto → pestaña **Storage** → **Create
   Database → Neon (Postgres)**. _(O crea una gratis en [neon.tech](https://neon.tech).)_
2. Copia la **connection string** (usa la versión *pooled*, termina en `-pooler`).

### 2) Importa el proyecto en Vercel
1. [vercel.com/new](https://vercel.com/new) → importa `hstkd/plataforma`.
2. Framework **Next.js** (autodetectado). No cambies el build (la app ya define
   un `vercel-build` que aplica el esquema y siembra datos automáticamente).

### 3) Variables de entorno (en Settings → Environment Variables)
| Name | Value |
|------|-------|
| `DATA_DRIVER` | `prisma` |
| `DATABASE_URL` | _tu connection string de Neon_ `...-pooler...?sslmode=require` |
| `AUTH_SECRET` | genera uno con `openssl rand -base64 32` |

> Con Neon/PgBouncer (URL *pooled*), añade `&pgbouncer=true` al final de `DATABASE_URL`.

### 4) Deploy
Vercel ejecuta `vercel-build`, que: aplica el esquema (`prisma db push`), **siembra
los datos demo** (cursos, planes, usuarios) y compila. En 1–2 min tendrás tu URL.

> 💡 Si despliegas en la **rama** `claude/tkd-academy-platform-sbhk49`, ve a
> **Settings → Git → Production Branch** y ponla, o fusiona a `main`.

### Cuentas para la demo desplegada
`alumno@hstkd.com` / `maestro@hstkd.com`, contraseña `taekwondo`.

---

### Alternativa — Render (un clic, también con Postgres)
El `render.yaml` despliega un servicio web Node. Para persistencia, crea además
un **Render PostgreSQL**, copia su *Internal Database URL* en la env var
`DATABASE_URL` del servicio y pon `DATA_DRIVER=prisma`.

### Modo demo sin base de datos
Si solo quieres verla rápido sin DB, no definas `DATABASE_URL` ni `DATA_DRIVER`:
arranca en modo `mock` (los datos se reinician en cada despliegue).

---

## 🔌 Otras integraciones de producción

1. **Stripe** — `npm i stripe`, define `STRIPE_SECRET_KEY` y el webhook
   (`/api/webhooks/stripe`); descomenta el bloque real en `src/lib/payments/stripe.ts`.
2. **Zoom** — crea una app *Server-to-Server OAuth* y define
   `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`.

### Comandos útiles de base de datos
```bash
npm run db:push   # aplica prisma/schema.prisma a la base (DATABASE_URL)
npm run db:seed   # carga el contenido demo (idempotente)
```

Todas las variables están documentadas en `.env.example`.
