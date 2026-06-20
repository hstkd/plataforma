import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, Star, Library, CalendarDays, Crown } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { BRAND } from '@/lib/brand'
import { VIDEO_HERO } from '@/lib/db/seed'
import { getCurrentUser } from '@/lib/auth/session'

// La plataforma es la aplicación (no el sitio de marketing, que vive aparte).
// La raíz es una pantalla breve de acceso: si hay sesión, vamos directo al panel.
export default async function AccessPage() {
  const user = await getCurrentUser()
  if (user) redirect(user.role === 'ADMIN' ? '/admin' : '/dashboard')

  return (
    <main className="relative grid min-h-svh place-items-center overflow-hidden px-5 py-10">
      {/* Fondo en video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay muted loop playsInline
        poster="https://picsum.photos/seed/tkdhero/1600/900"
      >
        <source src={VIDEO_HERO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/80 to-ink" />
      <div className="bg-gold-radial pointer-events-none absolute inset-0" />

      <div className="relative z-10 w-full max-w-md text-center">
        <div className="flex justify-center">
          <Logo href={null} />
        </div>

        <span className="eyebrow mt-8 justify-center">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          {BRAND.korean} · Plataforma de entrenamiento
        </span>

        <h1 className="display mt-4 text-4xl text-bone sm:text-5xl">
          Entra a tu <span className="gradient-text">dojang digital</span>
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-bone-muted">
          Accede a tu biblioteca de cursos, tu progreso por cinturón y tus clases
          privadas con el maestro {BRAND.master}.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/login" className="btn-gold text-base">
            Ingresar <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/register" className="btn-ghost text-base">
            Crear cuenta gratis
          </Link>
        </div>

        {/* Accesos destacados */}
        <div className="mt-10 grid grid-cols-3 gap-3">
          {[
            { icon: Library, label: 'Biblioteca' },
            { icon: CalendarDays, label: 'Clases en vivo' },
            { icon: Crown, label: 'Membresías' },
          ].map((f) => (
            <div key={f.label} className="card flex flex-col items-center gap-2 px-2 py-4">
              <f.icon className="h-5 w-5 text-gold" />
              <span className="text-xs font-semibold text-bone-muted">{f.label}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-1.5 text-sm text-bone-muted">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-gold text-gold" />
          ))}
          <span className="ml-1">+500 alumnos entrenando</span>
        </div>
      </div>

      <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-xs text-bone-faint">
        © {new Date().getFullYear()} {BRAND.full}
      </p>
    </main>
  )
}
