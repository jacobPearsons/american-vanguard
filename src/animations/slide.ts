/**
 * Slide Animation Presets
 * Purpose: Centralized slide animation definitions
 * 
 * Rules (per docs):
 * - Animation logic must be reusable
 * - Define animation presets
 * - Components should reference presets, not define inline
 */

import type { Variants } from 'framer-motion'

/**
 * Slide in from bottom
 * Usage: <motion.div variants={slideUp}>
 */
export const slideUp: Variants = {
  initial: { y: 100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 100, opacity: 0 },
}

/**
 * Slide in from top
 * Usage: <motion.div variants={slideDown}>
 */
export const slideDown: Variants = {
  initial: { y: -100, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -100, opacity: 0 },
}

/**
 * Slide in from left
 * Usage: <motion.div variants={slideLeft}>
 */
export const slideLeft: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 },
}

/**
 * Slide in from right
 * Usage: <motion.div variants={slideRight}>
 */
export const slideRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 },
}

/**
 * Slide in from bottom with spring
 * Usage: <motion.div variants={slideUpSpring}>
 */
export const slideUpSpring: Variants = {
  initial: { y: 100, opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
    }
  },
  exit: { y: 100, opacity: 0 },
}
