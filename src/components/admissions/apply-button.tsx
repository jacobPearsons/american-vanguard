'use client'

import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import { ArrowRight } from 'lucide-react'

interface ApplyButtonProps {
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  label?: string
}

export function ApplyButton({ 
  variant = 'default', 
  size = 'default',
  className = '',
  label = 'Apply Now'
}: ApplyButtonProps) {
  const { setOpen } = useModal()

  const handleClick = () => {
    // Import dynamically to avoid SSR issues
    import('@/components/admissions/admission-type-modal').then((mod) => {
      setOpen(
        <mod.AdmissionTypeModal />
      )
    })
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleClick}
    >
      {label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  )
}
