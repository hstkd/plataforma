import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 text-center">
      <div>
        <Logo href="/" />
        <p className="mt-10 font-display text-8xl font-bold text-gold">404</p>
        <h1 className="mt-2 font-heading text-2xl font-bold text-bone">Esta técnica no existe</h1>
        <p className="mt-2 text-bone-muted">La página que buscas se salió del tatami.</p>
        <Link href="/" className="btn-gold mt-6">Volver al inicio</Link>
      </div>
    </main>
  )
}
