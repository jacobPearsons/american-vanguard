'use client'

import { useModal } from '@/providers/modal-provider'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from '@/components/ui/overlays/dialog'
import { Button } from '@/components/ui/button'
import { 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

interface AdmissionTypeModalProps {
  title?: string
  description?: string
}

export function AdmissionTypeModal({ 
  title = 'Choose Your Path',
  description = 'Select the type of program you are interested in applying to.'
}: AdmissionTypeModalProps) {
  const { isOpen, setClose } = useModal()
  const { userId } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  const handleApply = (type: 'undergraduate' | 'graduate') => {
    if (!userId) {
      // Redirect to sign up if not authenticated
      window.location.href = `/sign-up?redirect_url=/apply&admission_type=${type}`
      return
    }
    // If authenticated, navigate to the application page
    window.location.href = `/apply?type=${type}`
    setClose()
  }

  const programTypes = [
    {
      id: 'undergraduate',
      title: 'Undergraduate',
      description: "Bachelor's degree programs for high school graduates",
      icon: GraduationCap,
      features: [
        '4-year degree programs',
        'Flexible major selection',
        'Campus life & activities',
        'Research opportunities'
      ],
      cta: 'Apply as Undergraduate',
      color: 'bg-yellow-600 hover:bg-yellow-700'
    },
    {
      id: 'graduate',
      title: 'Graduate',
      description: "Master's and doctoral programs for college graduates",
      icon: BookOpen,
      features: [
        "Master's & PhD programs",
        'Advanced research',
        'Professional development',
        'Specialized expertise'
      ],
      cta: 'Apply as Graduate Student',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={() => setClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-neutral-900 border-neutral-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">{title}</DialogTitle>
          <DialogDescription className="text-neutral-400">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {programTypes.map((type) => (
            <div 
              key={type.id}
              className="p-6 rounded-xl border border-neutral-800 bg-neutral-800/50 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-lg ${type.color} text-white`}>
                  <type.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white">{type.title}</h3>
              </div>
              
              <p className="text-neutral-400 text-sm mb-4">{type.description}</p>
              
              <ul className="space-y-2 mb-6">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-neutral-300">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => handleApply(type.id as 'undergraduate' | 'graduate')}
                className={`w-full ${type.color} text-white gap-2`}
              >
                {type.cta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-4 flex flex-col gap-3">
          <p className="text-sm text-neutral-500 text-center">
            Already have an application? 
            <Link href="/dashboard" className="text-yellow-500 hover:underline ml-1">
              Check your status
            </Link>
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
