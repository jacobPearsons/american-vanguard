/**
 * Quick Stats Widget
 * 
 * Shows at-a-glance statistics: registered courses, GPA, payment status, attendance
 */

import React from 'react'
import { BookOpen, Award, DollarSign, CheckCircle } from 'lucide-react'

interface QuickStats {
  registeredCourses: number
  totalCourses: number
  gpa: number
  paymentStatus: 'paid' | 'partial' | 'unpaid'
  paymentPercentage: number
  attendance: number
}

interface QuickStatsWidgetProps {
  stats?: QuickStats
}

const defaultStats: QuickStats = {
  registeredCourses: 4,
  totalCourses: 6,
  gpa: 4.2,
  paymentStatus: 'partial',
  paymentPercentage: 64,
  attendance: 92,
}

const getPaymentStatusColor = (status: string): string => {
  switch (status) {
    case 'paid': return 'text-green-600'
    case 'partial': return 'text-orange-600'
    case 'unpaid': return 'text-red-600'
    default: return 'text-gray-600'
  }
}

const getPaymentStatusBg = (status: string): string => {
  switch (status) {
    case 'paid': return 'bg-green-100'
    case 'partial': return 'bg-orange-100'
    case 'unpaid': return 'bg-red-100'
    default: return 'bg-gray-100'
  }
}

const getPaymentStatusLabel = (status: string): string => {
  switch (status) {
    case 'paid': return 'Paid'
    case 'partial': return 'Partial'
    case 'unpaid': return 'Unpaid'
    default: return 'Unknown'
  }
}

export const QuickStatsWidget: React.FC<QuickStatsWidgetProps> = ({ stats = defaultStats }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Overview</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-yellow-50">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Courses</span>
          </div>
          <div className="text-2xl font-bold text-yellow-600">
            {stats.registeredCourses}/{stats.totalCourses}
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all"
              style={{ width: `${(stats.registeredCourses / stats.totalCourses) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-green-50">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">GPA</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {stats.gpa.toFixed(1)}
          </div>
          <p className="text-xs text-gray-500 mt-1">out of 5.0</p>
        </div>

        <div className={`p-4 rounded-lg ${getPaymentStatusBg(stats.paymentStatus)}`}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className={`w-5 h-5 ${getPaymentStatusColor(stats.paymentStatus)}`} />
            <span className="text-sm text-gray-600">Payment</span>
          </div>
          <div className={`text-2xl font-bold ${getPaymentStatusColor(stats.paymentStatus)}`}>
            {stats.paymentPercentage}%
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full ${stats.paymentStatus === 'paid' ? 'bg-green-500' : stats.paymentStatus === 'partial' ? 'bg-orange-500' : 'bg-red-500'}`}
              style={{ width: `${stats.paymentPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-purple-50">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Attendance</span>
          </div>
          <div className="text-2xl font-bold text-purple-600">
            {stats.attendance}%
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${stats.attendance}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuickStatsWidget