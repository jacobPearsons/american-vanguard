import { Button } from '@/components/ui/button'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import React from 'react'

interface DashboardHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href: string
    icon?: LucideIcon
  }
  className?: string
}

/**
 * Dashboard header component with title, description, and optional action button
 * Follows WorkForce design with consistent styling
 */
export function DashboardHeader({ 
  title, 
  description, 
  action, 
  className 
}: DashboardHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {description && (
          <p className="text-neutral-400 mt-1">{description}</p>
        )}
      </div>
      {action && (
        <Link href={action.href}>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        </Link>
      )}
    </div>
  )
}

export default DashboardHeader
