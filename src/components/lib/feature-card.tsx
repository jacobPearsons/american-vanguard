'use client'

import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function FeatureCard({ icon: Icon, title, description, action, className = '' }: FeatureCardProps) {
  return (
    <div className={`p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 ${className}`}>
      <Icon className="h-10 w-10 text-yellow-500 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm mb-4">{description}</p>
      {action}
    </div>
  )
}

export default FeatureCard