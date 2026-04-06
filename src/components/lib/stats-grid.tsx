'use client'

import { LucideIcon } from 'lucide-react'

export interface StatItem {
  label: string
  value: string
  icon: LucideIcon
  change?: string
}

interface StatsGridProps {
  stats: StatItem[]
  className?: string
}

export function StatsGrid({ stats, className = '' }: StatsGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
          <stat.icon className="h-10 w-10 text-yellow-500 mb-4" />
          <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-neutral-400 text-sm">{stat.label}</div>
          {stat.change && <div className="text-neutral-500 text-xs mt-1">{stat.change}</div>}
        </div>
      ))}
    </div>
  )
}

export default StatsGrid