/**
 * PaymentTable Component
 * Displays fees payment data with tabs and tables
 */

import { useState } from 'react'
import Link from 'next/link'
import { Search, DollarSign, History } from 'lucide-react'
import { formatCurrency, formatNumber } from '@/services/paymentService'
import type { PaymentRecord, TransactionRecord } from '@/types/studentPayments'

interface PaymentTableProps {
  activeSessionFees: PaymentRecord[]
  otherSessionFees: PaymentRecord[]
  transactions: TransactionRecord[]
  onPayNow: (feeId: string) => void
  onSearchActive: (query: string) => void
  onSearchOther: (query: string, page?: number) => void
  sessionLabel?: string
  otherSessionLabel?: string
}

interface PaymentTabsProps {
  activeTab: 'payment' | 'transactions'
  onTabChange: (tab: 'payment' | 'transactions') => void
}

function PaymentTabs({ activeTab, onTabChange }: PaymentTabsProps) {
  return (
    <div className="panel-heading p-0 border-b">
      <div className="flex overflow-x-auto">
        <button
          onClick={() => onTabChange('payment')}
          className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'payment'
              ? 'text-yellow-600 border-b-2 border-blue-600 bg-yellow-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Payment
        </button>
        <button
          onClick={() => onTabChange('transactions')}
          className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'text-yellow-600 border-b-2 border-blue-600 bg-yellow-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <History className="w-4 h-4 inline mr-2" />
          Transaction History
        </button>
      </div>
    </div>
  )
}

interface FeesTableProps {
  fees: PaymentRecord[]
  title: string
  onPayNow: (feeId: string) => void
  showPagination?: boolean
  currentPage?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  perPage: number
  onPerPageChange: (perPage: number) => void
  onSearch: (query: string) => void
}

function FeesTable({
  fees,
  title,
  onPayNow,
  showPagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  perPage,
  onPerPageChange,
  onSearch,
}: FeesTableProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Per Page */}
        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Show</label>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </form>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for..."
            className="border border-gray-300 rounded-l px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
          />
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 px-4 py-1.5 rounded-r text-sm font-medium transition-colors"
          >
            Go!
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 w-10">S/N</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">FEES NAME</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">FEES DESCRIPTION</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">SESSION</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">LEVEL</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">DUE DATE</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">TOTAL AMOUNT</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">TOTAL PAID</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">OUTSTANDING</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-700">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {fees.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-3 py-8 text-center text-gray-500">
                  No fees records found
                </td>
              </tr>
            ) : (
              fees.map((fee, index) => (
                <tr key={fee.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-800">{index + 1}</td>
                  <td className="px-3 py-2 text-gray-800">{fee.feesName}</td>
                  <td className="px-3 py-2 text-gray-800">{fee.feesDescription}</td>
                  <td className="px-3 py-2 text-gray-800">{fee.session}</td>
                  <td className="px-3 py-2 text-gray-800">{fee.level || '-'}</td>
                  <td className="px-3 py-2 text-gray-800">{fee.dueDate || '-'}</td>
                  <td className="px-3 py-2 text-right text-gray-800">{formatNumber(fee.totalAmount)}</td>
                  <td className="px-3 py-2 text-right text-gray-800">{formatNumber(fee.totalPaid)}</td>
                  <td className="px-3 py-2 text-right text-gray-800">{formatNumber(fee.outstanding)}</td>
                  <td className="px-3 py-2 text-center">
                    {fee.canPay && fee.outstanding > 0 ? (
                      <button
                        onClick={() => onPayNow(fee.id)}
                        className="px-3 py-1 text-xs bg-yellow-500 hover:bg-yellow-600 text-white rounded transition-colors"
                      >
                        Pay Now
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * perPage) + 1} to {Math.min(currentPage * perPage, fees.length)} of {fees.length}
          </div>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => onPageChange?.(page)}
                className={`px-3 py-1 text-sm border rounded ${
                  page === currentPage
                    ? 'bg-yellow-500 text-white border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

interface TransactionsTableProps {
  transactions: TransactionRecord[]
}

function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Transaction History</h3>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-semibold text-gray-700 w-10">S/N</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">DATE</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">DESCRIPTION</th>
              <th className="px-3 py-2 text-right font-semibold text-gray-700">AMOUNT</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">TYPE</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">REFERENCE</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-700">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((txn, index) => (
                <tr key={txn.id} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-2 text-gray-800">{index + 1}</td>
                  <td className="px-3 py-2 text-gray-800">{txn.date}</td>
                  <td className="px-3 py-2 text-gray-800">{txn.description}</td>
                  <td className="px-3 py-2 text-right text-gray-800">{formatCurrency(txn.amount)}</td>
                  <td className="px-3 py-2 text-gray-800">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      txn.type === 'Credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-gray-800 font-mono text-xs">{txn.reference}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      txn.status === 'Success' ? 'bg-green-100 text-green-800' :
                      txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function PaymentTable({
  activeSessionFees,
  otherSessionFees,
  transactions,
  onPayNow,
  onSearchActive,
  onSearchOther,
  sessionLabel = 'FEES IN 2025/2026 FIRST SEMESTER',
  otherSessionLabel = 'FEES IN OTHER SESSION AND SEMESTER',
}: PaymentTableProps) {
  const [activeTab, setActiveTab] = useState<'payment' | 'transactions'>('payment')
  const [activeSubTab, setActiveSubTab] = useState<'active' | 'other'>('active')
  const [perPage, setPerPage] = useState(10)

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <PaymentTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="p-4">
        {activeTab === 'payment' ? (
          <>
            {/* Sub-tabs for Active vs Other Sessions */}
            <div className="flex border-b mb-4">
              <button
                onClick={() => setActiveSubTab('active')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeSubTab === 'active'
                    ? 'border-blue-500 text-yellow-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Active Session
              </button>
              <button
                onClick={() => setActiveSubTab('other')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeSubTab === 'other'
                    ? 'border-blue-500 text-yellow-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Other Sessions
              </button>
            </div>

            {activeSubTab === 'active' ? (
              <FeesTable
                fees={activeSessionFees}
                title={sessionLabel}
                onPayNow={onPayNow}
                perPage={perPage}
                onPerPageChange={setPerPage}
                onSearch={onSearchActive}
              />
            ) : (
              <FeesTable
                fees={otherSessionFees}
                title={otherSessionLabel}
                onPayNow={onPayNow}
                showPagination
                currentPage={1}
                totalPages={3}
                perPage={perPage}
                onPerPageChange={setPerPage}
                onSearch={(q) => onSearchOther(q, 1)}
              />
            )}
          </>
        ) : (
          <TransactionsTable transactions={transactions} />
        )}
      </div>
    </div>
  )
}
