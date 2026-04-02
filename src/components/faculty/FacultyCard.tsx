import React from 'react'

interface FacultyCardProps {
  faculty: {
    id: number
    firstName: string
    lastName: string
    title: string
    photoUrl?: string | null
    researchArea?: string | null
    department: { name: string; school: string }
  }
}

export const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gray-200 relative">
        {faculty.photoUrl ? (
          <img
            src={faculty.photoUrl}
            alt={`${faculty.firstName} ${faculty.lastName}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl text-gray-400">
              {faculty.firstName[0]}
              {faculty.lastName[0]}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900">
          {faculty.firstName} {faculty.lastName}
        </h3>
        <p className="text-sm text-gray-600">{faculty.title}</p>
        <p className="text-sm text-gray-500 mt-1">{faculty.department.name}</p>
        {faculty.researchArea && (
          <p className="text-xs text-gray-400 mt-2">{faculty.researchArea}</p>
        )}
      </div>
    </div>
  )
}
