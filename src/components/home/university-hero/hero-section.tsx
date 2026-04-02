'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/animations'

const heroStats = [
  { label: 'Students', value: '14,000+' },
  { label: 'Programs', value: '200+' },
  { label: 'Employment Rate', value: '95%' },
]

export function UniversityHero() {
  return (
    <section className="w-full min-h-[90vh] flex flex-col items-center justify-center relative overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 z-0">
        <Image
          src="/american.png"
          alt="American Vanguard Institute Campus"
          fill
          className="object-cover opacity-30"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="container px-4 md:px-6 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-blue-500/30 bg-yellow-900/20 px-4 py-1.5 text-sm text-yellow-300">
            <span className="flex h-2 w-2 rounded-full bg-yellow-500 mr-2" />
            Founded in 1893
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-center md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl">
            Shape Your Future at{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              American Vanguard Institute
            </span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-neutral-300 max-w-2xl">
            Join a community of innovative thinkers and future leaders. Discover world-class programs in the heart of Washington, D.C.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/apply">
              <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white gap-2">
                Apply Now
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/academics">
              <Button size="lg" variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800 gap-2">
                Explore Programs
              </Button>
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-8 md:gap-16 mt-12">
            {heroStats.map((stat) => (
              <div className="text-center" key={stat.label}>
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-neutral-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
