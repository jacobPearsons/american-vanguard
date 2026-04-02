/**
 * Student Info Card Component
 * 
 * Displays student profile information including matric number, faculty, department, etc.
 * Following component design rules from docs/component-design-rules.md
 */

import React from 'react'
import type { StudentInfo } from '@/types/studentDashboard'

interface StudentInfoCardProps {
  student: StudentInfo
  onLogout?: () => void
  onEditProfile?: () => void
  onChangePassword?: () => void
}

const statusColors = {
  Active: 'bg-green-500',
  Inactive: 'bg-gray-500',
  Suspended: 'bg-red-500',
}

export const StudentInfoCard: React.FC<StudentInfoCardProps> = ({
  student,
  onLogout,
  onEditProfile,
  onChangePassword,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        {onLogout && (
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            <span className="mr-1">⏻</span> Logout
          </button>
        )}
        {onChangePassword && (
          <button
            onClick={onChangePassword}
            className="px-3 py-1.5 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
          >
            🔒 Password
          </button>
        )}
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            👤 Edit Profile
          </button>
        )}
      </div>

      {/* Profile Image and Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {student.profileImage ? (
            <img
              src={student.profileImage}
              alt={`${student.firstName} ${student.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">
              👤
            </div>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500">{student.matricNumber}</p>
          <h3 className="text-lg font-semibold text-gray-800">
            {student.firstName} {student.lastName}
          </h3>
        </div>
      </div>

      {/* Student Details Table */}
      <table className="w-full text-sm border-collapse">
        <tbody>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">MATRIC NO.</td>
            <td className="py-2 text-gray-800">{student.matricNumber}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">REG. NO.</td>
            <td className="py-2 text-gray-800">{student.regNumber}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">FACULTY</td>
            <td className="py-2 text-gray-800">{student.faculty}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">DEPARTMENT</td>
            <td className="py-2 text-gray-800">{student.department}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">PROGRAMME</td>
            <td className="py-2 text-gray-800">{student.programme}</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">LEVEL</td>
            <td className="py-2 text-gray-800">{student.level} LEVEL</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">STATUS</td>
            <td className="py-2">
              <span className={`px-2 py-1 text-xs text-white rounded ${statusColors[student.status]}`}>
                {student.status}
              </span>
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">SESSION</td>
            <td className="py-2 text-gray-800">
              {student.session} | {student.semester}
            </td>
          </tr>
          <tr className="border-b">
            <td className="py-2 font-medium text-gray-600">ENTRY MODE</td>
            <td className="py-2 text-gray-800">{student.entryMode}</td>
          </tr>
          <tr>
            <td className="py-2 font-medium text-gray-600">ENTRY YEAR</td>
            <td className="py-2 text-gray-800">{student.entryYear}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StudentInfoCard
