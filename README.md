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

## ☁️ Desplegar para verla en vivo

La app está lista para desplegar **sin configurar nada** (corre en modo demo con
datos de ejemplo). Solo conviene definir `AUTH_SECRET`.

> ⚠️ **Persistencia de la demo:** mientras no conectes PostgreSQL, los datos
> viven en memoria. En **Render** (un solo proceso Node) los cambios —login,
> progreso, reservas— se mantienen durante toda la sesión. En **Vercel**
> (serverless) las _lecturas_ y el contenido se ven perfecto, pero las
> _escrituras_ pueden no compartirse entre invocaciones. **Para una demo fiel,
> recomiendo Render.** Para el deploy más rápido de Next.js, Vercel.

### Opción A — Render (recomendado para demo) 🟢
1. Entra a [render.com](https://render.com) → **New + → Blueprint**.
2. Conecta este repositorio (rama `claude/tkd-academy-platform-sbhk49`).
3. Render detecta `render.yaml`, genera `AUTH_SECRET` solo y despliega.
4. Al terminar te da una URL pública `https://hs-tkd-academy.onrender.com`.
   _(Opcional: ponla en la env var `NEXT_PUBLIC_APP_URL`.)_

### Opción B — Vercel (más rápido) ▲
1. Entra a [vercel.com/new](https://vercel.com/new) e importa este repositorio.
2. Framework: **Next.js** (autodetectado). No cambies build ni output.
3. En **Environment Variables** agrega `AUTH_SECRET` (genera uno con
   `openssl rand -base64 32`).
4. **Deploy**. Vercel te da la URL pública.

Vía CLI: `npm i -g vercel && vercel` (sigue el asistente) y luego `vercel --prod`.

### Cuentas para la demo desplegada
Las mismas de arriba: `alumno@hstkd.com` / `maestro@hstkd.com`, contraseña `taekwondo`.

---

## 🔌 Pasar a producción

1. **Base de datos** — define `DATABASE_URL`, pon `DATA_DRIVER=prisma`,
   ejecuta `npm run prisma:push` e implementa los repositorios contra `@prisma/client`.
2. **Stripe** — `npm i stripe`, define `STRIPE_SECRET_KEY` y el webhook
   (`/api/webhooks/stripe`); descomenta el bloque real en `src/lib/payments/stripe.ts`.
3. **Zoom** — crea una app *Server-to-Server OAuth* y define
   `ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`.

Todas las variables están documentadas en `.env.example`.
