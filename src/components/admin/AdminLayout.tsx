import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Search } from 'lucide-react'

interface AdminLayoutProps {
  title: string
  description: string
  children: React.ReactNode
  actions?: React.ReactNode
}

export function AdminLayout({ 
  title, 
  description, 
  children, 
  actions 
}: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-neutral-400">{description}</p>
          </div>
          {actions}
        </div>
        {children}
      </div>
    </div>
  )
}

interface AdminCardProps { 
  title?: string
  children: React.ReactNode
  className?: string 
}

export function AdminCard({ 
  title,
  children, 
  className = '' 
}: AdminCardProps) {
  return (
    <Card className={`bg-neutral-900 border-neutral-800 ${className}`}>
      {title && (
        <CardHeader>
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}

interface AdminStatsProps {
  stats: { label: string; value: number | string; color?: string }[]
}

export function AdminStats({ stats }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <AdminCard key={i}>
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-400">{stat.label}</span>
            <span className={`text-sm font-medium ${stat.color || 'text-white'}`}>
              {stat.value}
            </span>
          </div>
        </AdminCard>
      ))}
    </div>
  )
}

interface AdminSearchFilterProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  filterType: string
  onFilterChange: (value: string) => void
  filterOptions: { value: string; label: string }[]
}

export function AdminSearchFilter({ 
  searchQuery, 
  onSearchChange,
  filterType,
  onFilterChange,
  filterOptions
}: AdminSearchFilterProps) {
  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
        />
      </div>
      <select
        value={filterType}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-white focus:ring-2 focus:ring-yellow-600 focus:border-transparent"
      >
        {filterOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
