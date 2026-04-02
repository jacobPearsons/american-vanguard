'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Sparkles, Building, Briefcase } from 'lucide-react'

type Props = {
  searchParams?: { [key: string]: string | undefined }
}

interface Plan {
  id: string
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
  credits: string
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    credits: '10',
    features: [
      '10 job applications',
      'Basic profile',
      'Resume upload',
      'English proficiency test',
      'Email support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$29',
    description: 'For serious job seekers',
    credits: '100',
    popular: true,
    features: [
      '100 job applications',
      'Premium profile badge',
      'Resume optimization',
      'Priority support',
      'Application tracking',
      'Interview scheduling',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$99',
    description: 'Maximum job search power',
    credits: 'Unlimited',
    features: [
      'Unlimited applications',
      'Featured profile',
      'Direct employer contacts',
      '24/7 support',
      'Resume review by experts',
      'Mock interviews',
      'Career coaching',
    ],
  },
]

const Billing = ({ searchParams }: Props) => {
  const [currentPlan, setCurrentPlan] = useState('free')
  const [loading, setLoading] = useState(false)

  // Mock function to simulate fetching current plan
  useEffect(() => {
    // In production, this would fetch from the database
    const fetchCurrentPlan = async () => {
      try {
        // Simulated API call
        setCurrentPlan('free')
      } catch (error) {
        console.error('Error fetching plan:', error)
      }
    }
    fetchCurrentPlan()
  }, [])

  const handleUpgrade = async (planId: string) => {
    setLoading(true)
    try {
      // In production, this would call Stripe checkout
      console.log('Upgrading to plan:', planId)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrentPlan(planId)
    } catch (error) {
      console.error('Error upgrading:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-neutral-950 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Subscription Plans</h1>
          <p className="text-neutral-400">Choose the plan that fits your job search needs</p>
        </div>
        <Badge variant="outline" className="border-emerald-500 text-emerald-400">
          Current: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
        </Badge>
      </div>

      {/* Current Usage */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Your Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-neutral-800/50">
              <p className="text-neutral-400 text-sm">Applications Used</p>
              <p className="text-2xl font-bold text-white">3 / {currentPlan === 'premium' ? '∞' : currentPlan === 'pro' ? '100' : '10'}</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-800/50">
              <p className="text-neutral-400 text-sm">Profile Views</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-800/50">
              <p className="text-neutral-400 text-sm">Interview Requests</p>
              <p className="text-2xl font-bold text-white">4</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative bg-neutral-900 border-neutral-800 ${
              plan.popular ? 'border-emerald-500' : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-emerald-500 text-white">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
              <div className="text-4xl font-bold text-white mt-2">
                {plan.price}
                <span className="text-lg font-normal text-neutral-400">/month</span>
              </div>
              <CardDescription className="text-neutral-400">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full ${
                  currentPlan === plan.id
                    ? 'bg-neutral-700 cursor-default'
                    : plan.popular
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-neutral-800 hover:bg-neutral-700'
                }`}
                disabled={currentPlan === plan.id || loading}
                onClick={() => handleUpgrade(plan.id)}
              >
                {currentPlan === plan.id 
                  ? 'Current Plan' 
                  : loading 
                  ? 'Processing...' 
                  : 'Upgrade'
                }
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <Card className="bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-white">What counts as an application?</h4>
            <p className="text-neutral-400 text-sm mt-1">
              Each job you apply to counts as one application. You can track your remaining applications in your dashboard.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">Can I cancel anytime?</h4>
            <p className="text-neutral-400 text-sm mt-1">
              Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
            </p>
          </div>
          <div>
            <h4 className="font-medium text-white">What payment methods do you accept?</h4>
            <p className="text-neutral-400 text-sm mt-1">
              We accept all major credit cards, debit cards, and PayPal through our secure payment partner Stripe.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Billing
