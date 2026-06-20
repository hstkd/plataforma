import { redirect } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Sidebar } from '@/components/app/Sidebar'
import { getCurrentUser } from '@/lib/auth/session'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar variant="admin" user={user} />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-4 py-2 text-sm text-gold">
            <span className="font-bold uppercase tracking-wider">Panel de administración</span>
            <Link href="/" className="ml-auto inline-flex items-center gap-1 text-xs text-bone-muted hover:text-gold">
              Ver sitio <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}
