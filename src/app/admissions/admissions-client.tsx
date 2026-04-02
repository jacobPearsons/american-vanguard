'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/global/navbar'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, CheckCircle, Calendar, DollarSign, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export function AdmissionsClient() {
  const { isLoaded, userId } = useAuth()
  const router = useRouter()

  const handleApplyClick = (type: 'undergraduate' | 'graduate') => {
    if (userId) {
      router.push(`/apply?type=${type}`)
    } else {
      router.push(`/sign-up?redirect_url=/apply?type=${type}`)
    }
  }

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
              Admissions
            </h1>
            <p className="text-xl text-neutral-300">
              Begin your journey at American Vanguard Institute. We're here to help you 
              every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="w-full py-12 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              onClick={() => handleApplyClick('undergraduate')}
              className="w-full bg-yellow-600 hover:bg-yellow-700 gap-2"
            >
              Apply Now <ArrowRight className="h-4 w-4" />
            </Button>
            <Link href="/contact">
              <Button variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-800 gap-2">
                Schedule Visit <Calendar className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admissions">
              <Button variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-800 gap-2">
                Financial Aid <DollarSign className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admissions">
              <Button variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-800 gap-2">
                Tuition & Fees <GraduationCap className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Undergraduate Admissions */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Undergraduate Admissions</h2>
              <p className="text-neutral-400 mb-6">
                Join our vibrant undergraduate community and prepare for a successful future. 
                Our holistic admissions process considers your academic achievements, 
                extracurricular involvement, and personal qualities.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-4">Requirements</h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Common Application or Coalition Application',
                  'Official high school transcripts',
                  'SAT or ACT scores (test-optional)',
                  'Two teacher recommendations',
                  'Personal statement',
                  'Extracurricular activities'
                ].map((req, index) => (
                  <li key={index} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleApplyClick('undergraduate')}
                className="bg-yellow-600 hover:bg-yellow-700 gap-2"
              >
                Apply as Undergraduate <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
                <h3 className="text-xl font-semibold text-white mb-4">Important Dates</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between text-neutral-300">
                    <span>Early Action I</span>
                    <span className="text-yellow-800">November 1</span>
                  </li>
                  <li className="flex justify-between text-neutral-300">
                    <span>Early Action II</span>
                    <span className="text-yellow-800">January 1</span>
                  </li>
                  <li className="flex justify-between text-neutral-300">
                    <span>Regular Decision</span>
                    <span className="text-yellow-800">January 15</span>
                  </li>
                  <li className="flex justify-between text-neutral-300">
                    <span>Transfer Deadlines</span>
                    <span className="text-yellow-800">March 1 / July 1</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
                <h3 className="text-xl font-semibold text-white mb-4">Tuition & Fees</h3>
                <p className="text-3xl font-bold text-white mb-2">$55,000</p>
                <p className="text-neutral-400 text-sm">Per academic year (2024-2025)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Graduate Admissions */}
      <section className="w-full py-20 bg-neutral-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="relative h-[400px] rounded-2xl overflow-hidden">
              <Image
                src="/american.png"
                alt="Graduate Students"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Graduate Admissions</h2>
              <p className="text-neutral-400 mb-6">
                Advance your career with one of our graduate programs. We offer over 80 
                master's and doctoral programs across seven academic colleges.
              </p>
              
              <h3 className="text-lg font-semibold text-white mb-4">Programs Include</h3>
              <ul className="space-y-3 mb-6">
                {[
                  'Master of Business Administration (MBA)',
                  'Master of Public Policy (MPP)',
                  'Master of Arts in International Relations',
                  'Doctorate in Clinical Psychology',
                  'Master of Science in Data Science',
                  'Juris Doctor (Law)'
                ].map((program, index) => (
                  <li key={index} className="flex items-center gap-3 text-neutral-300">
                    <CheckCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                    {program}
                  </li>
                ))}
              </ul>
              
              <Button 
                onClick={() => handleApplyClick('graduate')}
                className="bg-yellow-600 hover:bg-yellow-700 gap-2"
              >
                Apply as Graduate Student <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Aid */}
      <section className="w-full py-20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Financial Aid & Scholarships</h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              We believe that financial constraints should not prevent qualified students 
              from pursuing their education. Over 80% of our students receive some form 
              of financial aid.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <DollarSign className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Merit Scholarships</h3>
              <p className="text-neutral-400 text-sm">
                Automatic consideration for academic scholarships based on GPA and test scores.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <GraduationCap className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Need-Based Aid</h3>
              <p className="text-neutral-400 text-sm">
                Grants, loans, and work-study opportunities for students with demonstrated need.
              </p>
            </div>
            <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
              <CheckCircle className="h-10 w-10 text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Departmental Awards</h3>
              <p className="text-neutral-400 text-sm">
                Merit and need-based scholarships specific to your program of study.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visit Campus */}
      <section className="w-full py-20 bg-yellow-900">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Visit Our Campus</h2>
          <p className="text-yellow-100 max-w-2xl mx-auto mb-8">
            Experience American Vanguard Institute firsthand. Schedule a campus tour or 
            attend one of our admission events.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-yellow-900 hover:bg-yellow-50 gap-2">
              Schedule a Visit <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
