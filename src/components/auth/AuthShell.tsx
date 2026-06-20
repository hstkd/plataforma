import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="relative grid min-h-screen lg:grid-cols-2">
      {/* Panel visual */}
      <div className="relative hidden overflow-hidden border-r border-ink-line lg:block">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay muted loop playsInline
          poster="https://picsum.photos/seed/authtkd/1000/1400"
        >
          <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <Logo />
          <div>
            <h2 className="display text-5xl text-bone">
              Tu dojang,<br /><span className="gradient-text">siempre contigo.</span>
            </h2>
            <p className="mt-4 max-w-sm text-bone-muted">
              Más de 500 alumnos ya entrenan con el método HS TKD. Únete a la academia.
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Logo />
          </div>
          <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-bone-muted hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Volver al inicio
          </Link>
          <h1 className="font-heading text-3xl font-extrabold text-bone">{title}</h1>
          <p className="mt-2 text-bone-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>

          <div className="mt-8 rounded-xl border border-ink-line bg-ink-soft p-4 text-xs text-bone-muted">
            <p className="font-semibold text-bone">Cuentas de prueba</p>
            <p className="mt-1">👤 Alumno: <span className="text-gold">alumno@hstkd.com</span> · taekwondo</p>
            <p>🛡️ Admin: <span className="text-gold">maestro@hstkd.com</span> · taekwondo</p>
          </div>
        </div>
      </div>
    </main>
  )
}
