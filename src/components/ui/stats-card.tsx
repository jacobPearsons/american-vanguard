import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  variant?: 'default' | 'gradient'
  className?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  className
}: StatsCardProps) {
  return (
    <Card className={cn(
      variant === 'gradient' 
        ? "bg-gradient-to-r from-blue-600 to-indigo-700 border-0"
        : "bg-neutral-900 border-neutral-800",
      className
    )}>
      <CardContent className={cn(
        "p-6",
        variant === 'gradient' && "text-white"
      )}>
        <div className="flex items-center justify-between">
          <div>
            <p className={cn(
              "text-sm",
              variant === 'gradient' ? "text-blue-200" : "text-neutral-400"
            )}>{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            {subtitle && (
              <p className={cn(
                "text-xs mt-1",
                variant === 'gradient' ? "text-blue-200" : "text-neutral-500"
              )}>{subtitle}</p>
            )}
          </div>
          <Icon className={cn(
            "w-10 h-10",
            variant === 'gradient' ? "text-white/50" : "text-yellow-500"
          )} />
        </div>
      </CardContent>
    </Card>
  )
}