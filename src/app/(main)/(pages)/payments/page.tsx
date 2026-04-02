'use client'

/**
 * Student Payments Page
 * Displays student fees payment dashboard
 * Based on the university portal layout from docs
 */

import { useStudentPayments } from '@/hooks/useStudentPayments'
import { PaymentSidebar } from '@/components/payments/sidebar'
import { StudentInfo } from '@/components/payments/student-info'
import { StatsTiles } from '@/components/payments/stats-tiles'
import { PaymentTable } from '@/components/payments/payment-table'
import { Home as HomeIcon, DollarSign, PowerOff, Lock, User } from 'lucide-react'
import Link from 'next/link'

export default function PaymentsPage() {
  const {
    studentInfo,
    activeSessionFees,
    otherSessionFees,
    transactions,
    stats,
    loading,
    error,
    activeTab,
    setActiveTab,
    handlePayment,
    searchActiveFees,
    searchOtherFees,
    setPerPage,
  } = useStudentPayments()

  const sessionLabel = 'FEES IN 2025/2026 FIRST SEMESTER'
  const otherSessionLabel = 'FEES IN OTHER SESSION AND SEMESTER'

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <PaymentSidebar
        studentName={studentInfo?.fullName}
        studentImage={studentInfo?.profileImage}
      />

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <Link href="/dashboard" className="flex items-center gap-1 hover:text-yellow-600">
            <HomeIcon className="w-4 h-4" />
            Home
          </Link>
          <span>/</span>
          <Link href="/dashboard" className="hover:text-yellow-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-800 font-medium">Fees Payment</span>
        </nav>

        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-black" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Fees Payment</h1>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Main Grid */}
        <div className="flex gap-6">
          {/* Left Column - Student Info & Stats */}
          <div className="w-1/4 space-y-4">
            {/* About Author Section */}
            <div className="about-author">
              <div className="quote bg-white p-4">
                <div className="flex justify-end items-center">
                  <Link
                    href="?logout=1"
                    className="btn btn-info btn-danger pull-right m-r-2 tooltip_"
                  >
                    <span className="tooltiptext">Logout</span>
                    <PowerOff className="w-4 h-4" />
                  </Link>
                  <Link
                    href="javascript:;"
                    className="btn btn-info btn-info pull-right m-r-2"
                  >
                    <Lock className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#profile/edit_biodata"
                    className="btn btn-info btn-green pull-right m-r-2 tooltip_"
                  >
                    <span className="tooltiptext">Profile</span>
                    <User className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </div>
                <div className="clearfix"></div>
              </div>
              <StudentInfo student={studentInfo} loading={loading} />
              
              {/* Stats Tiles */}
              <StatsTiles 
                stats={stats} 
                loading={loading}
                session={studentInfo?.session}
                semester={studentInfo?.semester}
              />
            </div>
          </div>

          {/* Right Column - Payment Tables */}
          <div className="w-3/4">
            <PaymentTable
              activeSessionFees={activeSessionFees}
              otherSessionFees={otherSessionFees}
              transactions={transactions}
              onPayNow={handlePayment}
              onSearchActive={searchActiveFees}
              onSearchOther={searchOtherFees}
              sessionLabel={sessionLabel}
              otherSessionLabel={otherSessionLabel}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
