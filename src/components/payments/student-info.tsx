/**
 * StudentInfo Component
 * Displays student profile information in the sidebar
 */

import Link from 'next/link'
import { User, Lock, Edit, PowerOff } from 'lucide-react'
import type { StudentInfo as StudentInfoType } from '@/types/studentPayments'

interface StudentInfoProps {
  student: StudentInfoType | null
  loading?: boolean
}

export function StudentInfo({ student, loading }: StudentInfoProps) {
  if (loading || !student) {
    return (
      <div className="about-author">
        <div className="quote bg-white p-3">
          <div className="flex justify-end items-center">
            <Link
              href="?logout=1"
              className="btn btn-info btn-danger pull-right m-r-2 tooltip_"
            >
              <span className="tooltiptext">Logout</span>
              <PowerOff className="w-4 h-4" />
            </Link>
            <Link
              href="javascript:;"
              className="btn btn-info btn-info pull-right m-r-2"
            >
              <Lock className="w-4 h-4" />
            </Link>
            <Link
              href="#profile/edit_biodata"
              className="btn btn-info btn-green pull-right m-r-2 tooltip_"
            >
              <span className="tooltiptext">Profile</span>
              <User className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="author bg-white p-3">
          <div className="image">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </div>
          <div className="info">
            <small className="text-xs text-gray-500">2005003013</small>
            <div className="text-sm font-semibold text-gray-800">ADENIYI VICTOR AYOMIDE</div>
            <small className="text-xs text-gray-500"></small>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500'
      case 'Inactive':
        return 'bg-gray-500'
      case 'Graduated':
        return 'bg-yellow-500'
      case 'Suspended':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="about-author">
      <div className="quote bg-white p-3">
        <div className="flex justify-end items-center">
          <Link
            href="?logout=1"
            className="btn btn-info btn-danger pull-right m-r-2 tooltip_"
          >
            <span className="tooltiptext">Logout</span>
            <PowerOff className="w-4 h-4" />
          </Link>
          <Link
            href="javascript:;"
            className="btn btn-info btn-info pull-right m-r-2"
          >
            <Lock className="w-4 h-4" />
          </Link>
          <Link
            href="#profile/edit_biodata"
            className="btn btn-info btn-green pull-right m-r-2 tooltip_"
          >
            <span className="tooltiptext">Profile</span>
            <User className="w-4 h-4" />
            Edit Profile
          </Link>
        </div>
        <div className="clearfix"></div>
      </div>
      <div className="author bg-white p-3">
        <div className="image">
          {student.profileImage ? (
            <img
              src={student.profileImage}
              alt={student.fullName}
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <div className="info">
          <small className="text-xs text-gray-500">{student.matricNumber}</small>
          <div className="text-sm font-semibold text-gray-800">{student.fullName}</div>
          <small className="text-xs text-gray-500"></small>
        </div>
      </div>

      {/* Student Details Table */}
      <div className="mt-4">
        <table className="table table-bordered table-striped bg-white f-s-10 w-full">
          <tbody>
            <tr>
              <td colSpan={1}><b>MATRIC NO.</b> </td>
              <td colSpan={3}> {student.matricNumber} </td>
            </tr>
            <tr>
              <td colSpan={1}><b>REG. NO.</b> </td>
              <td colSpan={3}> {student.regNumber} </td>
            </tr>
            <tr>
              <td colSpan={1}><b>FACULTY</b> </td>
              <td colSpan={3}> {student.faculty} </td>
            </tr>
            <tr>
              <td colSpan={1}><b>DEPARTMENT</b> </td>
              <td colSpan={3}> {student.department} </td>
            </tr>
            <tr>
              <td colSpan={1}><b>PROGRAMME</b> </td>
              <td colSpan={3}> {student.programme} </td>
            </tr>
            <tr>
              <td><b>LEVEL</b></td>
              <td>{student.level}</td>
              <td><b>STATUS</b></td>
              <td><span className={`px-2 py-0.5 text-white text-[10px] rounded-full ${getStatusColor(student.status)}`}>
                {student.status}
              </span></td>
            </tr>

            <tr>
              <td><b>SESSION</b></td>
              <td>{student.session}</td>
              <td colSpan={2}>{student.semester}</td>
            </tr>

            <tr>
              <td><b>ENTRY MODE</b></td>
              <td>{student.entryMode}</td>
              <td><b>ENTRY YEAR</b></td>
              <td>{student.entryYear}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
