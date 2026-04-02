import { Input } from '@/components/ui/input'
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form'
import { APPLICATION_TERMS, GRADUATE_PROGRAMS } from './types'

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
        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600"
      />
      <div className="space-y-1 leading-none">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}

const toOptions = (arr: readonly string[]) => arr.map(v => ({ value: v, label: v }))

const COUNTRY_OPTIONS = toOptions(['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'India', 'China', 'Other'])
const GENDER_OPTIONS = toOptions(['male', 'female', 'non-binary', 'prefer-not-to-say'])
const GRADUATE_MAJOR_OPTIONS = toOptions(GRADUATE_PROGRAMS)
const PROGRAM_TYPE_OPTIONS = [
  { value: 'Masters', label: 'Masters' },
  { value: 'PhD', label: 'PhD' },
]
const DEGREE_OPTIONS = toOptions(['Bachelor of Arts (BA)', 'Bachelor of Science (BS)', 'Bachelor of Engineering (BEng)', 'Other'])

export function GraduatePersonalInfoFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-600/20">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <FormField control={form.control} name="city" render={({ field }) => (
          <FormItem><FormLabel>City *</FormLabel><FormControl><Input placeholder="New York" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="state" render={({ field }) => (
          <FormItem><FormLabel>State/Province *</FormLabel><FormControl><Input placeholder="NY" {...field} /></FormControl><FormMessage /></FormItem>
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

export function GraduateAcademicBackgroundFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-600/20">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Academic Background</h2>
      </div>

      <FormField control={form.control} name="applicationTerm" render={({ field }) => (
        <FormItem><FormLabel>Application Term *</FormLabel><FormControl><SimpleSelect value={field.value} onValueChange={field.onChange} placeholder="Select term" options={APPLICATION_TERMS} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="undergraduateInstitution" render={({ field }) => (
        <FormItem><FormLabel>Undergraduate Institution *</FormLabel><FormControl><Input placeholder="University Name" {...field} /></FormControl><FormMessage /></FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="undergraduateDegree" render={({ field }) => (
          <FormItem><FormLabel>Degree *</FormLabel><FormControl><SimpleSelect value={field.value || ''} onValueChange={field.onChange} placeholder="Select degree" options={DEGREE_OPTIONS} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="graduationYear" render={({ field }) => (
          <FormItem><FormLabel>Graduation Year</FormLabel><FormControl><Input type="number" placeholder="2024" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>

      <FormField control={form.control} name="undergraduateGPA" render={({ field }) => (
        <FormItem><FormLabel>Undergraduate GPA (0-4)</FormLabel><FormControl><Input type="number" step="0.01" placeholder="3.85" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField control={form.control} name="greScore" render={({ field }) => (
          <FormItem><FormLabel>GRE Score (260-340)</FormLabel><FormControl><Input type="number" placeholder="325" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="gmatScore" render={({ field }) => (
          <FormItem><FormLabel>GMAT Score (200-800)</FormLabel><FormControl><Input type="number" placeholder="700" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
    </div>
  )
}

export function GraduateProgramSelectionFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-600/20">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Program Selection</h2>
      </div>

      <FormField control={form.control} name="programType" render={({ field }) => (
        <FormItem><FormLabel>Program Type *</FormLabel><FormControl><SimpleSelect value={field.value} onValueChange={field.onChange} placeholder="Select program type" options={PROGRAM_TYPE_OPTIONS} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="majorFirstChoice" render={({ field }) => (
        <FormItem><FormLabel>First Choice Program *</FormLabel><FormControl><SimpleSelect value={field.value} onValueChange={field.onChange} placeholder="Select program" options={GRADUATE_MAJOR_OPTIONS} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="majorSecondChoice" render={({ field }) => (
        <FormItem><FormLabel>Second Choice Program (Optional)</FormLabel><FormControl><SimpleSelect value={field.value || ''} onValueChange={field.onChange} placeholder="Select program" options={GRADUATE_MAJOR_OPTIONS} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="researchInterest" render={({ field }) => (
        <FormItem><FormLabel>Research Interests (Optional)</FormLabel><FormControl><textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Describe your research interests..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />
    </div>
  )
}

export function GraduateDocumentsFields({ form }: { form: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-purple-600/20">
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Documents</h2>
      </div>

      <FormField control={form.control} name="statementOfPurpose" render={({ field }) => (
        <FormItem><FormLabel>Statement of Purpose *</FormLabel><FormControl><textarea className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Describe your academic goals, research experience, and why you want to pursue this program..." {...field} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="workExperience" render={({ field }) => (
        <FormItem><FormLabel>Work Experience (Optional)</FormLabel><FormControl><textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="List relevant work experience, internships, or research positions..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />

      <FormField control={form.control} name="lettersOfRecommendation" render={({ field }) => (
        <FormItem><FormLabel>Letters of Recommendation (Optional)</FormLabel><FormControl><textarea className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Provide contact information for recommenders or list their names and titles..." {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>
      )} />

      <div className="space-y-4 pt-4">
        <FormField control={form.control} name="fundingRequest" render={({ field }) => (
          <FormItem><FormControl><SimpleCheckbox checked={field.value} onCheckedChange={field.onChange} label="I am requesting funding/financial support" description="Check this if you would like to be considered for assistantships, fellowships, or scholarships" /></FormControl></FormItem>
        )} />
      </div>
    </div>
  )
}
