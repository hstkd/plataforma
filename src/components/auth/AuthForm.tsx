'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowRight } from 'lucide-react'

export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register'

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Algo salió mal')
        setLoading(false)
        return
      }
      router.push(data.redirect ?? '/dashboard')
      router.refresh()
    } catch {
      setError('No pudimos conectar. Intenta de nuevo.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === 'register' && (
        <div>
          <label className="label" htmlFor="name">Nombre completo</label>
          <input id="name" name="name" className="input" placeholder="Tu nombre" required autoComplete="name" />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" className="input" placeholder="tucorreo@email.com" required autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          placeholder="••••••••"
          required
          minLength={mode === 'register' ? 6 : undefined}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <button type="submit" className="btn-gold w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            {mode === 'login' ? 'Ingresar' : 'Crear mi cuenta'}
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>

      <p className="text-center text-sm text-bone-muted">
        {mode === 'login' ? (
          <>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="font-semibold text-gold hover:underline">Regístrate gratis</Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-gold hover:underline">Ingresa</Link>
          </>
        )}
      </p>
    </form>
  )
}
