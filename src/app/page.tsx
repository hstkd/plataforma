import { Navbar } from '@/components/marketing/Navbar'
import { Hero } from '@/components/marketing/Hero'
import { Marquee } from '@/components/marketing/Marquee'
import { Categories } from '@/components/marketing/Categories'
import { Master } from '@/components/marketing/Master'
import { Pricing } from '@/components/marketing/Pricing'
import { Testimonials } from '@/components/marketing/Testimonials'
import { CTA } from '@/components/marketing/CTA'
import { Footer } from '@/components/marketing/Footer'
import { getCurrentUser } from '@/lib/auth/session'
import { db } from '@/lib/db'

export default async function HomePage() {
  const [user, plans, testimonials] = await Promise.all([
    getCurrentUser(),
    db.plans.all(),
    db.testimonials.all(),
  ])

  return (
    <>
      <Navbar user={user} />
      <main>
        <Hero />
        <Marquee />
        <Categories />
        <Master />
        <Pricing plans={plans} />
        <Testimonials items={testimonials} />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
