'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LogOut, Menu, X, type LucideIcon,
  Home, Library, CalendarDays, Crown, User,
  LayoutDashboard, Clapperboard, Users, CalendarCheck,
} from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { BeltBadge } from '@/components/ui/BeltBadge'
import type { PublicUser } from '@/lib/types'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: LucideIcon
  exact?: boolean
}

// Los íconos se definen aquí dentro (Client Component): no pueden cruzar
// la frontera Server→Client como props serializables.
const NAVS: Record<'student' | 'admin', NavItem[]> = {
  student: [
    { href: '/dashboard', label: 'Inicio', icon: Home, exact: true },
    { href: '/dashboard/biblioteca', label: 'Biblioteca', icon: Library },
    { href: '/dashboard/agenda', label: 'Agenda', icon: CalendarDays },
    { href: '/dashboard/membresia', label: 'Membresía', icon: Crown },
    { href: '/dashboard/perfil', label: 'Mi perfil', icon: User },
  ],
  admin: [
    { href: '/admin', label: 'Resumen', icon: LayoutDashboard, exact: true },
    { href: '/admin/cursos', label: 'Cursos', icon: Clapperboard },
    { href: '/admin/alumnos', label: 'Alumnos', icon: Users },
    { href: '/admin/reservas', label: 'Reservas', icon: CalendarCheck },
  ],
}

export function Sidebar({ variant, user }: { variant: 'student' | 'admin'; user: PublicUser }) {
  const items = NAVS[variant]
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(item.href + '/')

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1">
      {items.map((item) => {
        const active = isActive(item)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn(
              'group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition',
              active
                ? 'bg-gold text-ink'
                : 'text-bone-muted hover:bg-white/5 hover:text-bone',
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  const profile = (
    <div className="border-t border-ink-line pt-4">
      <div className="flex items-center gap-3 px-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user.avatarUrl} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-bone">{user.name}</p>
          <BeltBadge belt={user.belt} size="sm" showLabel={false} />
        </div>
      </div>
      <button
        onClick={logout}
        className="mt-3 flex w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-bone-muted transition hover:bg-white/5 hover:text-red-300"
      >
        <LogOut className="h-4 w-4" /> Cerrar sesión
      </button>
    </div>
  )

  return (
    <>
      {/* Topbar móvil */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-line bg-ink/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Logo />
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-lg border border-ink-line">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-ink-line bg-ink-soft p-5 lg:flex">
        <Logo />
        {nav}
        {profile}
      </aside>

      {/* Drawer móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-72 flex-col gap-6 border-r border-ink-line bg-ink-soft p-5">
            <div className="flex items-center justify-between">
              <Logo />
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-lg border border-ink-line">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
            {profile}
          </div>
        </div>
      )}
    </>
  )
}
