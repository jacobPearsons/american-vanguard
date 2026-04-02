/**
 * Verification Page
 * Purpose: Enter verification code to access interviews
 * 
 * Architecture (per docs):
 * - UI: Only handles display and user input
 * - Hook: Manages all state logic
 * - Service: Handles data access
 * 
 * Flow: Complete Skills Test → Get Code → Enter Code → Access Interviews
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Lock,
  Unlock,
  AlertCircle,
  Copy,
  ArrowRight,
  Timer
} from 'lucide-react'
import Link from 'next/link'
import { useVerification } from '@/hooks/useVerification'
import { motion } from 'framer-motion'
import { fadeInUp } from '@/animations'

/**
 * Format remaining time
 */
const formatRemainingTime = (expiresAt: Date | null) => {
  if (!expiresAt) return ''
  
  const now = new Date()
  const diff = new Date(expiresAt).getTime() - now.getTime()
  
  if (diff <= 0) return 'Expired'
  
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`
  }
  return `${minutes}m remaining`
}

/**
 * Verification Page Component
 */
export default function VerificationPage() {
  const {
    currentCode,
    loading,
    error,
    isValid,
    generateCode,
    validateCode,
    loadSummary,
    clearError
  } = useVerification()

  const [codeInput, setCodeInput] = useState('')
  const [verified, setVerified] = useState(false)
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)

  // Generate a demo code for testing
  const handleGenerateCode = async () => {
    const code = await generateCode('user-123', 'demo@example.com', 'interview_access')
    if (code) {
      setGeneratedCode(code.code)
    }
  }

  const handleValidate = async () => {
    clearError()
    const valid = await validateCode(codeInput, 'interview_access')
    if (valid) {
      setVerified(true)
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="min-h-screen bg-neutral-950 p-6">
      <div className="container max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/20 rounded-full mb-4">
            <Shield className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Access</h1>
          <p className="text-neutral-400">
            Enter your verification code to access technical and behavioral interviews
          </p>
        </div>

        {/* Demo: Generate Code Button */}
        <Card className="bg-neutral-900 border-neutral-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white text-lg">Get Your Code</CardTitle>
            <CardDescription className="text-neutral-400">
              Complete the skills test to receive your unique verification code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGenerateCode}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
            >
              Generate Demo Code
            </Button>
            
            {generatedCode && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-neutral-800 rounded-lg"
              >
                <p className="text-sm text-neutral-400 mb-2">Your verification code:</p>
                <div className="flex items-center gap-2">
                  <code className="text-2xl font-mono text-emerald-400 font-bold tracking-wider">
                    {generatedCode}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleCopyCode(generatedCode)}
                  >
                    <Copy className="w-4 h-4 text-neutral-400" />
                  </Button>
                </div>
                <p className="text-xs text-neutral-500 mt-2">
                  <Timer className="w-3 h-3 inline mr-1" />
                  Code expires in 72 hours
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-neutral-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* Code Entry */}
        <Card className="bg-neutral-900 border-neutral-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Enter Verification Code
            </CardTitle>
            <CardDescription className="text-neutral-400">
              Enter the code you received after completing the skills test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Success State */}
            {verified && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/20 text-green-400 p-4 rounded-lg flex items-center gap-3"
              >
                <CheckCircle className="w-6 h-6" />
                <div>
                  <p className="font-medium">Access Granted!</p>
                  <p className="text-sm text-green-300">Redirecting to interviews...</p>
                </div>
              </motion.div>
            )}

            {/* Input */}
            {!verified && (
              <>
                <div>
                  <label className="text-sm text-neutral-400 mb-2 block">
                    Verification Code
                  </label>
                  <Input
                    placeholder="SKXXXXXXXX"
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                    className="bg-neutral-800 border-neutral-700 text-white text-center text-xl font-mono tracking-widest"
                    maxLength={10}
                  />
                </div>

                <Button
                  onClick={handleValidate}
                  disabled={codeInput.length < 6 || loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </>
            )}

            {/* Success Actions */}
            {verified && (
              <div className="space-y-3">
                <Link href="/interviews">
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Unlock className="w-4 h-4 mr-2" />
                    Go to Interviews
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full border-neutral-700 text-neutral-400">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-neutral-500 text-sm mt-6">
          Don't have a code?{' '}
          <Link href="/profile" className="text-emerald-400 hover:underline">
            Complete the skills test
          </Link>
        </p>
      </div>
    </div>
  )
}
