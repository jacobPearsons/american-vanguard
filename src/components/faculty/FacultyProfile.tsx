'use client'

import React from 'react'
import Image from 'next/image'

interface FacultyProfileProps {
  faculty: {
    id: number
    firstName: string
    lastName: string
    title: string
    photoUrl?: string | null
    bio?: string | null
    email?: string | null
    phone?: string | null
    office?: string | null
    officeHours?: string | null
    department: { name: string; school: string }
    publications: Array<{ id: number; title: string; journal?: string; year: number; url?: string }>
    courses: Array<{ id: number; code: string; name: string; credits: number }>
  }
  onClose?: () => void
}

export const FacultyProfile: React.FC<FacultyProfileProps> = ({ faculty, onClose }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl">
      <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg">
        {onClose && (
          <button onClick={onClose} className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2">
            ✕
          </button>
        )}
      </div>
      
      <div className="px-6 pb-6">
        <div className="relative -mt-16 mb-4">
          <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
            {faculty.photoUrl ? (
              <Image src={faculty.photoUrl} alt={faculty.firstName} width={128} height={128} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                {faculty.firstName[0]}{faculty.lastName[0]}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h1 className="text-2xl font-bold">{faculty.firstName} {faculty.lastName}</h1>
          <p className="text-lg text-gray-600">{faculty.title}</p>
          <p className="text-gray-500">{faculty.department.name} • {faculty.department.school}</p>
        </div>

        {faculty.bio && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Biography</h2>
            <p className="text-gray-700">{faculty.bio}</p>
          </div>
        )}

        <div className="mb-6 grid grid-cols-2 gap-4">
          {faculty.email && (
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900">{faculty.email}</p>
            </div>
          )}
          {faculty.phone && (
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-gray-900">{faculty.phone}</p>
            </div>
          )}
          {faculty.office && (
            <div>
              <p className="text-sm text-gray-500">Office</p>
              <p className="text-gray-900">{faculty.office}</p>
            </div>
          )}
          {faculty.officeHours && (
            <div>
              <p className="text-sm text-gray-500">Office Hours</p>
              <p className="text-gray-900">{faculty.officeHours}</p>
            </div>
          )}
        </div>

        {faculty.publications && faculty.publications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Publications</h2>
            <ul className="space-y-2">
              {faculty.publications.map((pub) => (
                <li key={pub.id} className="text-gray-700">
                  <span className="font-medium">{pub.title}</span>
                  {pub.journal && <span className="text-gray-500"> - {pub.journal}</span>}
                  <span className="text-gray-400"> ({pub.year})</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {faculty.courses && faculty.courses.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Courses Taught</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {faculty.courses.map((course) => (
                <div key={course.id} className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-medium">{course.code}</p>
                  <p className="text-sm text-gray-600">{course.name}</p>
                  <p className="text-xs text-gray-400">{course.credits} credits</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
