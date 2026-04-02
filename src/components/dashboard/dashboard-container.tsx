import { cn } from '@/lib/utils'
import React from 'react'

interface DashboardContainerProps {
  children: React.ReactNode
  className?: string
}

/**
 * Main container component for dashboard pages
 * Provides consistent padding, background, and layout structure
 * Following WorkForce style guidelines with dark theme
 */
export function DashboardContainer({ children, className }: DashboardContainerProps) {
  return (
    <div 
      className={cn(
        "flex flex-col gap-6 p-6 bg-neutral-950 min-h-screen",
        className
      )}
    >
      {children}
    </div>
  )
}

export default DashboardContainer
