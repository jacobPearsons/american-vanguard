'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  User,
  BookOpen,
  FileText,
  Library,
  CreditCard,
  Calendar,
  Settings,
  LogOut,
  GraduationCap,
  Bell,
  ChevronLeft,
  ChevronRight,
  Upload,
  PenTool,
  HelpCircle,
  MessageCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StudentLayoutProps {
  children: React.ReactNode
  studentName?: string
  studentImage?: string
}

interface NavItem {
  id: string
  label: string
  icon: React.ElementType
  href?: string
  badge?: string
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/student/dashboard', badge: 'Home' },
  {
    id: 'profile',
    label: 'Profile',
    icon: User,
    children: [
      { id: 'biodata', label: 'Biodata', icon: User, href: '/student/profile' },
      { id: 'passport', label: 'Upload Passport', icon: Upload, href: '/student/profile' },
      { id: 'signature', label: 'Signature', icon: PenTool, href: '/student/profile' },
    ],
  },
  {
    id: 'elearning',
    label: 'E-Learning',
    icon: BookOpen,
    children: [
      { id: 'syllabus', label: 'My Syllabus', icon: BookOpen, href: '/student/library' },
      { id: 'materials', label: 'Course Materials', icon: FileText, href: '/student/library' },
    ],
  },
  { id: 'course', label: 'Course Registration', icon: GraduationCap, href: '/student/courses' },
  { id: 'results', label: 'Check Result', icon: FileText, href: '/student/grades' },
  { id: 'library', label: 'e-Library', icon: Library, href: '/student/library' },
  { id: 'fees', label: 'Fees Payment', icon: CreditCard, href: '/student/fees' },
  { id: 'timetable', label: 'Lecture Timetable', icon: Calendar, href: '/student/timetable' },
  { id: 'exams', label: 'Exams', icon: Calendar, href: '/student/exams' },
  { id: 'notifications', label: 'Notifications', icon: Bell, href: '/student/notifications' },
  { id: 'messages', label: 'Messages', icon: MessageCircle, href: '/student/messages' },
  { id: 'elearning-page', label: 'E-Learning Portal', icon: BookOpen, href: '/student/elearning' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
  { id: 'help', label: 'Help & Support', icon: HelpCircle, href: '/contact' },
]

export function StudentLayout({ children, studentName = 'Student', studentImage }: StudentLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const pathname = usePathname()

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (item: NavItem) => {
    if (item.href && pathname === item.href) return true
    if (item.children) {
      return item.children.some((child) => pathname === child.href)
    }
    return false
  }

  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-neutral-900 border-r border-neutral-800 transition-all duration-300 z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-neutral-800">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-yellow-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">AVI</span>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-lg bg-yellow-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-neutral-800">
          <div className={`flex ${isCollapsed ? 'flex-col gap-2' : 'justify-around'}`}>
            <Link
              href="/sign-out"
              className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </Link>
            <Link
              href="/settings"
              className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              href="/student/dashboard"
              className="p-2 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
              title="Home"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Student Profile */}
        {!isCollapsed && (
          <div className="p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-600/20 flex items-center justify-center overflow-hidden">
                {studentImage ? (
                  <img src={studentImage} alt={studentName} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-yellow-600" />
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-neutral-500">Welcome</p>
                <p className="text-sm font-medium text-white truncate">{studentName}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="py-2 overflow-y-auto h-[calc(100vh-280px)]">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                {item.href && !item.children ? (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item)
                        ? 'bg-yellow-600 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-yellow-500 text-neutral-900 rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item)
                          ? 'bg-yellow-600 text-white'
                          : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                      } ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-left truncate">{item.label}</span>
                          <ChevronRight
                            className={`w-4 h-4 transition-transform ${
                              expandedItems.includes(item.id) ? 'rotate-90' : ''
                            }`}
                          />
                        </>
                      )}
                    </button>

                    {/* Sub-items */}
                    {!isCollapsed && item.children && expandedItems.includes(item.id) && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={child.href || '#'}
                              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                pathname === child.href
                                  ? 'bg-neutral-700 text-yellow-500'
                                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                              }`}
                            >
                              <child.icon className="w-4 h-4" />
                              <span className="text-sm truncate">{child.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse Toggle */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute bottom-4 right-4 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center hover:bg-neutral-700 transition-colors text-neutral-400 hover:text-white"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
        {children}
      </main>
    </div>
  )
}

export default StudentLayout
