import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import { AdmissionsClient } from './admissions-client'

export const metadata = {
  title: 'Admissions - American Vanguard Institute',
  description: 'Apply to American Vanguard Institute. Learn about admissions requirements, tuition, and financial aid.',
}

export default function AdmissionsPage() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <AdmissionsClient />
      <Footer />
    </main>
  )
}
