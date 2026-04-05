'use client'

import * as React from 'react'
import { X } from 'lucide-react'
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
import { Badge } from '@/components/ui/primitives/badge'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

export interface MultiSelectOption {
  value: string
  label: string
  disable?: boolean
  fixed?: boolean
}

export interface MultiSelectProps {
  value?: MultiSelectOption[]
  defaultOptions?: MultiSelectOption[]
  options?: MultiSelectOption[]
  placeholder?: string
  onChange?: (options: MultiSelectOption[]) => void
  maxSelected?: number
  onMaxSelected?: (maxLimit: number) => void
  hidePlaceholderWhenSelected?: boolean
  disabled?: boolean
  searchEnabled?: boolean
  loading?: React.ReactNode
  empty?: React.ReactNode
  className?: string
  badgeClassName?: string
}

export function MultiSelect({
  value,
  defaultOptions = [],
  options: arrayOptions,
  placeholder = 'Select options',
  onChange,
  maxSelected = Number.MAX_SAFE_INTEGER,
  onMaxSelected,
  hidePlaceholderWhenSelected,
  disabled,
  searchEnabled = true,
  loading,
  empty,
  className,
  badgeClassName,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [selected, setSelected] = React.useState<MultiSelectOption[]>(value || [])
  const [options, setOptions] = React.useState<MultiSelectOption[]>(arrayOptions || defaultOptions)
  const [inputValue, setInputValue] = React.useState('')
  const debouncedSearch = useDebounce(inputValue, 500)

  const selectedOptions = value || selected

  const handleUnselect = React.useCallback(
    (option: MultiSelectOption) => {
      const newOptions = selectedOptions.filter((s) => s.value !== option.value)
      setSelected(newOptions)
      onChange?.(newOptions)
    },
    [selectedOptions, onChange]
  )

  const handleSelect = React.useCallback(
    (option: MultiSelectOption) => {
      if (selectedOptions.length >= maxSelected) {
        onMaxSelected?.(selectedOptions.length)
        return
      }
      const newOptions = [...selectedOptions, option]
      setSelected(newOptions)
      onChange?.(newOptions)
      setInputValue('')
    },
    [selectedOptions.length, maxSelected, onMaxSelected, onChange]
  )

  React.useEffect(() => {
    if (value) setSelected(value)
  }, [value])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            'flex h-auto min-h-[42px] w-full flex-wrap items-center gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            className
          )}
        >
          {selectedOptions.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {selectedOptions.map((option) => (
            <Badge key={option.value} className={cn('gap-1', badgeClassName)}>
              {option.label}
              {!option.fixed && (
                <button
                  type="button"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    handleUnselect(option)
                  }}
                  className="ml-1 rounded-full outline-none hover:bg-black/20"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={searchEnabled}>
          {searchEnabled && (
            <CommandInput
              placeholder="Search..."
              value={inputValue}
              onValueChange={setInputValue}
            />
          )}
          <CommandList>
            {isLoading ? (
              loading
            ) : (
              <>
                <CommandEmpty>{empty || 'No option found.'}</CommandEmpty>
                <CommandGroup>
                  {options
                    .filter((opt) => !selectedOptions.some((s) => s.value === opt.value))
                    .map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        disabled={option.disable}
                        onSelect={() => handleSelect(option)}
                        className={cn(
                          'cursor-pointer',
                          option.disable && 'cursor-default text-muted-foreground'
                        )}
                      >
                        {option.label}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
