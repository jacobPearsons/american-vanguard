'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Filter,
  ChevronDown,
  Bookmark,
  BookmarkCheck
} from 'lucide-react'
import Link from 'next/link'

// Mock job data
const jobs = [
  {
    id: 1,
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    companyLogo: '/logo-1.png',
    location: 'San Francisco, CA',
    type: 'Full Time',
    salary: '$120k - $180k',
    posted: '2 days ago',
    tags: ['React', 'Node.js', 'TypeScript'],
    featured: true,
    remote: true,
  },
  {
    id: 2,
    title: 'Product Designer',
    company: 'DesignHub',
    location: 'Remote',
    type: 'Full Time',
    salary: '$90k - $140k',
    posted: '1 day ago',
    tags: ['Figma', 'UI/UX', 'Design Systems'],
    featured: true,
    remote: true,
  },
  {
    id: 3,
    title: 'Data Scientist',
    company: 'DataMinds',
    location: 'New York, NY',
    type: 'Full Time',
    salary: '$130k - $170k',
    posted: '3 days ago',
    tags: ['Python', 'ML', 'TensorFlow'],
    featured: false,
    remote: false,
  },
  {
    id: 4,
    title: 'DevOps Engineer',
    company: 'CloudFirst',
    location: 'Austin, TX',
    type: 'Full Time',
    salary: '$110k - $160k',
    posted: '5 hours ago',
    tags: ['AWS', 'Kubernetes', 'Docker'],
    featured: true,
    remote: false,
  },
  {
    id: 5,
    title: 'Frontend Developer',
    company: 'WebWorks',
    location: 'Remote',
    type: 'Contract',
    salary: '$60 - $80/hr',
    posted: '1 day ago',
    tags: ['Vue.js', 'JavaScript', 'CSS'],
    featured: false,
    remote: true,
  },
  {
    id: 6,
    title: 'Marketing Manager',
    company: 'GrowthLabs',
    location: 'Chicago, IL',
    type: 'Full Time',
    salary: '$80k - $120k',
    posted: '4 days ago',
    tags: ['Digital Marketing', 'SEO', 'Analytics'],
    featured: false,
    remote: false,
  },
]

const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Internship']
const experienceLevels = ['All Levels', 'Entry Level', 'Junior', 'Mid', 'Senior', 'Lead']

export default function JobsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('All')
  const [selectedExperience, setSelectedExperience] = useState('All Levels')
  const [showFilters, setShowFilters] = useState(false)
  const [savedJobs, setSavedJobs] = useState<number[]>([])

  const toggleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(savedJobs.filter(id => id !== jobId))
    } else {
      setSavedJobs([...savedJobs, jobId])
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      {/* Header */}
      <div className="bg-neutral-900 border-b border-neutral-800">
        <div className="container px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-6">Find Your Dream Job</h1>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <Input 
                placeholder="Job title, keywords, or company" 
                className="pl-10 bg-neutral-800 border-neutral-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-500" />
              <Input 
                placeholder="City, state, or remote" 
                className="pl-10 bg-neutral-800 border-neutral-700 text-white"
              />
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Search Jobs</Button>
          </div>
          
          {/* Filter Toggle */}
          <div className="mt-4">
            <Button 
              variant="outline" 
              className="border-neutral-700 text-neutral-400 hover:text-white"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 flex flex-wrap gap-4 p-4 bg-neutral-800/50 rounded-lg">
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Job Type</label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <Button
                      key={type}
                      variant={selectedType === type ? "default" : "outline"}
                      size="sm"
                      className={selectedType === type ? "bg-emerald-600" : "border-neutral-700"}
                      onClick={() => setSelectedType(type)}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-neutral-400 mb-2 block">Experience</label>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map((level) => (
                    <Button
                      key={level}
                      variant={selectedExperience === level ? "default" : "outline"}
                      size="sm"
                      className={selectedExperience === level ? "bg-emerald-600" : "border-neutral-700"}
                      onClick={() => setSelectedExperience(level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Job Listings */}
      <div className="container px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-neutral-400">{jobs.length} jobs found</p>
          <select className="bg-neutral-800 border-neutral-700 text-white rounded-md px-3 py-2">
            <option>Most Recent</option>
            <option>Highest Salary</option>
            <option>Most Relevant</option>
          </select>
        </div>
        
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="bg-neutral-900/50 border-neutral-800 hover:border-emerald-500/50 transition-all">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Company Logo Placeholder */}
                  <div className="w-16 h-16 rounded-lg bg-neutral-800 flex items-center justify-center">
                    <Briefcase className="h-8 w-8 text-neutral-600" />
                  </div>
                  
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white hover:text-emerald-400">
                          <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-neutral-400">{job.company}</p>
                      </div>
                      {job.featured && (
                        <Badge className="bg-emerald-500/20 text-emerald-400">Featured</Badge>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                        {job.remote && <Badge variant="outline" className="ml-2 text-xs">Remote</Badge>}
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        {job.salary}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.posted}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-neutral-700 text-neutral-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      className="border-neutral-700"
                      onClick={() => toggleSaveJob(job.id)}
                    >
                      {savedJobs.includes(job.id) ? (
                        <BookmarkCheck className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </Button>
                    <Link href={`/jobs/${job.id}`}>
                      <Button className="bg-emerald-600 hover:bg-emerald-700">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-neutral-700 text-white hover:bg-neutral-800">
            Load More Jobs
          </Button>
        </div>
      </div>
    </div>
  )
}
