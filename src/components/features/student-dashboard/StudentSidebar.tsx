/**
 * Student Dashboard Sidebar Component
 * 
 * Navigation sidebar for student dashboard
 * Following component design rules from docs/component-design-rules.md
 */

import React, { useState } from 'react'

interface NavItem {
  id: string
  label: string
  icon: string
  href?: string
  badge?: string
  children?: NavItem[]
}

interface StudentSidebarProps {
  items: NavItem[]
  logoSrc?: string
  studentName?: string
  studentImage?: string
  activeItem?: string
  onNavigate?: (item: NavItem) => void
}

export const StudentSidebar: React.FC<StudentSidebarProps> = ({
  items,
  logoSrc,
  studentName,
  studentImage,
  activeItem,
  onNavigate,
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleNavClick = (item: NavItem) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(item.id)
    }
    onNavigate?.(item)
  }

  return (
    <div
      className={`bg-red-600 text-white transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-red-500">
        {logoSrc && (
          <img
            src={logoSrc}
            alt="Logo"
            className={`${isCollapsed ? 'w-10 mx-auto' : 'w-48'}`}
          />
        )}
      </div>

      {/* Quick Links */}
      <div className="p-2 border-b border-red-500">
        <div className="flex justify-around">
          <button
            onClick={() => onNavigate?.({ id: 'power', label: 'Logout', icon: '⏻', href: '?logout=1' })}
            className="p-2 bg-red-700 rounded hover:bg-red-800 transition-colors"
            title="Logout"
          >
            ⏻
          </button>
          <button
            onClick={() => onNavigate?.({ id: 'password', label: 'Change Password', icon: '🔒', href: '#profile/change_password' })}
            className="p-2 bg-yellow-600 rounded hover:bg-yellow-700 transition-colors"
            title="Change Password"
          >
            🔒
          </button>
          <button
            onClick={() => onNavigate?.({ id: 'home', label: 'Home', icon: '🏠', href: '#pages/index' })}
            className="p-2 bg-green-600 rounded hover:bg-green-700 transition-colors"
            title="Home"
          >
            🏠
          </button>
        </div>
      </div>

      {/* Student Profile Section */}
      {studentName && !isCollapsed && (
        <div
          className="p-4 border-b border-red-500 cursor-pointer hover:bg-red-700 transition-colors"
          onClick={() => onNavigate?.({ id: 'profile', label: 'Profile', icon: '👤' })}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
              {studentImage ? (
                <img
                  src={studentImage}
                  alt={studentName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  👤
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-red-200">Welcome, Student</p>
              <p className="font-medium truncate">{studentName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="py-2">
        <ul className="space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavClick(item)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 transition-colors
                  ${activeItem === item.id ? 'bg-red-700' : 'hover:bg-red-700'}
                  ${isCollapsed ? 'justify-center' : ''}
                `}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left truncate">{item.label}</span>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs bg-white text-red-600 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {!isCollapsed && item.children && item.children.length > 0 && (
                  <span
                    className={`transform transition-transform ${
                      expandedItems.includes(item.id) ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                )}
              </button>

              {/* Sub-items */}
              {!isCollapsed && item.children && expandedItems.includes(item.id) && (
                <ul className="bg-red-700/50 py-1">
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <button
                        onClick={() => onNavigate?.(child)}
                        className={`
                          w-full flex items-center gap-3 px-8 py-2 text-sm transition-colors
                          hover:bg-red-800
                          ${activeItem === child.id ? 'bg-red-800' : ''}
                        `}
                      >
                        <span>{child.icon}</span>
                        <span className="flex-1 text-left">{child.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute bottom-4 right-4 w-8 h-8 bg-red-800 rounded-full flex items-center justify-center hover:bg-red-900 transition-colors"
      >
        {isCollapsed ? '▶' : '◀'}
      </button>
    </div>
  )
}

// Default navigation items based on the HTML snippet
export const defaultNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: '🏠',
    href: '/student/dashboard',
    badge: 'Home',
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: '👤',
    children: [
      { id: 'biodata', label: 'Biodata', icon: '📋', href: '/student/profile' },
      { id: 'passport', label: 'Upload Passport', icon: '📷', href: '/student/profile' },
      { id: 'signature', label: 'Signature', icon: '✍️', href: '/student/profile' },
    ],
  },
  {
    id: 'elearning',
    label: 'E-Learning',
    icon: '📚',
    children: [
      { id: 'syllabus', label: 'My Syllabus', icon: '📖', href: '/student/library' },
      { id: 'materials', label: 'Course Materials', icon: '📄', href: '/student/library' },
    ],
  },
  {
    id: 'course',
    label: 'Course Registration',
    icon: '📱',
    href: '/student/courses',
  },
  {
    id: 'results',
    label: 'Check Result',
    icon: '📋',
    href: '/student/grades',
  },
  {
    id: 'library',
    label: 'e-Library',
    icon: '📖',
    href: '/student/library',
  },
  {
    id: 'fees',
    label: 'Fees Payment',
    icon: '💰',
    href: '/student/fees',
  },
  {
    id: 'timetable',
    label: 'Lecture Timetable',
    icon: '📅',
    href: '/student/timetable',
  },
  {
    id: 'logout',
    label: 'Sign Out',
    icon: '⏻',
    href: '?logout=1',
  },
]

export default StudentSidebar
