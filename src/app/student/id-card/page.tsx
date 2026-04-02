'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Download, Printer, QrCode, Calendar, MapPin, Phone, Mail } from 'lucide-react'

interface StudentInfo {
  matricNumber: string
  regNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  faculty: string
  department: string
  programme: string
  level: number
  status: string
  session: string
  entryYear: number
  profileImage: string
  bloodGroup: string
  genotype: string
}

const mockStudent: StudentInfo = {
  matricNumber: '2005003013',
  regNumber: '22259597CF',
  firstName: 'Adeniyi Victor',
  lastName: 'Ayomide',
  email: 'adeniyi.victor@example.com',
  phone: '+234 812 345 6789',
  faculty: 'Engineering',
  department: 'Electrical & Electronic Engineering',
  programme: 'B.Eng. Electrical & Electronic Engineering',
  level: 500,
  status: 'Active',
  session: '2025/2026',
  entryYear: 2020,
  profileImage: '../uploads/11015-d14efe5e-7045-42a4-9e53-0b597c3643c0_11zon-3.jpeg',
  bloodGroup: 'O+',
  genotype: 'AA',
}

export default function StudentIDCardPage() {
  const [student] = useState<StudentInfo>(mockStudent)

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const idCardContent = document.getElementById('id-card-front')
    if (idCardContent) {
      window.print()
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50 print:hidden">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName={`${student.firstName} ${student.lastName}`}
          studentImage={student.profileImage}
          activeItem="idcard"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6 print:ml-0 print:p-0">
        <div className="mb-6 print:hidden">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="mr-2">🪪</span>
            Student ID Card
          </h1>
          <p className="text-gray-600">View and download your official student ID</p>
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
                        src={student.profileImage} 
                        alt="Student Photo" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">
                      {student.firstName} {student.lastName}
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
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Printer className="w-5 h-5" />
                Print
              </button>
            </div>
          </div>

          <div className="space-y-6 print:hidden">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Card Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-green-600">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valid From</span>
                    <span className="font-medium">Sep 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Valid Until</span>
                    <span className="font-medium">Aug 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Card Type</span>
                    <span className="font-medium">Regular</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
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

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Important</h4>
                <p className="text-sm text-yellow-700">
                  If your card is lost or damaged, please report to the registry office immediately for replacement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}