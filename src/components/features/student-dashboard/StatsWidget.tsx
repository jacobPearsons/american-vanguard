/**
 * Stats Widget Component
 * 
 * Displays unit statistics and fee information
 * Following component design rules from docs/component-design-rules.md
 */

import React from 'react'
import type { UnitStats, FeeInfo } from '@/types/studentDashboard'

interface StatsWidgetProps {
  unitStats: UnitStats
  feeInfo?: FeeInfo
}

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  progressValue: number
  progressColor: string
  icon: string
  iconBgColor: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  progressValue,
  progressColor,
  icon,
  iconBgColor,
}) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="mb-2">
      <span className="text-sm font-medium text-white">{title}</span>
      <span className="float-right text-sm text-white">{subtitle}</span>
    </div>
    <div className="h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
      <div
        className={`h-full ${progressColor} transition-all duration-500`}
        style={{ width: `${Math.min(progressValue, 100)}%` }}
      />
    </div>
    <div className={`absolute right-4 top-4 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center text-white`}>
      <span className="text-lg">{icon}</span>
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
    <div className="text-sm text-gray-500">{subtitle}</div>
  </div>
)

export const StatsWidget: React.FC<StatsWidgetProps> = ({ unitStats, feeInfo }) => {
  const compulsoryProgress = (unitStats.compulsoryUnit / unitStats.maximumUnit) * 100
  const registeredProgress = (unitStats.registeredUnit / unitStats.maximumUnit) * 100
  const unusedProgress = (unitStats.unusedUnit / unitStats.maximumUnit) * 100

  return (
    <div className="space-y-4">
      {/* Unit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <StatCard
            title="Maximum Unit"
            value={`${unitStats.maximumUnit} unit(s)`}
            subtitle="Compulsory"
            progressValue={100}
            progressColor="bg-green-500"
            icon="⭐"
            iconBgColor="bg-green-500"
          />
        </div>
        <div className="relative">
          <StatCard
            title="Registered Unit"
            value={`${unitStats.registeredUnit} unit(s)`}
            subtitle="Required"
            progressValue={registeredProgress}
            progressColor="bg-yellow-500"
            icon="📚"
            iconBgColor="bg-yellow-500"
          />
        </div>
        <div className="relative">
          <StatCard
            title="Un-used Unit"
            value={`${unitStats.unusedUnit} unit(s)`}
            subtitle="Elective"
            progressValue={unusedProgress}
            progressColor="bg-orange-500"
            icon="🚀"
            iconBgColor="bg-orange-500"
          />
        </div>
      </div>

      {/* Fee Info */}
      {feeInfo && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-semibold text-white bg-green-500 px-4 py-2 rounded inline-block">
                Total Bill
              </h4>
              <span className="ml-2 text-2xl font-bold text-gray-800">
                ₦{feeInfo.totalBill.toLocaleString()}
              </span>
            </div>
            <a
              href="#fees/fees_breakdown"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm"
            >
              📄 Fees Breakdown
            </a>
          </div>

          {/* Payment Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">Payment Progress</span>
              <span className="text-gray-500">
                ₦{feeInfo.totalPayment.toLocaleString()} / ₦{feeInfo.totalBill.toLocaleString()}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500"
                style={{ width: `${Math.min((feeInfo.totalPayment / feeInfo.totalBill) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Total Payment</p>
              <p className="text-xl font-bold text-yellow-600">
                ₦{feeInfo.totalPayment.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Active Session</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 font-medium">Total Outstanding</p>
              <p className="text-xl font-bold text-red-600">
                ₦{feeInfo.totalOutstanding.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Active Session</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default StatsWidget
