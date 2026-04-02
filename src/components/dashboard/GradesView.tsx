'use client'

import React, { useState, useEffect } from 'react'

interface Grade {
  id: number
  score: number
  grade: string
  semester: string
  course: { code: string; name: string; credits: number }
}

export const GradesView: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([])
  const [gpa, setGpa] = useState<string>('0.00')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/grades')
      .then(res => res.json())
      .then(data => {
        setGrades(data.grades || [])
        setGpa(data.gpa || '0.00')
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const gradeColors: Record<string, string> = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-yellow-100 text-yellow-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'F': 'bg-red-100 text-red-800'
  }

  if (loading) {
    return <div className="p-4">Loading grades...</div>
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg p-6 text-white mb-6">
        <p className="text-sm opacity-80">Current GPA</p>
        <p className="text-4xl font-bold">{gpa}</p>
        <p className="text-sm opacity-80 mt-2">{grades.length} courses completed</p>
      </div>

      {grades.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No grades available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Course</th>
                <th className="px-4 py-2 text-left">Credits</th>
                <th className="px-4 py-2 text-center">Score</th>
                <th className="px-4 py-2 text-center">Grade</th>
                <th className="px-4 py-2 text-left">Semester</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(grade => (
                <tr key={grade.id} className="border-t">
                  <td className="px-4 py-3">
                    <p className="font-medium">{grade.course.code}</p>
                    <p className="text-sm text-gray-500">{grade.course.name}</p>
                  </td>
                  <td className="px-4 py-3">{grade.course.credits}</td>
                  <td className="px-4 py-3 text-center">{grade.score}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded ${gradeColors[grade.grade] || 'bg-gray-100'}`}>
                      {grade.grade}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{grade.semester}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
