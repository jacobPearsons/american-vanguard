'use client'

import React, { useState, useRef } from 'react'
import { StudentLayout } from '@/components/features/student-dashboard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { 
  User, Mail, Phone, MapPin, Calendar, Award, BookOpen, 
  GraduationCap, Edit2, Save, X, Loader2, Shield, Clock,
  CheckCircle, AlertCircle, Camera
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
  bio?: string
  isVerified?: boolean
  emailVerified?: boolean
  createdAt?: Date
}

interface StudentProfileClientProps {
  userData: UserData
}

export function StudentProfileClient({ userData }: StudentProfileClientProps) {
  const [activeTab, setActiveTab] = useState('biodata')
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [editData, setEditData] = useState({
    phone: userData.phone,
    address: userData.address,
    city: userData.city,
    country: userData.country,
    dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
    bio: userData.bio || '',
    profileImage: userData.imageUrl,
  })

  const student = {
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
    profileImage: avatarPreview || userData.imageUrl,
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleEdit = () => {
    setIsEditing(true)
    setEditData({
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
      bio: userData.bio || '',
      profileImage: userData.imageUrl,
    })
  }

  const handleCancel = () => {
    setIsEditing(false)
    setAvatarPreview(null)
    setEditData({
      phone: userData.phone,
      address: userData.address,
      city: userData.city,
      country: userData.country,
      dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
      bio: userData.bio || '',
      profileImage: userData.imageUrl,
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const payload = {
        profileImage: avatarPreview || editData.profileImage,
        bio: editData.bio,
        phone: editData.phone,
        address: editData.address,
        city: editData.city,
        country: editData.country,
        dateOfBirth: editData.dateOfBirth || null,
      }

      const response = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to update profile')

      toast.success('Profile updated successfully')
      setIsEditing(false)
      setAvatarPreview(null)
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
            value={editData[field] as string}
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
    <StudentLayout 
      studentName={`${student.firstName} ${student.lastName}`} 
      studentImage={student.profileImage}
    >
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              <span className="mr-2">👤</span>
              Profile
            </h1>
            <p className="text-neutral-400">View and manage your profile information</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-neutral-800 border-neutral-700">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-neutral-700">
                    <img 
                      src={student.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isEditing && (
                    <button
                      onClick={handleAvatarClick}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center hover:bg-yellow-500 transition-colors"
                    >
                      <Camera className="w-5 h-5 text-white" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold text-white">{student.firstName} {student.lastName}</h2>
                <p className="text-sm text-neutral-400">{student.matricNumber}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-green-900/30 text-green-400 rounded-full text-sm">
                  {student.status}
                </span>
              </CardContent>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Email Verified</span>
                  <span className={`flex items-center gap-1 text-sm ${userData.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
                    {userData.emailVerified ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {userData.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Profile Status</span>
                  <span className="flex items-center gap-1 text-sm text-green-400">
                    <Shield className="w-4 h-4" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-400">Member Since</span>
                  <span className="text-sm font-medium text-white">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <CardHeader>
                <CardTitle className="text-lg text-white">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-400">Level</span>
                  <span className="text-sm font-medium text-white">{student.level > 0 ? `${student.level}00 Level` : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-400">Session</span>
                  <span className="text-sm font-medium text-white">{student.session}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-400">Semester</span>
                  <span className="text-sm font-medium text-white">{student.semester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-neutral-400">Entry Mode</span>
                  <span className="text-sm font-medium text-white">{student.entryMode}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex gap-2 border-b border-neutral-700">
              {['biodata', 'academic', 'contact', 'account'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab 
                      ? 'border-yellow-600 text-yellow-500' 
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'biodata' && (
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Biodata Information</CardTitle>
                    <CardDescription className="text-neutral-400">Your personal information</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit} className="border-neutral-600 text-neutral-200 hover:bg-neutral-700">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading} className="border-neutral-600 text-neutral-200 hover:bg-neutral-700">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-500">
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
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
                  
                  <div className="mt-4">
                    <Label className="text-neutral-400 mb-2 block">Bio</Label>
                    {isEditing ? (
                      <textarea
                        value={editData.bio}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditData({ ...editData, bio: e.target.value })}
                        placeholder="Write a short bio about yourself..."
                        className="bg-neutral-700 border border-neutral-600 text-white min-h-[100px] w-full rounded-md p-3 text-sm"
                        maxLength={500}
                      />
                    ) : (
                      <p className="text-sm font-medium text-neutral-300 bg-neutral-700/50 p-3 rounded-lg min-h-[60px]">
                        {userData.bio || 'No bio added yet'}
                      </p>
                    )}
                    {isEditing && (
                      <p className="text-xs text-neutral-500 mt-1">{editData.bio.length}/500 characters</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'academic' && (
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-white">Academic Information</CardTitle>
                  <CardDescription className="text-neutral-400">Your academic details and enrollment status</CardDescription>
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
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Contact Information</CardTitle>
                    <CardDescription className="text-neutral-400">Your contact details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={handleEdit} className="border-neutral-600 text-neutral-200 hover:bg-neutral-700">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCancel} disabled={isLoading} className="border-neutral-600 text-neutral-200 hover:bg-neutral-700">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSave} disabled={isLoading} className="bg-yellow-600 hover:bg-yellow-500">
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
              <Card className="bg-neutral-800 border-neutral-700">
                <CardHeader>
                  <CardTitle className="text-white">Account Settings</CardTitle>
                  <CardDescription className="text-neutral-400">Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-900/30 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Password & Security</p>
                        <p className="text-sm text-neutral-400">Managed through Clerk</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="border-neutral-600 text-neutral-200 hover:bg-neutral-700">
                      <a href="https://dashboard.clerk.com/settings/user" target="_blank" rel="noopener noreferrer">
                        Manage
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-neutral-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-900/30 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Email Verification</p>
                        <p className="text-sm text-neutral-400">
                          {userData.emailVerified ? 'Your email is verified' : 'Verification pending'}
                        </p>
                      </div>
                    </div>
                    <span className={`flex items-center gap-1 text-sm ${userData.emailVerified ? 'text-green-400' : 'text-yellow-400'}`}>
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
    </StudentLayout>
  )
}