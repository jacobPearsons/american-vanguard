'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, Mail, Lock, User, GraduationCap, AlertCircle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'

export function SignUpForm() {
  const { register, loading, error, clearError } = useAuth()
  const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    matricNumber: '',
    role: 'student',
  })
  const [validationError, setValidationError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    setValidationError('')

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match')
      return
    }

    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters')
      return
    }

    const result = await register(
      formData.email,
      formData.password,
      formData.firstName,
      formData.lastName
    )
    
    if (result.success) {
      toast.success('Account created! Please complete your application.')
      router.push('/apply')
    } else if (result.error) {
      setValidationError(result.error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleGoogleSignUp = async () => {
    if (!signUp || !isSignUpLoaded) return
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/apply',
      })
    } catch (err) {
      console.error('Google sign-up error:', err)
      toast.error('Failed to sign up with Google')
    }
  }

  const handleDiscordSignUp = async () => {
    if (!signUp || !isSignUpLoaded) return
    
    try {
      await signUp.authenticateWithRedirect({
        strategy: 'oauth_discord',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/apply',
      })
    } catch (err) {
      console.error('Discord sign-up error:', err)
      toast.error('Failed to sign up with Discord')
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Mobile Logo */}
      <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
        <Image 
          src="/logo.png" 
          alt="AVI Logo" 
          width={40} 
          height={40}
          className="w-10 h-10 rounded-lg object-contain bg-white/10"
        />
        <Image 
          src="/title.png" 
          alt="American Vanguard Institute" 
          width={160}
          height={32}
          className="h-8 w-auto object-contain"
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-500/10 rounded-full mb-4">
          <GraduationCap className="w-8 h-8 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-neutral-400 text-sm">
          Join the AVI student community
        </p>
      </div>

      {/* Error Message */}
      {(error || validationError) && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-400 text-sm">{validationError || error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-neutral-300 mb-2">
              First Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-neutral-500 group-focus-within:text-yellow-500 transition-colors" />
              </div>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full pl-12 pr-4 py-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                placeholder="John"
              />
            </div>
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-neutral-300 mb-2">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="block w-full px-4 py-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-neutral-500 group-focus-within:text-yellow-500 transition-colors" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full pl-12 pr-4 py-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
              placeholder="student@avi.edu"
            />
          </div>
        </div>

        {/* Password Row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-500 group-focus-within:text-yellow-500 transition-colors" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-12 pr-12 py-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                placeholder="Min. 8 characters"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-300 mb-2">
              Confirm Password
            </label>
            <div className="relative group">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-4 py-3.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                placeholder="Confirm password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-2">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 w-4 h-4 bg-neutral-900 border-neutral-700 rounded text-yellow-500 focus:ring-yellow-500 focus:ring-offset-neutral-900"
          />
          <label htmlFor="terms" className="text-sm text-neutral-400">
            I agree to the{' '}
            <Link href="/terms" className="text-yellow-400 hover:text-yellow-300 transition-colors underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 transition-colors underline">
              Privacy Policy
            </Link>
          </label>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-yellow-500/10 text-sm font-semibold text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="flex items-center gap-2"
            >
              <Loader2 className="h-5 w-5" />
              <span>Creating account...</span>
            </motion.div>
          ) : (
            'Create Account'
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-4 bg-neutral-950 text-neutral-500 uppercase tracking-wider">Or sign up with</span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <motion.button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={loading || !isSignUpLoaded}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-center items-center py-3 px-4 border border-neutral-800 rounded-xl bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <svg className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="text-sm font-medium">Google</span>
        </motion.button>
        <motion.button
          type="button"
          onClick={handleDiscordSignUp}
          disabled={loading || !isSignUpLoaded}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-center items-center py-3 px-4 border border-neutral-800 rounded-xl bg-neutral-900/50 text-neutral-300 hover:bg-neutral-800 hover:text-white hover:border-neutral-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <svg className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
          </svg>
          <span className="text-sm font-medium">Discord</span>
        </motion.button>
      </div>

      {/* Sign In Link */}
      <p className="mt-8 text-center text-sm text-neutral-400">
        Already have an account?{' '}
        <Link
          href="/sign-in"
          className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
