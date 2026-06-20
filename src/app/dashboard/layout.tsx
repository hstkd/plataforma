import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/app/Sidebar'
import { getCurrentUser } from '@/lib/auth/session'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect('/login')
  if (user.role === 'ADMIN') redirect('/admin')

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Sidebar variant="student" user={user} />
      <main className="flex-1 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
