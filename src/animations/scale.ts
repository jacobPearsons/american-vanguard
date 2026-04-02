/**
 * Scale Animation Presets
 * Purpose: Centralized scale animation definitions
 * 
 * Rules (per docs):
 * - Animation logic must be reusable
 * - Define animation presets
 * - Components should reference presets, not define inline
 */

import type { Variants } from 'framer-motion'

/**
 * Scale in from center
 * Usage: <motion.div variants={scaleIn}>
 */
export const scaleIn: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 },
}

/**
 * Scale in from center with spring
 * Usage: <motion.div variants={scaleInSpring}>
 */
export const scaleInSpring: Variants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 20,
    }
  },
  exit: { scale: 0, opacity: 0 },
}

/**
 * Pop in animation (scale + fade)
 * Usage: <motion.div variants={popIn}>
 */
export const popIn: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    }
  },
  exit: { scale: 0.8, opacity: 0 },
}

/**
 * Pulse animation
 * Usage: <motion.div variants={pulse}>
 */
export const pulse: Variants = {
  initial: { scale: 1 },
  animate: { 
    scale: 1.05,
    transition: {
      repeat: Infinity,
      repeatType: 'reverse',
      duration: 1,
    }
  },
}
