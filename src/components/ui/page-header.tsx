import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  badge?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  badge,
  className
}: PageHeaderProps) {
  return (
    <div className={cn(
      "bg-neutral-900 border-b border-neutral-800 px-6 py-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            {Icon && <Icon className="w-6 h-6 text-yellow-500" />}
            {title}
          </h1>
          {description && (
            <p className="text-neutral-400 mt-1">{description}</p>
          )}
        </div>
        {badge && <div>{badge}</div>}
      </div>
    </div>
  )
}