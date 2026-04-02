'use client'

import React, { useState } from 'react'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, CreditCard, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface Payment {
  id: number | string
  amount: number
  studentId: string
  description?: string | null
  reference: string
  status: string
  paymentType?: string | null
  paidAt?: Date | null
  createdAt: Date
}

interface UserData {
  name: string
  image: string | null
}

interface StudentFeesClientProps {
  payments: Payment[]
  userData: UserData
}

export function StudentFeesClient({ payments, userData }: StudentFeesClientProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const pendingPayments = payments.filter(p => p.status === 'pending')
  const completedPayments = payments.filter(p => p.status === 'completed')

  const totalBill = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = completedPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalOutstanding = totalBill - totalPaid
  const paymentPercentage = totalBill > 0 ? Math.round((totalPaid / totalBill) * 100) : 0

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount)
  }

  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const handlePayNow = async (payment: Payment) => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payment.amount,
          studentId: payment.studentId,
          description: payment.description,
          paymentType: payment.paymentType,
          email: '',
          phone: '',
        }),
      })

      const data = await response.json()
      if (data.authorizationUrl) {
        window.location.href = data.authorizationUrl
      } else {
        alert('Failed to initialize payment')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment initialization failed')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName={userData.name}
          studentImage={userData.image || '../uploads/default-avatar.png'}
          activeItem="fees"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">💰</span>
            Fees Payment
          </h1>
          <p className="text-gray-600">View and pay your school fees</p>
        </div>

        {payments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Fees Records</h3>
              <p className="text-gray-600">You don't have any fee records yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-80">Total Bill</p>
                        <p className="text-2xl font-bold">{formatCurrency(totalBill)}</p>
                      </div>
                      <DollarSign className="w-8 h-8 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total Paid</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalPaid)}</p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Outstanding</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(totalOutstanding)}</p>
                      </div>
                      <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Payment Progress</p>
                        <p className="text-2xl font-bold text-yellow-600">{paymentPercentage}%</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-yellow-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Payment Progress</CardTitle>
                  <div className="text-sm text-gray-500">
                    {totalPaid.toLocaleString()} / {totalBill.toLocaleString()} NGN
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${paymentPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{paymentPercentage}% paid</span>
                    <span>{100 - paymentPercentage}% remaining</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fees Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Reference</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Due Date</th>
                          <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">Status</th>
                          <th className="px-4 py-3 text-center text-sm font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment) => (
                          <tr key={payment.id} className="border-t">
                            <td className="px-4 py-3">
                              <p className="font-medium text-gray-800">{payment.description || payment.paymentType || 'Payment'}</p>
                            </td>
                            <td className="px-4 py-3 text-gray-600 text-sm font-mono">{payment.reference}</td>
                            <td className="px-4 py-3 text-gray-600">{formatDate(payment.createdAt)}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-800">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(payment.status)}`}>
                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              {payment.status === 'completed' ? (
                                <button className="text-green-600 hover:text-green-800 text-sm">
                                  View Receipt
                                </button>
                              ) : (
                                <button 
                                  onClick={() => handlePayNow(payment)}
                                  disabled={isProcessing}
                                  className="px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm disabled:opacity-50"
                                >
                                  {isProcessing ? 'Processing...' : 'Pay Now'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="px-4 py-3 font-medium text-gray-800">Total</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-800">{formatCurrency(totalBill)}</td>
                          <td colSpan={2}></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {completedPayments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No payment history yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {completedPayments.slice(0, 5).map((payment) => (
                        <div key={payment.id} className="flex items-center gap-3 p-2 bg-green-50 rounded">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{payment.description || 'Payment'}</p>
                            <p className="text-xs text-gray-500">{formatDate(payment.paidAt)}</p>
                          </div>
                          <span className="text-sm font-medium text-green-600">{formatCurrency(payment.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pending Payments</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingPayments.length === 0 ? (
                    <p className="text-gray-500 text-sm">No pending payments.</p>
                  ) : (
                    <div className="space-y-3">
                      {pendingPayments.map((payment) => (
                        <div key={payment.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                          <Clock className="w-5 h-5 text-yellow-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{payment.description || 'Payment'}</p>
                            <p className="text-xs text-gray-500">Due: {formatDate(payment.createdAt)}</p>
                          </div>
                          <span className="text-sm font-medium text-yellow-600">{formatCurrency(payment.amount)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {totalOutstanding > 0 && (
                <Card className="border-blue-200 bg-yellow-50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-800 text-sm">Payment Deadline</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Please complete your payments to avoid penalties.
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          Outstanding: {formatCurrency(totalOutstanding)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
