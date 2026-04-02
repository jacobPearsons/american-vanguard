import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { UniversityHero, FeaturedPrograms, WhyChooseUs, UniversityCTA } from '@/components/home/university-hero'

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col min-h-screen bg-neutral-950">
      <Navbar />
      <UniversityHero />
      <FeaturedPrograms />
      <WhyChooseUs />
      <UniversityCTA />
      <Footer />
    </main>
  )
}
