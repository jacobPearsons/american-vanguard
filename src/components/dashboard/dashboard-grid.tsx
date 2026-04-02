import { cn } from '@/lib/utils'
import React from 'react'

interface DashboardGridProps {
  children: React.ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

/**
 * Responsive grid layout for dashboard sections
 * Supports 1-4 columns based on screen size
 */
export function DashboardGrid({ 
  children, 
  className,
  columns = 2 
}: DashboardGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 lg:grid-cols-2',
    3: 'grid-cols-1 lg:grid-cols-3',
    4: 'grid-cols-1 lg:grid-cols-4'
  }

  return (
    <div className={cn("grid gap-6", gridCols[columns], className)}>
      {children}
    </div>
  )
}

export default DashboardGrid
