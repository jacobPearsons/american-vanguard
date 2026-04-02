/**
 * Quick Links Widget
 * 
 * Provides quick navigation to frequently used pages
 */

import React from 'react'
import Link from 'next/link'
import { BookOpen, FileText, DollarSign, User, Calendar, ClipboardList } from 'lucide-react'

interface QuickLink {
  id: string
  label: string
  icon: React.ReactNode
  href: string
  color: string
}

const quickLinks: QuickLink[] = [
  { id: 'registration', label: 'Course Registration', icon: <ClipboardList className="w-5 h-5" />, href: '/student/courses', color: 'bg-yellow-500' },
  { id: 'grades', label: 'Grades', icon: <FileText className="w-5 h-5" />, href: '/student/results', color: 'bg-green-500' },
  { id: 'fees', label: 'Fees Payment', icon: <DollarSign className="w-5 h-5" />, href: '/student/fees', color: 'bg-red-500' },
  { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" />, href: '/student/profile', color: 'bg-purple-500' },
  { id: 'timetable', label: 'Timetable', icon: <Calendar className="w-5 h-5" />, href: '/student/timetable', color: 'bg-orange-500' },
  { id: 'library', label: 'e-Library', icon: <BookOpen className="w-5 h-5" />, href: '/student/library', color: 'bg-cyan-500' },
]

export const QuickLinksWidget: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Links</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className={`w-10 h-10 rounded-full ${link.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
              {link.icon}
            </div>
            <span className="text-xs text-center text-gray-600 group-hover:text-gray-800">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuickLinksWidget