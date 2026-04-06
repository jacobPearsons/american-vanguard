'use client'

import { useState, useEffect } from 'react'
import { FileText, Download, Eye, Search, Filter, FolderOpen, Video, Image, File } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Material {
  id: number
  title: string
  description?: string
  fileUrl: string
  fileType: string
  category: string
  uploadedAt: string
  courseName?: string
  courseCode?: string
}

interface CourseMaterialsProps {
  courseId?: number
  studentId?: string
}

export function CourseMaterials({ courseId, studentId }: CourseMaterialsProps) {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const params = new URLSearchParams()
    if (courseId) params.set('courseId', courseId.toString())
    if (studentId) params.set('studentId', studentId)

    fetch(`/api/courses/materials?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setMaterials(data.materials || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [courseId, studentId])

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description?.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || m.fileType === filter
    return matchesSearch && matchesFilter
  })

  const getFileIcon = (type: string) => {
    if (type.startsWith('video/') || type === 'video') return <Video className="w-5 h-5 text-red-400" />
    if (type.startsWith('image/') || type === 'image') return <Image className="w-5 h-5 text-green-400" />
    if (type === 'application/pdf' || type === 'pdf') return <FileText className="w-5 h-5 text-yellow-400" />
    return <File className="w-5 h-5 text-neutral-400" />
  }

  const getFileTypeLabel = (type: string) => {
    if (type.startsWith('video/') || type === 'video') return 'Video'
    if (type.startsWith('image/') || type === 'image') return 'Image'
    if (type === 'application/pdf' || type === 'pdf') return 'PDF'
    return 'Document'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:outline-none focus:border-yellow-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-yellow-500"
          >
            <option value="all">All Types</option>
            <option value="video">Videos</option>
            <option value="application/pdf">PDFs</option>
            <option value="image">Images</option>
          </select>
        </div>
      </div>

      {filteredMaterials.length === 0 ? (
        <div className="text-center py-16 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <FolderOpen className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400 text-lg">No materials found</p>
          <p className="text-neutral-500 text-sm mt-2">Check back later for course materials</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(material => (
            <div 
              key={material.id} 
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 hover:border-yellow-500/50 transition-colors group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-neutral-800 rounded-lg">
                  {getFileIcon(material.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white truncate group-hover:text-yellow-400 transition-colors">
                    {material.title}
                  </h4>
                  {material.description && (
                    <p className="text-sm text-neutral-400 mt-1 line-clamp-2">{material.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-neutral-800 text-neutral-400 rounded">
                      {getFileTypeLabel(material.fileType)}
                    </span>
                    {material.courseCode && (
                      <span className="text-xs text-yellow-600">{material.courseCode}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-800">
                <span className="text-xs text-neutral-500">
                  {new Date(material.uploadedAt).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" title="Preview">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Download">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CourseMaterials