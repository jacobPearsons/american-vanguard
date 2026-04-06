'use client'

import { useState, useEffect } from 'react'
import { FolderOpen, FileText, Download, Eye, Search, Upload, Image, Video, File, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Material {
  id: number
  title: string
  description?: string
  fileUrl: string
  fileType: string
  category: 'lecture' | 'reading' | 'assignment' | 'reference'
  uploadedAt: string
  uploadedBy: string
}

interface MaterialManagerProps {
  courseId: number
  courseCode: string
  isAdmin?: boolean
}

export function MaterialManager({ courseId, courseCode, isAdmin = false }: MaterialManagerProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('all')
  const [showUpload, setShowUpload] = useState(false)

  useEffect(() => {
    fetch(`/api/courses/${courseId}/materials`)
      .then(res => res.json())
      .then(data => {
        setMaterials(data.materials || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [courseId])

  const mockMaterials: Material[] = [
    { id: 1, title: 'Lecture 1 - Introduction', description: 'Introduction to Power Systems basics', fileUrl: '#', fileType: 'application/pdf', category: 'lecture', uploadedAt: '2025-09-01', uploadedBy: 'Dr. Adeyemi' },
    { id: 2, title: 'Lecture 2 - Generation', description: 'Power Generation Technologies', fileUrl: '#', fileType: 'application/pdf', category: 'lecture', uploadedAt: '2025-09-08', uploadedBy: 'Dr. Adeyemi' },
    { id: 3, title: 'Power System Analysis Textbook', description: 'Chapter 1-3 readings', fileUrl: '#', fileType: 'application/pdf', category: 'reading', uploadedAt: '2025-09-01', uploadedBy: 'Dr. Adeyemi' },
    { id: 4, title: 'IEEE Paper on Smart Grid', description: 'Recent research on grid modernization', fileUrl: '#', fileType: 'application/pdf', category: 'reference', uploadedAt: '2025-09-15', uploadedBy: 'Dr. Adeyemi' },
    { id: 5, title: 'Assignment 1 - Problem Set', description: 'First assignment on power system fundamentals', fileUrl: '#', fileType: 'application/pdf', category: 'assignment', uploadedAt: '2025-09-10', uploadedBy: 'Dr. Adeyemi' },
    { id: 6, title: 'Lecture Recording - Week 3', description: 'Video recording of week 3 lecture', fileUrl: '#', fileType: 'video/mp4', category: 'lecture', uploadedAt: '2025-09-15', uploadedBy: 'Dr. Adeyemi' },
  ]

  const displayMaterials = materials.length > 0 ? materials : mockMaterials

  const filteredMaterials = displayMaterials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || m.category === category
    return matchesSearch && matchesCategory
  })

  const groupedMaterials = filteredMaterials.reduce((acc, m) => {
    if (!acc[m.category]) acc[m.category] = []
    acc[m.category].push(m)
    return acc
  }, {} as Record<string, Material[]>)

  const getFileIcon = (type: string) => {
    if (type.startsWith('video')) return <Video className="w-5 h-5 text-red-400" />
    if (type.startsWith('image')) return <Image className="w-5 h-5 text-green-400" />
    if (type === 'application/pdf') return <FileText className="w-5 h-5 text-yellow-400" />
    return <File className="w-5 h-5 text-neutral-400" />
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'lecture': return 'Lecture Notes'
      case 'reading': return 'Readings'
      case 'assignment': return 'Assignments'
      case 'reference': return 'Reference Materials'
      default: return cat
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Categories</option>
            <option value="lecture">Lectures</option>
            <option value="reading">Readings</option>
            <option value="assignment">Assignments</option>
            <option value="reference">References</option>
          </select>

          {isAdmin && (
            <Button 
              onClick={() => setShowUpload(!showUpload)}
              className="bg-yellow-600 hover:bg-yellow-700 gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <FolderOpen className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400">No materials found</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedMaterials).map(([cat, mats]) => (
            <div key={cat}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-yellow-500" />
                {getCategoryLabel(cat)}
                <span className="text-sm font-normal text-neutral-500">({mats.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mats.map(material => (
                  <div 
                    key={material.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-yellow-500/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-neutral-800 rounded-lg">
                        {getFileIcon(material.fileType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{material.title}</h4>
                        {material.description && (
                          <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{material.description}</p>
                        )}
                        <p className="text-xs text-neutral-500 mt-2">
                          {new Date(material.uploadedAt).toLocaleDateString()} • {material.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-800">
                      <Button size="sm" variant="ghost" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="ghost" className="flex-1">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MaterialManager