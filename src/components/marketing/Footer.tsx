import Link from 'next/link'
import { Instagram, Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { BRAND } from '@/lib/brand'

export function Footer() {
  return (
    <footer className="border-t border-ink-line bg-ink-soft">
      <div className="container-x grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-bone-muted">
            {BRAND.full}. Entrena Taekwondo de élite con el maestro {BRAND.master},
            desde cualquier lugar. {BRAND.korean} desde {BRAND.since}.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={BRAND.instagramUrl} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-ink-line text-bone-muted transition hover:border-gold/50 hover:text-gold">
              <Instagram className="h-5 w-5" />
            </a>
            <a href={`mailto:${BRAND.email}`} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-line text-bone-muted transition hover:border-gold/50 hover:text-gold">
              <Mail className="h-5 w-5" />
            </a>
            <a href={BRAND.whatsapp} target="_blank" rel="noopener noreferrer" className="grid h-10 w-10 place-items-center rounded-lg border border-ink-line text-bone-muted transition hover:border-gold/50 hover:text-gold">
              <Phone className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-bone">Plataforma</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="/#categorias" className="link-muted">Biblioteca</Link></li>
            <li><Link href="/#planes" className="link-muted">Membresías</Link></li>
            <li><Link href="/register" className="link-muted">Crear cuenta</Link></li>
            <li><Link href="/login" className="link-muted">Ingresar</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-bone">Contacto</h4>
          <ul className="mt-4 space-y-3 text-sm text-bone-muted">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold" />{BRAND.phone}</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold" />{BRAND.email}</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" />{BRAND.locations.join(' · ')}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-line">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-bone-faint sm:flex-row">
          <p>© {new Date().getFullYear()} {BRAND.full}. Todos los derechos reservados.</p>
          <p>Hecho con disciplina en Ecuador 🇪🇨</p>
        </div>
      </div>
    </footer>
  )
}
