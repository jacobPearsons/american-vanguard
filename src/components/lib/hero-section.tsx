'use client'

import Image from 'next/image'
import { ReactNode } from 'react'

interface HeroSectionProps {
  title: string
  description: string
  imageSrc?: string
  children?: ReactNode
}

export function HeroSection({ title, description, imageSrc, children }: HeroSectionProps) {
  return (
    <section className="w-full pt-32 pb-20 relative overflow-hidden">
      {imageSrc && (
        <div className="absolute inset-0 z-0">
          <Image
            src={imageSrc}
            alt=""
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60" />
        </div>
      )}
      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{title}</h1>
          <p className="text-xl text-neutral-300 mb-6">{description}</p>
          {children}
        </div>
      </div>
    </section>
  )
}

export default HeroSection