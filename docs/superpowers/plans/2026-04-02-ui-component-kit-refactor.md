# UI Component Kit Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor UI components into proper folder structure (primitives/forms/data-display/overlays/feedback) and split large components (multiple-selector) into smaller, focused files.

**Architecture:** Create subfolders under `src/components/ui/` with each component in its own file. Use Radix UI primitives for accessibility. Split large components into logical pieces.

**Tech Stack:** Next.js, Radix UI, Tailwind CSS, TypeScript

---

## File Structure Target

```
src/components/ui/
├── index.ts                    # Re-export all components
├── primitives/
│   ├── index.ts
│   ├── button.tsx              # Existing (56 lines)
│   ├── input.tsx
│   ├── label.tsx
│   ├── badge.tsx
│   └── card.tsx
├── forms/
│   ├── index.ts
│   ├── select.tsx              # Base select (extracted from multiple-selector)
│   ├── multi-select.tsx        # Multi-select with tags
│   ├── switch.tsx
│   └── form.tsx
├── data-display/
│   ├── index.ts
│   ├── progress.tsx
│   ├── skeleton.tsx
│   └── avatar.tsx
├── overlays/
│   ├── index.ts
│   ├── dialog.tsx
│   ├── popover.tsx
│   ├── tooltip.tsx
│   ├── dropdown-menu.tsx
│   ├── drawer.tsx
│   └── command.tsx
├── feedback/
│   ├── index.ts
│   ├── toast.tsx               # Re-export from sonner
│   ├── alert.tsx
│   └── spinner.tsx             # Re-export from loading
└── patterns/
    ├── index.ts
    ├── tabs.tsx
    ├── accordion.tsx
    └── separator.tsx
```

---

## Task 1: Create Folder Structure and Primitives Index Files

**Files:**
- Create: `src/components/ui/primitives/index.ts`
- Create: `src/components/ui/forms/index.ts`
- Create: `src/components/ui/data-display/index.ts`
- Create: `src/components/ui/overlays/index.ts`
- Create: `src/components/ui/feedback/index.ts`
- Create: `src/components/ui/patterns/index.ts`
- Modify: `src/components/ui/index.ts` (update to re-export from subfolders)

- [ ] **Step 1: Create primitives/index.ts**

```typescript
export * from './button'
export * from './input'
export * from './label'
export * from './badge'
export * from './card'
```

- [ ] **Step 2: Create forms/index.ts**

```typescript
export * from './select'
export * from './multi-select'
export * from './switch'
export * from './form'
```

- [ ] **Step 3: Create data-display/index.ts**

```typescript
export * from './progress'
export * from './skeleton'
export * from './avatar'
```

- [ ] **Step 4: Create overlays/index.ts**

```typescript
export * from './dialog'
export * from './popover'
export * from './tooltip'
export * from './dropdown-menu'
export * from './drawer'
export * from './command'
```

- [ ] **Step 5: Create feedback/index.ts**

```typescript
export * from './toast'
export * from './alert'
export * from './spinner'
```

- [ ] **Step 6: Create patterns/index.ts**

```typescript
export * from './tabs'
export * from './accordion'
export * from './separator'
```

- [ ] **Step 7: Update main index.ts**

```typescript
export * from './primitives'
export * from './forms'
export * from './data-display'
export * from './overlays'
export * from './feedback'
export * from './patterns'
```

- [ ] **Step 8: Commit**

```bash
git add src/components/ui/
git commit -refactor: create UI component folder structure
```

---

## Task 2: Split multiple-selector.tsx into select.tsx and multi-select.tsx

**Files:**
- Create: `src/components/ui/forms/select.tsx` (~150 lines)
- Create: `src/components/ui/forms/multi-select.tsx` (~200 lines)
- Modify: `src/components/ui/multiple-selector.tsx` (remove, keep as re-export for backwards compat)

- [ ] **Step 1: Create forms/select.tsx - Base select primitive**

```typescript
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
```

- [ ] **Step 2: Create forms/multi-select.tsx - Multi-select with tags**

```typescript
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
                  onClick={(e) => {
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
```

- [ ] **Step 3: Create data-display/skeleton.tsx**

```typescript
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  )
}
```

- [ ] **Step 4: Create data-display/avatar.tsx**

```typescript
import * as React from 'react'
import { cn } from '@/lib/utils'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

export function Avatar({ src, alt, fallback, size = 'md', className, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false)

  return (
    <div
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full bg-muted',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {src && !error ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" onError={() => setError(true)} />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground">
          {fallback?.charAt(0).toUpperCase() || '?'}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Create feedback/spinner.tsx** (from loading.tsx)

```typescript
import { cn } from '@/lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Spinner({ size = 'md', className, ...props }: SpinnerProps) {
  return (
    <span
      className={cn('animate-spin rounded-full border-2 border-muted border-t-foreground', sizeClasses[size], className)}
      {...props}
    />
  )
}
```

- [ ] **Step 6: Create feedback/toast.tsx** (re-export from sonner)

```typescript
export { Toaster } from 'sonner'
export type { Toast } from 'sonner'
```

- [ ] **Step 7: Create feedback/alert.tsx**

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive: 'border-destructive/50 text-destructive [&>svg]:text-destructive',
        success: 'border-green-500/50 text-green-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

export function Alert({ className, variant, ...props }: AlertProps) {
  return <div className={cn(alertVariants({ variant }), className)} role="alert" {...props} />
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />
}
```

- [ ] **Step 8: Move command.tsx to overlays folder**

```bash
mv src/components/ui/command.tsx src/components/ui/overlays/command.tsx
```

- [ ] **Step 9: Commit**

```bash
git add src/components/ui/
git commit -refactor: split multi-select and add new UI components
```

---

## Task 3: Update Import Paths

**Files:**
- Modify: All files that import from old paths

- [ ] **Step 1: Find and update imports**

```bash
# Update imports from @/components/ui/command to @/components/ui/overlays/command
# Update imports from @/components/ui/loading to @/components/ui/feedback/spinner
# Update imports from @/components/ui/sonner to @/components/ui/feedback/toast
```

- [ ] **Step 2: Test build**

```bash
npm run build 2>&1 | head -50
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -refactor: update UI component import paths
```

---

## Summary

| Component | Lines Before | Lines After | Location |
|-----------|-------------|-------------|----------|
| multiple-selector | 460 | split | forms/multi-select.tsx |
| select (new) | - | ~100 | forms/select.tsx |
| skeleton (new) | - | ~15 | data-display/skeleton.tsx |
| avatar (new) | - | ~35 | data-display/avatar.tsx |
| spinner (new) | - | ~20 | feedback/spinner.tsx |
| alert (new) | - | ~40 | feedback/alert.tsx |

**Remaining large files to address:**
- `AcceptanceLetterPDF.tsx` (439 lines)
- `GraduateForm.tsx` (220 lines)
- `admissions-client.tsx` (255 lines)
- `jobs/page.tsx` (296 lines)
- `billing/page.tsx` (228 lines)
