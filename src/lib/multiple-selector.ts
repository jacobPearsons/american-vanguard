/**
 * Multiple Selector Utilities
 * Purpose: Helper functions for multiple selector component
 * 
 * Per docs/component-design-rules.md:
 * - Extract reusable logic into utilities
 * - Keep components small and focused
 */

export interface Option {
  value: string
  label: string
  disable?: boolean
  /** fixed option that can't be removed. */
  fixed?: boolean
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined
}

export interface GroupOption {
  [key: string]: Option[]
}

/**
 * Transform options into group format
 */
export function transToGroupOption(options: Option[], groupBy?: string): GroupOption {
  if (options.length === 0) {
    return {}
  }
  if (!groupBy) {
    return {
      '': options,
    }
  }

  const groupOption: GroupOption = {}
  options.forEach((option) => {
    const key = (option[groupBy] as string) || ''
    if (!groupOption[key]) {
      groupOption[key] = []
    }
    groupOption[key].push(option)
  })
  return groupOption
}

/**
 * Remove picked options from group
 */
export function removePickedOption(groupOption: GroupOption, picked: Option[]): GroupOption {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value)
    )
  }
  return cloneOption
}

/**
 * Get selectable options (options minus picked)
 */
export function getSelectables(groupOption: GroupOption, selected: Option[]): GroupOption {
  return removePickedOption(groupOption, selected)
}
