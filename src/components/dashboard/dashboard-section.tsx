import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LucideIcon, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import React from 'react'

interface DashboardSectionProps {
  title: string
  description?: string
  action?: {
    label: string
    href: string
  }
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}

/**
 * Reusable dashboard section component with header, optional action, and content
 * Provides consistent card styling and layout structure
 */
export function DashboardSection({
  title,
  description,
  action,
  children,
  className,
  noPadding = false
}: DashboardSectionProps) {
  return (
    <Card className={cn("bg-neutral-900 border-neutral-800", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">{title}</CardTitle>
          {description && (
            <p className="text-sm text-neutral-400 mt-1">{description}</p>
          )}
        </div>
        {action && (
          <Link href={action.href}>
            <Button variant="ghost" size="sm" className="text-neutral-400">
              {action.label} <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        )}
      </CardHeader>
      <CardContent className={noPadding ? '' : ''}>
        {children}
      </CardContent>
    </Card>
  )
}

export default DashboardSection
