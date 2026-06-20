import type { Metadata, Viewport } from 'next'
import { Oswald, Montserrat, Inter } from 'next/font/google'
import { BRAND } from '@/lib/brand'
import './globals.css'

const display = Oswald({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
})
const heading = Montserrat({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  variable: '--font-heading',
})
const body = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: {
    default: `${BRAND.full} — Entrena Taekwondo de élite`,
    template: `%s · ${BRAND.name}`,
  },
  description:
    'Plataforma premium de Taekwondo: cursos en video, rutas de progreso por cinturón, membresías, clases privadas por Zoom y agenda online con el maestro Henry Sigchos.',
  keywords: ['Taekwondo', 'cursos online', 'Henry Sigchos', 'poomsae', 'combate', 'Quito', 'Ecuador'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: BRAND.full,
    description: 'Entrena Taekwondo de élite, donde sea que estés.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${heading.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  )
}
