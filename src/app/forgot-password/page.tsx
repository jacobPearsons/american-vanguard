'use client'

import Link from 'next/link'
import { SignIn } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link 
            href="/sign-in"
            className="inline-flex items-center text-neutral-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
          <p className="text-neutral-400">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
          <SignIn 
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'bg-transparent shadow-none border-0',
                headerTitle: 'text-white',
                headerSubtitle: 'text-neutral-400',
                socialButtonsBlockButton: 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white',
                socialButtonsBlockButtonText: 'text-white',
                formFieldLabel: 'text-neutral-300',
                formFieldInput: 'bg-neutral-800 border-neutral-700 text-white',
                formFieldInputShowPasswordButton: 'text-neutral-400',
                formFieldInputShowPasswordButtonHover: 'text-white',
                dividerLine: 'bg-neutral-700',
                dividerText: 'text-neutral-500',
                formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
                footerActionLink: 'text-emerald-400 hover:text-emerald-300',
                identityPreviewText: 'text-neutral-300',
                identityPreviewEditButton: 'text-emerald-400',
                formFieldInputPlaceholder: 'text-neutral-500',
                formFieldError: 'text-red-400',
                footer: 'hidden',
              },
            }}
          />
        </div>

        <p className="text-center text-sm text-neutral-500 mt-6">
          Remember your password?{' '}
          <Link href="/sign-in" className="text-emerald-400 hover:text-emerald-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
