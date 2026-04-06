'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Download, Printer, QrCode, Phone, Mail, MapPin } from 'lucide-react'

interface StudentInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  imageUrl: string
}

interface StudentIDCardClientProps {
  userData: StudentInfo
}

const mockData = {
  matricNumber: '2005003013',
  regNumber: '22259597CF',
  faculty: 'Engineering',
  department: 'Electrical & Electronic Engineering',
  programme: 'B.Eng. Electrical & Electronic Engineering',
  level: 500,
  status: 'Active',
  session: '2025/2026',
  entryYear: 2020,
  bloodGroup: 'O+',
  genotype: 'AA',
}

export function StudentIDCardClient({ userData }: StudentIDCardClientProps) {
  const student = { ...mockData, ...userData }
  const fullName = `${student.firstName} ${student.lastName}`.trim() || 'Student'

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    window.print()
  }

  return (
    <StudentLayout studentName={fullName} studentImage={student.imageUrl}>
      <div className="p-6 min-h-screen bg-neutral-950">
        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-white">
            <span className="mr-2">🪪</span>
            Student ID Card
          </h1>
          <p className="text-neutral-400">View and download your official student ID</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:block">
          <div className="lg:col-span-2">
            <div className="flex gap-4 justify-center">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden w-96 print:shadow-none print:w-full">
                <div id="id-card-front">
                  <div className="bg-red-700 text-white p-4 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                        <span className="text-red-700 font-bold text-lg">AVI</span>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold mt-2">AMERICAN VANGUARD INSTITUTE</h2>
                    <p className="text-xs opacity-80">OFFICIAL STUDENT IDENTITY CARD</p>
                  </div>
                  
                  <div className="p-6 text-center bg-gray-50">
                    <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden bg-gray-200 mb-4 border-4 border-gray-300">
                      <img 
                        src={student.imageUrl} 
                        alt="Student Photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">
                      {fullName}
                    </h3>
                    <p className="text-lg text-red-700 font-semibold mt-1">
                      Matric No: {student.matricNumber}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {student.programme}
                    </p>
                  </div>

                  <div className="bg-gray-100 px-6 py-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Faculty</p>
                        <p className="font-medium text-gray-800">{student.faculty}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Department</p>
                        <p className="font-medium text-gray-800">{student.department}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Level</p>
                        <p className="font-medium text-gray-800">{student.level}00 Level</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Session</p>
                        <p className="font-medium text-gray-800">{student.session}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-700 text-white px-6 py-2 flex items-center justify-between">
                    <div className="text-xs">
                      <p>Valid: {new Date().getFullYear()} - {new Date().getFullYear() + 1}</p>
                    </div>
                    <div className="w-16 h-16 bg-white rounded">
                      <QrCode className="w-full h-full text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg overflow-hidden w-80 print:hidden">
                <div className="bg-red-700 text-white p-3 text-center">
                  <h3 className="font-bold text-sm">BACK OF CARD</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Registration No.</p>
                      <p className="font-medium">{student.regNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Entry Year</p>
                      <p className="font-medium">{student.entryYear}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Blood Group</p>
                      <p className="font-medium">{student.bloodGroup}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Genotype</p>
                      <p className="font-medium">{student.genotype}</p>
                    </div>
                    <hr className="my-2" />
                    <div className="text-xs text-gray-600">
                      <p className="font-semibold mb-1">Emergency Contact:</p>
                      <p>{student.phone}</p>
                      <p>{student.email}</p>
                    </div>
                    <hr className="my-2" />
                    <p className="text-xs text-gray-500 italic">
                      This card is the property of American Vanguard Institute. 
                      Report loss to the registry office immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4 mt-8 print:hidden">
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <Download className="w-5 h-5" />
                Download/Print
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-3 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-800"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>

          <div className="space-y-6 print:hidden">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Card Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Status</span>
                    <span className="font-medium text-green-500">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Valid From</span>
                    <span className="font-medium text-white">Sep 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Valid Until</span>
                    <span className="font-medium text-white">Aug 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Card Type</span>
                    <span className="font-medium text-white">Regular</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardHeader>
                <CardTitle className="text-lg text-white">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <p>+234 800 123 4567</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <p>registry@avi.edu</p>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <p>Registry Office, Admin Block</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-900/20 border-yellow-800">
              <CardContent className="p-4">
                <h4 className="font-medium text-yellow-500 mb-2">Important</h4>
                <p className="text-sm text-yellow-400">
                  If your card is lost or damaged, please report to the registry office immediately for replacement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}