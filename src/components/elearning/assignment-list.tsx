'use client'

import { useState } from 'react'
import { FileText, Upload, Clock, CheckCircle, AlertCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Assignment {
  id: number
  courseCode: string
  courseName: string
  title: string
  description?: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded'
  grade?: number
  maxGrade?: number
  fileUrl?: string
  submittedAt?: string
  feedback?: string
}

interface AssignmentListProps {
  courseId?: number
}

export function AssignmentList({ courseId }: AssignmentListProps) {
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  const mockAssignments: Assignment[] = [
    { id: 1, courseCode: 'EEE 501', courseName: 'Advanced Power Systems', title: 'Power System Analysis', description: 'Analyze the given power system network and submit your findings.', dueDate: '2026-04-15', status: 'pending', maxGrade: 100 },
    { id: 2, courseCode: 'EEE 503', courseName: 'Digital Signal Processing', title: 'DSP Implementation', description: 'Implement the FFT algorithm and submit your code.', dueDate: '2026-04-10', status: 'submitted', submittedAt: '2026-04-09', maxGrade: 50 },
    { id: 3, courseCode: 'EEE 505', courseName: 'Control Systems II', title: 'Controller Design', description: 'Design a PID controller for the given system.', dueDate: '2026-03-25', status: 'graded', grade: 85, maxGrade: 100, feedback: 'Good work! Consider adding more analysis.' },
    { id: 4, courseCode: 'CSC 401', courseName: 'Data Structures', title: 'Binary Tree Implementation', description: 'Implement a balanced binary search tree.', dueDate: '2026-04-20', status: 'pending', maxGrade: 75 },
  ]

  const assignments = courseId 
    ? mockAssignments.filter(a => a.courseCode === 'EEE 501')
    : mockAssignments

  const pending = assignments.filter(a => a.status === 'pending')
  const submitted = assignments.filter(a => a.status === 'submitted')
  const graded = assignments.filter(a => a.status === 'graded')

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-500" />
            Pending ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map(assignment => (
              <div 
                key={assignment.id}
                onClick={() => setSelectedAssignment(assignment)}
                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-yellow-500/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-sm font-medium">{assignment.courseCode}</span>
                      {isOverdue(assignment.dueDate) && (
                        <span className="text-xs px-2 py-0.5 bg-red-900/30 text-red-400 rounded">Overdue</span>
                      )}
                    </div>
                    <h4 className="font-semibold text-white">{assignment.title}</h4>
                    <p className="text-sm text-neutral-400 mt-1 line-clamp-1">{assignment.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Due: {formatDate(assignment.dueDate)}
                      </span>
                      <span>• {assignment.maxGrade} pts</span>
                    </div>
                  </div>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Submit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {submitted.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-yellow-500" />
            Submitted ({submitted.length})
          </h3>
          <div className="space-y-3">
            {submitted.map(assignment => (
              <div key={assignment.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-sm font-medium">{assignment.courseCode}</span>
                      <span className="text-xs px-2 py-0.5 bg-yellow-900/30 text-yellow-400 rounded">Awaiting Grade</span>
                    </div>
                    <h4 className="font-semibold text-white">{assignment.title}</h4>
                    <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                      <span>Submitted: {assignment.submittedAt ? formatDate(assignment.submittedAt) : 'N/A'}</span>
                      <span>• {assignment.maxGrade} pts</span>
                    </div>
                  </div>
                  <div className="text-yellow-500">
                    <Upload className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {graded.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Graded ({graded.length})
          </h3>
          <div className="space-y-3">
            {graded.map(assignment => (
              <div key={assignment.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-yellow-500 text-sm font-medium">{assignment.courseCode}</span>
                    </div>
                    <h4 className="font-semibold text-white">{assignment.title}</h4>
                    {assignment.feedback && (
                      <p className="text-sm text-neutral-400 mt-2 p-3 bg-neutral-800/50 rounded-lg">
                        <span className="text-neutral-500 text-xs">Feedback:</span> {assignment.feedback}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-white">
                      {assignment.grade}<span className="text-neutral-500 text-sm">/{assignment.maxGrade}</span>
                    </p>
                    <p className="text-xs text-neutral-500">
                      {Math.round((assignment.grade! / assignment.maxGrade!) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {assignments.length === 0 && (
        <div className="text-center py-12 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <FileText className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
          <p className="text-neutral-400">No assignments found</p>
        </div>
      )}
    </div>
  )
}

export default AssignmentList