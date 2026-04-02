'use client'

import { useState, useEffect, Suspense, useTransition } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Navbar from '@/components/global/navbar'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, FileText, Clock, GraduationCap, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { UndergraduateForm } from '@/components/admissions/UndergraduateForm'
import { GraduateForm } from '@/components/admissions/GraduateForm'
import Image from 'next/image'

function ApplyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isLoaded, userId } = useAuth()
  const [applicationType, setApplicationType] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'undergraduate' || type === 'graduate') {
      setApplicationType(type)
      if (userId) {
        setShowForm(true)
      }
    }
  }, [searchParams, userId])

  // Show loading while checking auth
  if (!isLoaded) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    )
  }

  // If user is not authenticated and trying to access form, show message
  if (!userId && applicationType) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-950">
        <Navbar />
        <div className="pt-24 pb-12 px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
            <p className="text-neutral-400 mb-8">
              You need to sign in or create an account to start your application.
            </p>
            <div className="flex flex-col gap-4">
              <Link href="/sign-in?redirect_url=/apply">
                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up?redirect_url=/apply">
                <Button variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-800">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show the application form
  if (showForm && userId) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-950">
        <Navbar />
        
        <section className="w-full pt-24 pb-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/american.png"
              alt="American Vanguard Institute"
              fill
              className="object-cover opacity-10"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60"></div>
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={() => {
                  setShowForm(false)
                  setApplicationType(null)
                  router.push('/apply')
                }}
                className="text-neutral-400 hover:text-white"
              >
                ← Back to options
              </button>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {applicationType === 'undergraduate' ? 'Undergraduate Application' : 'Graduate Application'}
            </h1>
            <p className="text-neutral-400">
              Complete the form below to submit your application
            </p>
          </div>
        </section>

        <section className="w-full py-8">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto">
              {applicationType === 'undergraduate' && (
                <UndergraduateForm onComplete={() => {
                  router.push('/dashboard')
                }} />
              )}
              {applicationType === 'graduate' && (
                <GraduateForm onComplete={() => {
                  router.push('/dashboard')
                }} />
              )}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Show the main apply page with options
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="w-full pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/american.png"
            alt="American Vanguard Institute"
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-neutral-950/60"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Apply Now
            </h1>
            <p className="text-xl text-neutral-300">
              Take the first step towards your future at American Vanguard Institute. 
              We're excited to learn more about you.
            </p>
          </div>
        </div>
      </section>

      {/* Application Options */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Undergraduate */}
            <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <GraduationCap className="h-12 w-12 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Undergraduate</h2>
              <p className="text-neutral-400 mb-6">
                Join our undergraduate community and prepare for a successful future. 
                Application for Fall 2025 is now open.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-neutral-300">
                  <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <span>Early Action I: November 1</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <span>Early Action II: January 1</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <span>Regular Decision: January 15</span>
                </li>
              </ul>
              <Button 
                onClick={() => {
                  if (userId) {
                    router.push('/apply?type=undergraduate')
                  } else {
                    router.push('/sign-up?redirect_url=/apply?type=undergraduate')
                  }
                }}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white gap-2"
              >
                Apply as Undergraduate <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Masters */}
            <div className="p-8 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <FileText className="h-12 w-12 text-purple-500 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">Masters</h2>
              <p className="text-neutral-400 mb-6">
                Advance your career with one of our masters programs. 
                Applications for Fall 2026 are now being accepted.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3 text-neutral-300">
                  <Clock className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Priority Deadline: February 1</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <Clock className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Final Deadline: April 1</span>
                </li>
                <li className="flex items-center gap-3 text-neutral-300">
                  <Clock className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Rolling admissions after April</span>
                </li>
              </ul>
              <Button 
                onClick={() => {
                  if (userId) {
                    router.push('/apply?type=graduate')
                  } else {
                    router.push('/sign-up?redirect_url=/apply?type=graduate')
                  }
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                Apply for Masters <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Application Steps */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Application Steps</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Follow these simple steps to complete your application.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Create Account', desc: 'Set up your application portal' },
              { step: 2, title: 'Submit Application', desc: 'Complete all required fields' },
              { step: 3, title: 'Upload Documents', desc: 'Transcripts, essays, recommendations' },
              { step: 4, title: 'Track Status', desc: 'Monitor your application progress' }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-center">
                <div className="w-10 h-10 rounded-full bg-yellow-600 text-white flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-neutral-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Required Documents</h2>
            
            <div className="space-y-4">
              {[
                'Application Letter',
                'High School Transcripts',
                'Personal statement or essay',
                'Letter(s) of recommendation',
                'SAT/ACT scores (test-optional for undergraduate)',
                'TOEFL/IELTS scores (international students)'
              ].map((doc, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-xl border border-neutral-800 bg-neutral-900/50">
                  <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <span className="text-neutral-300">{doc}</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 p-6 rounded-2xl border border-yellow-500/30 bg-yellow-900/20">
              <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
              <p className="text-neutral-300 mb-4">
                Our admissions counselors are here to help you navigate the application process.
              </p>
              <Link href="/contact">
                <Button variant="outline" className="border-yellow-500 text-yellow-800 hover:bg-yellow-900/30">
                  Contact Admissions <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export function ApplyPageClient() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-neutral-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    }>
      <ApplyContent />
    </Suspense>
  )
}
