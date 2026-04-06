import * as React from "react"
import { cn } from "@/lib/utils"

export interface FilterOption {
  value: string
  label: string
}

interface FilterBarProps {
  filters: {
    name: string
    options: FilterOption[]
    value: string
    onChange: (value: string) => void
  }[]
  className?: string
}

export function FilterBar({ filters, className }: FilterBarProps) {
  return (
    <div className={cn("flex gap-4 flex-wrap", className)} role="group" aria-label="Filter options">
      {filters.map((filter) => (
        <div key={filter.name} className="flex items-center gap-2">
          <label htmlFor={`filter-${filter.name}`} className="text-sm text-neutral-400 sr-only">
            {filter.name}
          </label>
          <select
            id={`filter-${filter.name}`}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
          >
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}