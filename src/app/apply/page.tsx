import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, FileText, Clock, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { ApplyPageClient } from './apply-client'

export const metadata = {
  title: 'Apply - American Vanguard Institute',
  description: 'Apply to American Vanguard Institute. Begin your application today.',
}

export default function ApplyPage() {
  return (
    <main className="flex flex-col min-h-screen bg-neutral-950">
      <ApplyPageClient />
      <Footer />
    </main>
  )
}
