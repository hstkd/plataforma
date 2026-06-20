'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'

export function ProfileForm({ initialName }: { initialName: string }) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  async function save(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    setLoading(false)
    if (res.ok) {
      setSaved(true)
      router.refresh()
      setTimeout(() => setSaved(false), 2000)
    }
  }

  return (
    <form onSubmit={save} className="card max-w-md p-6">
      <h3 className="font-heading text-lg font-bold text-bone">Datos personales</h3>
      <div className="mt-4">
        <label className="label" htmlFor="name">Nombre completo</label>
        <input id="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <button type="submit" disabled={loading || name.trim().length < 2} className="btn-gold mt-4">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <><Check className="h-4 w-4" /> Guardado</> : 'Guardar cambios'}
      </button>
    </form>
  )
}
