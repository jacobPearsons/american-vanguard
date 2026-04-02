'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FacultySearch, FacultyFilters, FacultyGrid } from '@/components/faculty'
import Navbar from '@/components/global/navbar'
import { Footer } from '@/components/global/footer'

interface Department {
  id: number
  name: string
  school: string
}

interface FacultyMember {
  id: number
  firstName: string
  lastName: string
  title: string
  photoUrl?: string | null
  researchArea?: string | null
  department: {
    name: string
    school: string
  }
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [departmentId, setDepartmentId] = useState('all')
  const [school, setSchool] = useState('all')

  const fetchFaculty = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (departmentId !== 'all') params.set('departmentId', departmentId)
      if (school !== 'all') params.set('school', school)

      const res = await fetch(`/api/faculty?${params.toString()}`)
      const data = await res.json()
      setFaculty(data.faculty || [])
    } catch (error) {
      console.error('Error fetching faculty:', error)
    } finally {
      setLoading(false)
    }
  }, [search, departmentId, school])

  const fetchDepartments = useCallback(async () => {
    try {
      const res = await fetch('/api/departments')
      const data = await res.json()
      setDepartments(data.departments || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }, [])

  useEffect(() => {
    fetchDepartments()
  }, [fetchDepartments])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFaculty()
    }, 300)
    return () => clearTimeout(timer)
  }, [fetchFaculty])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Faculty Directory</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <FacultySearch onSearch={setSearch} />
          <FacultyFilters
            departments={departments}
            selectedDepartment={departmentId}
            selectedSchool={school}
            onDepartmentChange={setDepartmentId}
            onSchoolChange={setSchool}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <FacultyGrid faculty={faculty} />
        )}
      </main>
      <Footer />
    </div>
  )
}
