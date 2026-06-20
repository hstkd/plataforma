'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  type: 'COURSE' | 'PRIVATE_CLASS' | 'MEMBERSHIP'
  courseId?: string
  planId?: string
  label: string
  className?: string
}

export function CheckoutButton({ type, courseId, planId, label, className }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function checkout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, courseId, planId }),
      })
      const data = await res.json()
      if (!res.ok) {
        alert(data.error ?? 'No se pudo iniciar el pago')
        setLoading(false)
        return
      }
      // En modo real, data.url es el Checkout de Stripe.
      // En modo simulado, el acceso ya quedó activo: refrescamos la vista.
      if (data.simulated) {
        router.refresh()
        setLoading(false)
      } else {
        window.location.href = data.url
      }
    } catch {
      alert('Error de conexión')
      setLoading(false)
    }
  }

  return (
    <button onClick={checkout} disabled={loading} className={cn('btn-gold', className)}>
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : label}
    </button>
  )
}
