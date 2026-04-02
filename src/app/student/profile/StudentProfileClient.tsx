'use client'

import React, { useState } from 'react'
import { StudentSidebar, defaultNavItems } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  User, Mail, Phone, MapPin, Calendar, Award, BookOpen, 
  GraduationCap, Edit2, Save, X, Loader2, Shield, Clock,
  CheckCircle, AlertCircle
} from 'lucide-react'

interface UserData {
  clerkId: string
  firstName: string
  lastName: string
  email: string
  imageUrl: string
  phone: string
  address: string
  city: string
  country: string
  dateOfBirth?: Date | null
  isVerified?: boolean
  emailVerified?: boolean
  createdAt?: Date
}

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
  semester: string
  entryMode: string
  entryYear: number
  profileImage: string
}

interface StudentProfileClientProps {
  userData: UserData
}

export function StudentProfileClient({ userData }: StudentProfileClientProps) {
  const [activeTab, setActiveTab] = useState('biodata')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editData, setEditData] = useState({
    phone: userData.phone,
    address: userData.address,
    city: userData.city,
    country: userData.country,
    dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
  })

  const student: StudentInfo = {
    matricNumber: 'N/A',
    regNumber: 'N/A',
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone || 'Not provided',
    faculty: 'N/A',
    department: 'N/A',
    programme: 'N/A',
    level: 0,
    status: 'Active',
    session: '2025/2026',
    semester: 'First Semester',
    entryMode: 'N/A',
    entryYear: new Date().getFullYear(),
    profileImage: userData.imageUrl,
  }

  const handleNavigate = (item: { id: string; href?: string }) => {
    if (item.href) window.location.href = item.href
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )

  const EditableInfoItem = ({ icon: Icon, label, value, field, type = 'text' }: { 
    icon: React.ElementType, 
    label: string, 
    value: string,
    field: keyof typeof editData,
    type?: string
  }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-gray-400" />
      <div className="flex-1">
        <p className="text-xs text-gray-500">{label}</p>
        {isEditing ? (
          <Input
            type={type}
            value={editData[field]}
            onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
            className="mt-1 h-8"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <p className="text-sm font-medium text-gray-800">{value || 'Not provided'}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="fixed left-0 top-0 h-full z-50">
        <StudentSidebar
          items={defaultNavItems}
          logoSrc="../images/newllogo.png"
          studentName={`${student.firstName} ${student.lastName}`}
          studentImage={student.profileImage}
          activeItem="profile"
          onNavigate={handleNavigate}
        />
      </div>

      <div className="flex-1 ml-64 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="mr-2">👤</span>
              Profile
            </h1>
            <p className="text-gray-600">View and manage your profile information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-200 mb-4">
                    <img 
                      src={student.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{student.firstName} {student.lastName}</h2>
                <p className="text-sm text-gray-500">{student.matricNumber}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {student.status}
                </span>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Email Verified</span>
                  <span className={`flex items-center gap-1 text-sm ${userData.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {userData.emailVerified ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {userData.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Profile Status</span>
                  <span className="flex items-center gap-1 text-sm text-green-600">
                    <Shield className="w-4 h-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Member Since</span>
                  <span className="text-sm font-medium text-gray-800">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Level</span>
                  <span className="text-sm font-medium text-gray-800">{student.level > 0 ? `${student.level}00 Level` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Session</span>
                  <span className="text-sm font-medium text-gray-800">{student.session}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Semester</span>
                  <span className="text-sm font-medium text-gray-800">{student.semester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Entry Mode</span>
                  <span className="text-sm font-medium text-gray-800">{student.entryMode}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2 border-b">
              {['biodata', 'academic', 'contact', 'account'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-blue-600 text-yellow-600' 
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'biodata' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Biodata Information</CardTitle>
                    <CardDescription>Your personal information from Clerk</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={User} label="Full Name" value={`${student.firstName} ${student.lastName}`} />
                    <InfoItem icon={Award} label="Matric Number" value={student.matricNumber} />
                    <InfoItem icon={BookOpen} label="Registration Number" value={student.regNumber} />
                    <InfoItem icon={GraduationCap} label="Programme" value={student.programme} />
                    <InfoItem icon={Calendar} label="Entry Year" value={student.entryYear.toString()} />
                    <InfoItem icon={Award} label="Faculty" value={student.faculty} />
                    <InfoItem icon={BookOpen} label="Department" value={student.department} />
                    <EditableInfoItem icon={Calendar} label="Date of Birth" value={editData.dateOfBirth || 'Not provided'} field="dateOfBirth" type="date" />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'academic' && (
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                  <CardDescription>Your academic details and enrollment status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={BookOpen} label="Programme" value={student.programme} />
                    <InfoItem icon={Award} label="Faculty" value={student.faculty} />
                    <InfoItem icon={User} label="Department" value={student.department} />
                    <InfoItem icon={Calendar} label="Level" value={student.level > 0 ? `${student.level}00 Level` : 'N/A'} />
                    <InfoItem icon={Calendar} label="Current Session" value={student.session} />
                    <InfoItem icon={Calendar} label="Current Semester" value={student.semester} />
                    <InfoItem icon={Award} label="Entry Mode" value={student.entryMode} />
                    <InfoItem icon={Calendar} label="Entry Year" value={student.entryYear.toString()} />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'contact' && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Your contact details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoItem icon={Mail} label="Email Address" value={student.email} />
                    <EditableInfoItem icon={Phone} label="Phone Number" value={editData.phone || 'Not provided'} field="phone" />
                    <EditableInfoItem icon={MapPin} label="Address" value={editData.address || 'Not provided'} field="address" />
                    <EditableInfoItem icon={MapPin} label="City" value={editData.city || 'Not provided'} field="city" />
                    <EditableInfoItem icon={MapPin} label="Country" value={editData.country || 'Not provided'} field="country" />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'account' && (
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Password & Security</p>
                        <p className="text-sm text-gray-500">Managed through Clerk</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://dashboard.clerk.com/settings/user" target="_blank" rel="noopener noreferrer">
                        Manage
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Email Verification</p>
                        <p className="text-sm text-gray-500">
                          {userData.emailVerified ? 'Your email is verified' : 'Verification pending'}
                        </p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-sm ${userData.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {userData.emailVerified ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      {userData.emailVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
