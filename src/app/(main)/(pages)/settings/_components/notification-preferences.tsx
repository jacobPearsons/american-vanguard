'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/forms/switch'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Save } from 'lucide-react'

type Preferences = {
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

type Props = {
  preferences: Preferences | null
}

export default function NotificationPreferences({ preferences }: Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [ prefs, setPrefs ] = useState<Preferences>({
    emailAdmissionUpdates: preferences?.emailAdmissionUpdates ?? true,
    emailApplicationStatus: preferences?.emailApplicationStatus ?? true,
    emailDeadlines: preferences?.emailDeadlines ?? true,
    emailNewFeatures: preferences?.emailNewFeatures ?? true,
    emailMarketing: preferences?.emailMarketing ?? false,
    pushAdmissionUpdates: preferences?.pushAdmissionUpdates ?? true,
    pushApplicationStatus: preferences?.pushApplicationStatus ?? true,
    pushDeadlines: preferences?.pushDeadlines ?? true,
    pushMessages: preferences?.pushMessages ?? true,
  })

  const handleToggle = (key: keyof Preferences) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    setSuccess(false)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch('/api/settings/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save preferences')
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email & Notification Preferences</CardTitle>
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
              description="Get notified about admission-related news and updates"
              checked={prefs.emailAdmissionUpdates}
              onChange={() => handleToggle('emailAdmissionUpdates')}
            />
            <PreferenceToggle
              label="Application Status"
              description="Receive emails about your application status changes"
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
          <h4 className="text-sm font-medium mb-4">In-App Notifications</h4>
          <div className="space-y-4">
            <PreferenceToggle
              label="Admission Updates"
              description="Show notifications for admission-related updates"
              checked={prefs.pushAdmissionUpdates}
              onChange={() => handleToggle('pushAdmissionUpdates')}
            />
            <PreferenceToggle
              label="Application Status"
              description="Show notifications for application status changes"
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

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {success && (
          <p className="text-sm text-green-500">Preferences saved successfully!</p>
        )}

        <Button onClick={handleSave} disabled={isSaving} className="w-full">
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
      </CardContent>
    </Card>
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
