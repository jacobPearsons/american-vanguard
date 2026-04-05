'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/overlays/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/overlays/popover'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps {
  value?: string
  options: SelectOption[]
  placeholder?: string
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

export function Select({
  value,
  options,
  placeholder = 'Select an option',
  onChange,
  disabled,
  className,
}: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
        >
          <span className={selectedOption ? 'text-foreground' : 'text-muted-foreground'}>
            {selectedOption?.label || placeholder}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  onSelect={() => {
                    onChange?.(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'cursor-pointer',
                    option.disabled && 'cursor-default text-muted-foreground'
                  )}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
