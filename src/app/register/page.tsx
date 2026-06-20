import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { AuthForm } from '@/components/auth/AuthForm'
import { getCurrentUser } from '@/lib/auth/session'

export const metadata: Metadata = { title: 'Crear cuenta' }

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect(user.role === 'ADMIN' ? '/admin' : '/dashboard')

  return (
    <AuthShell
      title="Empieza gratis hoy"
      subtitle="Crea tu cuenta y desbloquea tu primer entrenamiento."
    >
      <AuthForm mode="register" />
    </AuthShell>
  )
}
