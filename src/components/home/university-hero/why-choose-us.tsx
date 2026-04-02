'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/animations'

const features = [
  {
    title: 'Prime Location',
    description: 'Located in Washington D.C., offering unparalleled internship and career opportunities.',
  },
  {
    title: 'Diverse Community',
    description: 'Students from 150+ countries creating a global learning environment.',
  },
  {
    title: 'Research Excellence',
    description: 'Groundbreaking research across all disciplines with world-class faculty.',
  },
  {
    title: 'Alumni Network',
    description: 'Join a network of 80,000+ successful alumni worldwide.',
  },
]

const FeatureItem = ({ title, description, index }: { title: string; description: string; index: number }) => (
  <motion.div 
    variants={fadeInUp}
    className="flex gap-4"
  >
    <div className="w-6 h-6 rounded-full bg-yellow-500 flex-shrink-0 mt-1 flex items-center justify-center">
      <span className="text-white text-xs font-bold">{index + 1}</span>
    </div>
    <div>
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-neutral-400 text-sm">{description}</p>
    </div>
  </motion.div>
)

export function WhyChooseUs() {
  return (
    <section className="w-full py-20 bg-neutral-900">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Why Choose American Vanguard Institute?
            </h2>
            <p className="text-neutral-400 mb-8">
              For over 130 years, American Vanguard Institute has been preparing students to make a difference. Our commitment to academic excellence, civic engagement, and global understanding sets us apart.
            </p>
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="space-y-4"
            >
              {features.map((feature, index) => (
                <FeatureItem key={feature.title} index={index} {...feature} />
              ))}
            </motion.div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative h-[400px] rounded-2xl overflow-hidden"
          >
            <Image
              src="/american.png"
              alt="Campus Life"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
