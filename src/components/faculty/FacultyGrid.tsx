import React from 'react'
import { FacultyCard } from './FacultyCard'

interface FacultyMember {
  id: number
  firstName: string
  lastName: string
  title: string
  photoUrl?: string | null
  researchArea?: string | null
  department: { name: string; school: string }
}

interface FacultyGridProps {
  faculty: FacultyMember[]
}

export const FacultyGrid: React.FC<FacultyGridProps> = ({ faculty }) => {
  if (faculty.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No faculty members found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {faculty.map((member) => (
        <FacultyCard key={member.id} faculty={member} />
      ))}
    </div>
  )
}
