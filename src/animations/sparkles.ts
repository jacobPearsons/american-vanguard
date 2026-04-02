/**
 * Sparkles Animation Preset
 * Purpose: Centralized particle/sparkles configuration for reusable animations
 * 
 * Usage:
 * import { sparklesPreset } from '@/animations/sparkles'
 * 
 * <Particles options={sparklesPreset} />
 */

import type { MoveDirection, OutMode } from '@tsparticles/engine'

/**
 * Sparkles particle configuration preset
 * Reusable across multiple components
 */
export const sparklesPreset = {
  background: {
    color: {
      value: '#0d47a1',
    },
  },
  fullScreen: {
    enable: false,
    zIndex: 1,
  },
  fpsLimit: 120,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
      onHover: {
        enable: false,
        mode: 'repulse',
      },
      resize: true,
    },
    modes: {
      push: {
        quantity: 4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
  particles: {
    bounce: {
      horizontal: {
        value: 1,
      },
      vertical: {
        value: 1,
      },
    },
    collisions: {
      absorb: {
        speed: 2,
      },
      bounce: {
        horizontal: {
          value: 1,
        },
        vertical: {
          value: 1,
        },
      },
      enable: false,
      maxSpeed: 50,
      mode: 'bounce' as const,
      overlap: {
        enable: true,
        retries: 0,
      },
    },
    color: {
      value: '#ffffff',
      animation: {
        h: {
          count: 0,
          enable: false,
          speed: 1,
          decay: 0,
          delay: 0,
          sync: true,
          offset: 0,
        },
        s: {
          count: 0,
          enable: false,
          speed: 1,
          decay: 0,
          delay: 0,
          sync: true,
          offset: 0,
        },
        l: {
          count: 0,
          enable: false,
          speed: 1,
          decay: 0,
          delay: 0,
          sync: true,
          offset: 0,
        },
      },
    },
    effect: {
      close: true,
      fill: true,
      options: {},
      type: {} as const,
    },
    groups: {},
    move: {
      angle: {
        offset: 0,
        value: 90,
      },
      attract: {
        distance: 200,
        enable: false,
        rotate: {
          x: 3000,
          y: 3000,
        },
      },
      center: {
        x: 50,
        y: 50,
        mode: 'percent' as const,
        radius: 0,
      },
      decay: 0,
      distance: {},
      direction: 'none' as MoveDirection,
      drift: 0,
      enable: true,
      gravity: {
        acceleration: 9.81,
        enable: false,
        inverse: false,
        maxSpeed: 50,
      },
      path: {
        clamp: true,
        delay: {
          value: 0,
        },
        enable: false,
        options: {},
      },
      outModes: {
        default: 'out' as OutMode,
      },
      random: false,
      size: false,
      speed: {
        min: 0.1,
        max: 1,
      },
      spin: {
        acceleration: 0,
        enable: false,
      },
      straight: false,
      trail: {
        enable: false,
        length: 10,
        fill: {},
      },
      vibrate: false,
      warp: false,
    },
    number: {
      density: {
        enable: true,
        width: 400,
        height: 400,
      },
      limit: {
        mode: 'delete' as const,
        value: 0,
      },
      value: 120,
    },
    opacity: {
      value: {
        min: 0.1,
        max: 1,
      },
      animation: {
        count: 0,
        enable: true,
        speed: 4,
        decay: 0,
        delay: 2,
        sync: false,
        mode: 'auto' as const,
        startValue: 'random' as const,
        destroy: 'none' as const,
      },
    },
    reduceDuplicates: false,
    shadow: {
      blur: 0,
      color: {
        value: '#000',
      },
      enable: false,
      offset: {
        x: 0,
        y: 0,
      },
    },
    shape: {
      close: true,
      fill: true,
      options: {},
      type: 'circle' as const,
    },
    size: {
      value: {
        min: 1,
        max: 3,
      },
      animation: {
        count: 0,
        enable: false,
        speed: 5,
        decay: 0,
        delay: 0,
        sync: false,
        mode: 'auto' as const,
        startValue: 'random' as const,
        destroy: 'none' as const,
      },
    },
    stroke: {
      width: 0,
    },
    zIndex: {
      value: 0,
      opacityRate: 1,
      sizeRate: 1,
      velocityRate: 1,
    },
    destroy: {
      bounds: {},
      mode: 'none' as const,
      split: {
        count: 1,
        factor: {
          value: 3,
        },
        rate: {
          value: {
            min: 4,
            max: 9,
          },
        },
        sizeOffset: true,
      },
    },
    roll: {
      darken: {
        enable: false,
        value: 0,
      },
      enable: false,
      enlighten: {
        enable: false,
        value: 0,
      },
      mode: 'vertical' as const,
      speed: 25,
    },
    tilt: {
      value: 0,
      animation: {
        enable: false,
        speed: 0,
        decay: 0,
        sync: false,
      },
      direction: 'clockwise' as const,
      enable: false,
    },
    twinkle: {
      lines: {
        enable: false,
        frequency: 0.05,
        opacity: 1,
      },
      particles: {
        enable: false,
        frequency: 0.05,
        opacity: 1,
      },
    },
    wobble: {
      distance: 5,
      enable: false,
      speed: {
        angle: 50,
        move: 10,
      },
    },
    life: {
      count: 0,
      delay: {
        value: 0,
        sync: false,
      },
      duration: {
        value: 0,
        sync: false,
      },
    },
    rotate: {
      value: 0,
      animation: {
        enable: false,
        speed: 0,
        decay: 0,
        sync: false,
      },
      direction: 'clockwise' as const,
      path: false,
    },
    orbit: {
      animation: {
        count: 0,
        enable: false,
        speed: 1,
        decay: 0,
        delay: 0,
        sync: false,
      },
      enable: false,
      opacity: 1,
      rotation: {
        value: 45,
      },
      width: 1,
    },
    links: {
      blink: false,
      color: {
        value: '#fff',
      },
      consent: false,
      distance: 100,
      enable: false,
      frequency: 1,
      opacity: 1,
      shadow: {
        blur: 5,
        color: {
          value: '#000',
        },
        enable: false,
      },
      triangles: {
        enable: false,
        frequency: 1,
      },
      width: 1,
      warp: false,
    },
    repulse: {
      value: 0,
      enabled: false,
      distance: 1,
      duration: 1,
      factor: 1,
      speed: 1,
    },
  },
  detectRetina: true,
}

/**
 * Default sparkles component props
 * Extends base configuration with customizable options
 */
export interface SparklesProps {
  id?: string
  className?: string
  background?: string
  particleSize?: number
  minSize?: number
  maxSize?: number
  speed?: number
  particleColor?: string
  particleDensity?: number
}

/**
 * Creates a customized sparkles configuration
 * @param options - Partial configuration overrides
 * @returns Full sparkles configuration
 */
export const createSparklesConfig = (options?: Partial<SparklesProps>) => {
  return {
    ...sparklesPreset,
    background: {
      color: {
        value: options?.background || sparklesPreset.background.color.value,
      },
    },
    particles: {
      ...sparklesPreset.particles,
      color: {
        ...sparklesPreset.particles.color,
        value: options?.particleColor || sparklesPreset.particles.color.value,
      },
      number: {
        ...sparklesPreset.particles.number,
        value: options?.particleDensity || sparklesPreset.particles.number.value,
      },
      move: {
        ...sparklesPreset.particles.move,
        speed: {
          min: 0.1,
          max: options?.speed || 1,
        },
      },
      size: {
        ...sparklesPreset.particles.size,
        value: {
          min: options?.minSize || 1,
          max: options?.maxSize || 3,
        },
      },
    },
  }
}
