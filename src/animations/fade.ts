/**
 * Fade Animation Presets
 * Purpose: Centralized Framer Motion animation definitions
 * 
 * Rules (per docs):
 * - Animation logic must be reusable
 * - Define animation presets
 * - Components should reference presets, not define inline
 */

import type { Variants } from 'framer-motion'

/**
 * Simple fade in animation
 * Usage: <motion.div variants={fadeIn}>
 */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

/**
 * Fade in from bottom
 * Usage: <motion.div variants={fadeInUp}>
 */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

/**
 * Fade in from top
 * Usage: <motion.div variants={fadeInDown}>
 */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

/**
 * Fade in from left
 * Usage: <motion.div variants={fadeInLeft}>
 */
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

/**
 * Fade in from right
 * Usage: <motion.div variants={fadeInRight}>
 */
export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

/**
 * Staggered container for lists
 * Usage: <motion.div variants={staggerContainer}>
 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  exit: {},
}

/**
 * Container with staggered fade in
 * Usage: <motion.div variants={staggerFadeIn}>
 */
export const staggerFadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
}
