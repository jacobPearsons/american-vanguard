/**
 * StatsTiles Component
 * Displays payment statistics as colored tiles
 */

import { Download } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/services/paymentService'
import type { PaymentStats } from '@/types/studentPayments'

interface StatsTilesProps {
  stats: PaymentStats | null
  loading?: boolean
  session?: string
  semester?: string
}

interface StatTileProps {
  title: string
  value: number
  subtitle: string
  iconColor: string
  bgColor: string
}

function StatTile({ title, value, subtitle, iconColor, bgColor }: StatTileProps) {
  return (
    <div 
      className={`tile-stats tile-${bgColor} relative overflow-hidden`}
    >
      {/* Icon */}
      <div className="icon">
        <Download className="w-8 h-8" />
      </div>
      
      {/* Value */}
      <div className={`num f-s-20`}>
        <span>N</span>
        <span data-animation="number" data-value={value.toString()}>
          {formatNumber(value)}
        </span>
      </div>
      
      {/* Title */}
      <p><b>{title}</b></p>
      
      {/* Subtitle */}
      <p>{subtitle}</p>
    </div>
  )
}

export function StatsTiles({ stats, loading, session = '2025/2026', semester = 'First Semester' }: StatsTilesProps) {
  if (loading || !stats) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="tile-stats tile-aqua">
            <div className="icon">
              <Download className="w-8 h-8" />
            </div>
            <div className="num f-s-20">
              <span>N</span>
              <span data-animation="number" data-value="0">0</span>
            </div>
            <p><b>Student Wallet</b></p>
            <p>Active Session</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Student Wallet */}
      <StatTile 
        title="Student Wallet" 
        value={stats.walletBalance} 
        subtitle="Active Session" 
        iconColor="text-aqua-400" 
        bgColor="aqua"
      />
      
      {/* Total Bill */}
      <StatTile 
        title="Total Bill" 
        value={stats.totalBill} 
        subtitle="Active Session" 
        iconColor="text-yellow-400" 
        bgColor="blue"
      />
      
      {/* Total Payment */}
      <StatTile 
        title="Total Payment" 
        value={stats.totalPayment} 
        subtitle="Active Session" 
        iconColor="text-green-400" 
        bgColor="green"
      />
      
      {/* Outstanding */}
      <StatTile 
        title="Outstanding" 
        value={stats.outstanding} 
        subtitle="Active Session" 
        iconColor="text-red-400" 
        bgColor="red"
      />
    </div>
  )
}
