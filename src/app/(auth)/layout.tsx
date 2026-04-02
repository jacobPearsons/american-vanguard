import React from 'react'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen w-full bg-neutral-950">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-yellow-900 via-yellow-800 to-neutral-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>
        
        {/* Logo and University Name */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="AVI Logo" 
              width={48} 
              height={48}
              className="w-12 h-12 rounded-lg object-contain bg-white/10"
            />
            <Image 
              src="/title.png" 
              alt="American Vanguard Institute" 
              width={200}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Welcome Message */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">
            Welcome to AVI Portal
          </h2>
          <p className="text-yellow-100 text-lg mb-8">
            Access your student dashboard, view grades, manage courses, and stay connected with the university community.
          </p>
          
          {/* Features */}
          <ul className="space-y-3 text-yellow-100">
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400">✓</span>
              </div>
              <span>View your academic records and grades</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400">✓</span>
              </div>
              <span>Register for courses online</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400">✓</span>
              </div>
              <span>Pay fees and view payment history</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-6 h-6 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <span className="text-yellow-400">✓</span>
              </div>
              <span>Access virtual learning resources</span>
            </li>
          </ul>
        </div>
        
        {/* Back to home */}
        <div className="relative z-10 mt-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-yellow-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to homepage</span>
          </Link>
        </div>
      </div>
      
      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-neutral-950">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout
