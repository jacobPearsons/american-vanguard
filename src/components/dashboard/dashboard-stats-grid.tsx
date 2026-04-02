import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface DashboardStat {
  label: string
  value: string
  icon: LucideIcon
  change: string
  changeType?: 'positive' | 'negative' | 'neutral'
}

interface DashboardStatsGridProps {
  stats: DashboardStat[]
  className?: string
}

/**
 * Stats grid component for displaying dashboard metrics
 * Uses consistent card styling with WorkForce theme
 */
export function DashboardStatsGrid({ stats, className }: DashboardStatsGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", className)}>
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-neutral-900 border-neutral-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-lg bg-emerald-500/20">
                <stat.icon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm">{stat.change}</span>
              <span className="text-neutral-500 text-sm">this month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default DashboardStatsGrid
