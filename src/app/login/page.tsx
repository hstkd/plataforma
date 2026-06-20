import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/AuthShell'
import { AuthForm } from '@/components/auth/AuthForm'
import { getCurrentUser } from '@/lib/auth/session'

export const metadata: Metadata = { title: 'Ingresar' }

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect(user.role === 'ADMIN' ? '/admin' : '/dashboard')

  return (
    <AuthShell title="Bienvenido de nuevo" subtitle="Ingresa para continuar tu entrenamiento.">
      <AuthForm mode="login" />
    </AuthShell>
  )
}
