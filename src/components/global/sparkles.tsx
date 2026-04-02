'use client'

import React, { useEffect, useState } from 'react'
import Particles from '@tsparticles/react'
import { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

import { motion, useAnimation } from 'framer-motion'
import { cn } from '@/lib/utils'
import { sparklesPreset, type SparklesProps } from '@/animations/sparkles'

/**
 * SparklesCore Component
 * Purpose: Renders animated particle effects using centralized animation preset
 * 
 * Architecture:
 * - Animation configuration extracted to src/animations/sparkles.ts
 * - Component only handles React-specific logic (state, refs, callbacks)
 * - Particle configuration is reusable across components
 */
export const SparklesCore = (props: SparklesProps) => {
  const {
    id,
    className,
    background,
    minSize,
    maxSize,
    speed,
    particleColor,
    particleDensity,
  } = props

  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const controls = useAnimation()

  const particlesLoaded = async () => {
    controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    })
  }

  // Merge preset with custom props
  const particleOptions = {
    ...sparklesPreset,
    background: {
      color: {
        value: background || sparklesPreset.background.color.value,
      },
    },
    particles: {
      ...sparklesPreset.particles,
      color: {
        ...sparklesPreset.particles.color,
        value: particleColor || sparklesPreset.particles.color.value,
      },
      number: {
        ...sparklesPreset.particles.number,
        value: particleDensity || sparklesPreset.particles.number.value,
      },
      move: {
        ...sparklesPreset.particles.move,
        speed: {
          min: 0.1,
          max: speed || 1,
        },
      },
      size: {
        ...sparklesPreset.particles.size,
        value: {
          min: minSize || 1,
          max: maxSize || 3,
        },
      },
    },
  }

  return (
    <motion.div
      animate={controls}
      className={cn('opacity-0', className)}
    >
      {init && (
        <Particles
          id={id || 'tsparticles'}
          className={cn('h-full w-full')}
          particlesLoaded={particlesLoaded}
          options={particleOptions as any}
        />
      )}
    </motion.div>
  )
}
