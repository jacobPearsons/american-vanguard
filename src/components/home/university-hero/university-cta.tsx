'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function UniversityCTA() {
  return (
    <section className="w-full py-20 bg-yellow-900">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Begin Your Journey?
        </h2>
        <p className="text-yellow-100 max-w-2xl mx-auto mb-8">
          Take the first step towards your future. Our admissions team is here to help you every step of the way.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/apply">
            <Button size="lg" className="bg-white text-yellow-900 hover:bg-yellow-50 gap-2">
              Start Your Application
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
              Schedule a Visit
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
