'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { 
  Loader2, AlertTriangle, ExternalLink, User, Edit2, Bell, Shield, LogOut,
  Save, CheckCircle
} from 'lucide-react'

type Props = {}

interface NotificationPrefs {
  emailAdmissionUpdates: boolean
  emailApplicationStatus: boolean
  emailDeadlines: boolean
  emailNewFeatures: boolean
  emailMarketing: boolean
  pushAdmissionUpdates: boolean
  pushApplicationStatus: boolean
  pushDeadlines: boolean
  pushMessages: boolean
}

function SettingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [authUser, setAuthUser] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    emailAdmissionUpdates: true,
    emailApplicationStatus: true,
    emailDeadlines: true,
    emailNewFeatures: true,
    emailMarketing: false,
    pushAdmissionUpdates: true,
    pushApplicationStatus: true,
    pushDeadlines: true,
    pushMessages: true,
  })

  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/settings/user')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setPersonalInfo({
            firstName: data.user?.firstName || '',
            lastName: data.user?.lastName || '',
            phone: data.user?.phone || '',
            address: data.user?.address || '',
            city: data.user?.city || '',
            country: data.user?.country || '',
          })
          if (data.preferences) {
            setPrefs(data.preferences)
          }
          
          const clerkResponse = await fetch('/api/settings/clerk-user')
          if (clerkResponse.ok) {
            const clerkData = await clerkResponse.json()
            setAuthUser(clerkData.user)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleSavePersonalInfo = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings/personal-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personalInfo),
      })

      if (!response.ok) throw new Error('Failed to update')

      toast.success('Personal information updated successfully')
    } catch {
      toast.error('Failed to update personal information')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSavePreferences = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/settings/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })

      if (!response.ok) throw new Error('Failed to save')

      toast.success('Notification preferences saved')
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggle = (key: keyof NotificationPrefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'personal', label: 'Personal Info', icon: Edit2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'danger', label: 'Danger Zone', icon: AlertTriangle },
  ]

  return (
    <div className="flex flex-col gap-4">
      <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
        <span>Settings</span>
      </h1>

      <div className="flex gap-6 p-6">
        <div className="w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Overview
                </CardTitle>
                <CardDescription>
                  Your basic profile information from Clerk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                    <img 
                      src={authUser?.imageUrl || '/default-avatar.png'} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {authUser?.firstName} {authUser?.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {authUser?.email}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-600">Email Verified</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label className="text-muted-foreground">First Name</Label>
                    <p className="font-medium">{authUser?.firstName || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Last Name</Label>
                    <p className="font-medium">{authUser?.lastName || 'Not set'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{authUser?.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">User ID</Label>
                    <p className="font-medium text-xs truncate">{authUser?.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'personal' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit2 className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details stored in our database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={personalInfo.city}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={personalInfo.address}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                      placeholder="Street address"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={personalInfo.country}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, country: e.target.value })}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSavePersonalInfo} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Manage how you want to receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    <PreferenceToggle
                      label="Admission Updates"
                      description="Get notified about admission-related news"
                      checked={prefs.emailAdmissionUpdates}
                      onChange={() => handleToggle('emailAdmissionUpdates')}
                    />
                    <PreferenceToggle
                      label="Application Status"
                      description="Receive emails about your application status"
                      checked={prefs.emailApplicationStatus}
                      onChange={() => handleToggle('emailApplicationStatus')}
                    />
                    <PreferenceToggle
                      label="Deadlines"
                      description="Get reminders about important deadlines"
                      checked={prefs.emailDeadlines}
                      onChange={() => handleToggle('emailDeadlines')}
                    />
                    <PreferenceToggle
                      label="New Features"
                      description="Learn about new features and improvements"
                      checked={prefs.emailNewFeatures}
                      onChange={() => handleToggle('emailNewFeatures')}
                    />
                    <PreferenceToggle
                      label="Marketing"
                      description="Receive promotional emails and offers"
                      checked={prefs.emailMarketing}
                      onChange={() => handleToggle('emailMarketing')}
                    />
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="text-sm font-medium mb-4">Push Notifications</h4>
                  <div className="space-y-4">
                    <PreferenceToggle
                      label="Admission Updates"
                      description="Show notifications for admission updates"
                      checked={prefs.pushAdmissionUpdates}
                      onChange={() => handleToggle('pushAdmissionUpdates')}
                    />
                    <PreferenceToggle
                      label="Application Status"
                      description="Show notifications for application changes"
                      checked={prefs.pushApplicationStatus}
                      onChange={() => handleToggle('pushApplicationStatus')}
                    />
                    <PreferenceToggle
                      label="Deadlines"
                      description="Show notifications for upcoming deadlines"
                      checked={prefs.pushDeadlines}
                      onChange={() => handleToggle('pushDeadlines')}
                    />
                    <PreferenceToggle
                      label="Messages"
                      description="Show notifications for new messages"
                      checked={prefs.pushMessages}
                      onChange={() => handleToggle('pushMessages')}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handleSavePreferences} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Password & Security
                  </CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Password changes are managed by Clerk
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          For security reasons, password changes must be done through Clerk&apos;s secure portal.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href="https://dashboard.clerk.com/settings/user"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Change Password on Clerk
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          2FA is managed by Clerk
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          Configure two-factor authentication through Clerk&apos;s user management.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href="https://dashboard.clerk.com/settings/user"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Manage 2FA on Clerk
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogOut className="w-5 h-5" />
                    Active Sessions
                  </CardTitle>
                  <CardDescription>
                    View and manage your active login sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">
                          Session management through Clerk
                        </p>
                        <p className="text-sm text-amber-700 mt-1">
                          View and revoke active sessions through Clerk&apos;s dashboard.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <a
                      href="https://dashboard.clerk.com/settings/user"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Manage Sessions on Clerk
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'danger' && (
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Irreversible actions for your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Account deletion is handled by Clerk
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        To delete your account, you must use Clerk&apos;s user management portal.
                        This action is irreversible and all your data will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>
                <Button variant="destructive" className="w-full" asChild>
                  <a
                    href="https://dashboard.clerk.com/settings/user"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Delete Account on Clerk
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

export default function Settings(props: Props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
