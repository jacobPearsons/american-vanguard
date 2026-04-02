'use client'

import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'

interface FacultySearchProps {
  onSearch: (search: string) => void
}

export const FacultySearch: React.FC<FacultySearchProps> = ({ onSearch }) => {
  const [value, setValue] = useState('')

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
      onSearch(e.target.value)
    },
    [onSearch]
  )

  return (
    <Input
      type="text"
      placeholder="Search faculty by name..."
      value={value}
      onChange={handleChange}
      className="max-w-md"
    />
  )
}
