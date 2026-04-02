'use client'

import type { LucideIcon } from 'lucide-react'
import { BookOpen, FlaskConical, Users, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/animations'

const programs: { icon: LucideIcon; title: string; description: string; color: string }[] = [
  {
    icon: BookOpen,
    title: 'Business & Economics',
    description: 'Learn from industry leaders in our AACSB-accredited business school.',
    color: 'bg-yellow-500',
  },
  {
    icon: FlaskConical,
    title: 'Science & Technology',
    description: 'Cutting-edge research opportunities in state-of-the-art facilities.',
    color: 'bg-green-500',
  },
  {
    icon: Users,
    title: 'Political Science',
    description: 'Shape policy and governance in the heart of American politics.',
    color: 'bg-purple-500',
  },
  {
    icon: Award,
    title: 'Arts & Humanities',
    description: 'Explore creativity and critical thinking in a vibrant artistic community.',
    color: 'bg-orange-500',
  },
]

const ProgramCard = ({ icon: Icon, title, description, color }: {
  icon: LucideIcon
  title: string
  description: string
  color: string
}) => (
  <motion.div 
    variants={fadeInUp}
    className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-colors"
  >
    <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-4`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-neutral-400 text-sm">{description}</p>
  </motion.div>
)

export function FeaturedPrograms() {
  return (
    <section className="w-full py-20 bg-neutral-950">
      <div className="container px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Programs</h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Discover our diverse range of undergraduate and graduate programs designed to prepare you for success.
          </p>
        </motion.div>
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {programs.map((program) => (
            <ProgramCard key={program.title} {...program} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
