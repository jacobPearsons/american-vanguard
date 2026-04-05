/**
 * Undergraduate Form Fields
 * Purpose: Reusable form field components for undergraduate admission
 * 
 * Per docs/component-design-rules.md:
 * - Components must be small and focused
 * - Single responsibility
 */

import { Input } from '@/components/ui/input'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/forms/form'
import { APPLICATION_TERMS, UNDERGRADUATE_MAJORS } from './types'

// Simple Select Component
interface SimpleSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}

export function SimpleSelect({ value, onValueChange, placeholder, options }: SimpleSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}

// Checkbox Component
interface SimpleCheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label: string
  description?: string
}

export function SimpleCheckbox({ checked, onCheckedChange, label, description }: SimpleCheckboxProps) {
  return (
    <div className="flex flex-row items-start space-x-3 space-y-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300 text-yellow-600 focus:ring-yellow-600"
      />
      <div className="space-y-1 leading-none">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

// Helper to convert string array to select options
const toOptions = (arr: readonly string[]) => arr.map(v => ({ value: v, label: v }))

// Country Options
const COUNTRY_OPTIONS = toOptions(['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'China', 'Other'])
const GENDER_OPTIONS = toOptions(['male', 'female', 'non-binary', 'prefer-not-to-say'])
const MAJOR_OPTIONS = toOptions(UNDERGRADUATE_MAJORS)

// Step 1: Personal Information
export function PersonalInfoFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-yellow-600/20">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="firstName" render={({ field }) => (
          <FormItem><FormLabel>First Name *</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="lastName" render={({ field }) => (
          <FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email Address *</FormLabel><FormControl><Input type="email" placeholder="john@example.com" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" placeholder="+1 (555) 000-0000" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
          <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="gender" render={({ field }) => (
          <FormItem><FormLabel>Gender</FormLabel><FormControl><SimpleSelect value={field.value || ''} onValueChange={field.onChange} placeholder="Select gender" options={GENDER_OPTIONS} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="country" render={({ field }) => (
          <FormItem><FormLabel>Country *</FormLabel><FormControl><SimpleSelect value={field.value} onValueChange={field.onChange} placeholder="Select country" options={COUNTRY_OPTIONS} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="citizenship" render={({ field }) => (
          <FormItem><FormLabel>Citizenship</FormLabel><FormControl><Input placeholder="e.g., USA" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>

      <FormField control={form.control} name="isInternational" render={({ field }) => (
        <FormItem><FormControl><SimpleCheckbox checked={field.value} onCheckedChange={field.onChange} label="I am an international student" description="Check this if you are not a U.S. citizen or permanent resident" /></FormControl></FormItem>
      )} />
    </div>
  )
}

// Step 2: Academic Background
export function AcademicBackgroundFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-yellow-600/20">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Academic Background</h2>
      </div>

      <FormField control={form.control} name="applicationTerm" render={({ field }) => (
        <FormItem><FormLabel>Application Term *</FormLabel><FormControl><SimpleSelect value={field.value} onValueChange={field.onChange} placeholder="Select term" options={APPLICATION_TERMS} /></FormControl><FormMessage /></FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="highSchoolName" render={({ field }) => (
          <FormItem><FormLabel>High School Name *</FormLabel><FormControl><Input placeholder="Lincoln High School" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="highSchoolCountry" render={({ field }) => (
          <FormItem><FormLabel>High School Country *</FormLabel><FormControl><Input placeholder="United States" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>

      <FormField control={form.control} name="highSchoolGPA" render={({ field }) => (
        <FormItem><FormLabel>High School GPA (0-5)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="3.85" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="satScore" render={({ field }) => (
          <FormItem><FormLabel>SAT Score (400-1600)</FormLabel><FormControl><Input type="number" placeholder="1400" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="actScore" render={({ field }) => (
          <FormItem><FormLabel>ACT Score (1-36)</FormLabel><FormControl><Input type="number" placeholder="32" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
    </div>
  )
}

// Step 3: Program Selection
export function ProgramSelectionFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-yellow-600/20">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Program Selection</h2>
      </div>

      <FormField control={form.control} name="majorFirstChoice" render={({ field }) => (
        <FormItem><FormLabel>First Choice Major *</FormLabel><FormControl><SimpleSelect value={field.value} onValueChange={field.onChange} placeholder="Select major" options={MAJOR_OPTIONS} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="majorSecondChoice" render={({ field }) => (
        <FormItem><FormLabel>Second Choice Major (Optional)</FormLabel><FormControl><SimpleSelect value={field.value || ''} onValueChange={field.onChange} placeholder="Select major" options={MAJOR_OPTIONS} /></FormControl><FormMessage /></FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="toeflScore" render={({ field }) => (
          <FormItem><FormLabel>TOEFL Score (0-120)</FormLabel><FormControl><Input type="number" placeholder="100" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="ieltsScore" render={({ field }) => (
          <FormItem><FormLabel>IELTS Score (0-9)</FormLabel><FormControl><Input type="number" step="0.5" placeholder="7.0" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
    </div>
  )
}

// Step 4: Essay & Additional Info
export function EssayInfoFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-yellow-600/20">
          <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Essay & Additional Information</h2>
      </div>

      <FormField control={form.control} name="essayContent" render={({ field }) => (
        <FormItem><FormLabel>Personal Statement *</FormLabel><FormControl><textarea className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tell us about yourself, your goals, and why you want to attend..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="extracurriculars" render={({ field }) => (
        <FormItem><FormLabel>Extracurricular Activities (Optional)</FormLabel><FormControl><textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="List your extracurricular activities, sports, clubs, etc." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />

      <div className="space-y-4 pt-4">
        <FormField control={form.control} name="requestFinancialAid" render={({ field }) => (
          <FormItem><FormControl><SimpleCheckbox checked={field.value} onCheckedChange={field.onChange} label="I want to apply for financial aid" description="Complete the FAFSA to be considered for need-based aid" /></FormControl></FormItem>
        )} />

        <FormField control={form.control} name="scholarshipInterest" render={({ field }) => (
          <FormItem><FormControl><SimpleCheckbox checked={field.value} onCheckedChange={field.onChange} label="I am interested in scholarships" description="Merit-based scholarships are available for qualified students" /></FormControl></FormItem>
        )} />
      </div>
    </div>
  )
}
