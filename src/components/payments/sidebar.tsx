'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  User, 
  FileText, 
  BookOpen, 
  Award, 
  Laptop, 
  Library, 
  CreditCard, 
  CheckCircle, 
  GraduationCap, 
  Building, 
  Lock,
  PowerOff,
  ChevronDown,
  Settings,
  HelpCircle,
  MessageSquare,
  Thermometer,
  Smartphone,
  File,
  DollarSign,
  Gift,
  BadgeCheck,
  LogIn,
  LayoutGrid,
  AlignJustify,
  Bell,
  Flag,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
  badge?: string
  children?: NavItem[]
  active?: boolean
}

interface PaymentSidebarProps {
  studentName?: string
  studentImage?: string
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '#dashboard',
    icon: <Home className="w-4 h-4" />,
  },
  {
    label: 'Profile',
    href: '#profile/hc_dashboard',
    icon: <Thermometer className="w-4 h-4" />,
    badge: 'Form'
  },
  {
    label: 'Accommodation',
    href: '#',
    icon: <Gift className="w-4 h-4" />,
    children: [
      {
        label: 'Hostel Application',
        href: '#hostel/apply',
        icon: <Home className="w-4 h-4" />,
      },
    ]
  },
  {
    label: 'Course Registration',
    href: '#course/course_reg',
    icon: <Smartphone className="w-4 h-4" />
  },
  {
    label: 'Course Materials',
    href: '#',
    icon: <File className="w-4 h-4" />,
    children: [
      {
        label: 'View Materials',
        href: '#course/materials',
        icon: <BookOpen className="w-4 h-4" />,
      },
    ]
  },
  {
    label: 'Late Registration',
    href: '#course/late_reg',
    icon: <BadgeCheck className="w-4 h-4" />,
    badge: 'Action'
  },
  {
    label: 'Fees Payment',
    href: '#fees/fees_payment',
    icon: <DollarSign className="w-4 h-4" />,
    active: true
  },
  {
    label: 'Hostel',
    href: '#hostel/dashboard',
    icon: <LogIn className="w-4 h-4" />,
    badge: 'Accommodation'
  },
  {
    label: 'Result',
    href: '#student/exam_results',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    label: 'Graduation',
    href: '#graduation/clearance',
    icon: <GraduationCap className="w-4 h-4" />,
  },
  {
    label: 'Settings',
    href: '#settings',
    icon: <Settings className="w-4 h-4" />,
  },
  {
    label: 'Help',
    href: '#help',
    icon: <HelpCircle className="w-4 h-4" />,
  },
]

export function PaymentSidebar({ studentName, studentImage }: PaymentSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 min-h-screen p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
          <span className="text-neutral-900 font-bold text-lg">V</span>
        </div>
        <div>
          <h1 className="text-white font-bold text-sm">AVI</h1>
          <p className="text-neutral-500 text-xs">Student Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {navItems.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                item.active 
                  ? "bg-yellow-500/10 text-yellow-500" 
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs bg-neutral-800 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
              {item.children && (
                <ChevronDown className="w-4 h-4" />
              )}
            </Link>
            
            {/* Children */}
            {item.children && expandedItems.includes(item.label) && (
              <div className="ml-6 mt-1 space-y-1">
                {item.children.map((child) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  >
                    {child.icon}
                    <span>{child.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default PaymentSidebar
