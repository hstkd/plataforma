'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, LayoutDashboard } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import type { PublicUser } from '@/lib/types'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/#categorias', label: 'Biblioteca' },
  { href: '/#maestro', label: 'El maestro' },
  { href: '/#planes', label: 'Planes' },
  { href: '/#testimonios', label: 'Testimonios' },
]

export function Navbar({ user }: { user: PublicUser | null }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-ink-line bg-ink/85 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-semibold text-bone-muted transition hover:text-bone">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn-gold">
              <LayoutDashboard className="h-4 w-4" />
              Mi panel
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold uppercase tracking-wide text-bone transition hover:text-gold">
                Ingresar
              </Link>
              <Link href="/register" className="btn-gold">
                Empezar gratis
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg border border-ink-line lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-line bg-ink/95 backdrop-blur-xl lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-bone-muted hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              {user ? (
                <Link href={user.role === 'ADMIN' ? '/admin' : '/dashboard'} className="btn-gold w-full">
                  Mi panel
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost w-full">Ingresar</Link>
                  <Link href="/register" className="btn-gold w-full">Empezar gratis</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
