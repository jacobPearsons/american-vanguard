import * as React from "react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export interface Column {
  key: string
  header: string
  render?: (row: unknown) => React.ReactNode
  className?: string
}

interface DataTableProps {
  columns: Column[]
  data: unknown[]
  emptyMessage?: string
  loading?: boolean
  className?: string
  getRowId: (row: unknown) => string | number
  caption?: string
}

export function DataTable({
  columns,
  data,
  emptyMessage = "No data available",
  loading = false,
  className,
  getRowId,
  caption
}: DataTableProps) {
  if (loading) {
    return (
      <Card className="bg-neutral-900 border-neutral-800">
        <CardContent className="flex items-center justify-center py-8" role="status" aria-label="Loading data">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-600"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("bg-neutral-900 border-neutral-800", className)}>
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="text-center py-8 text-neutral-400" role="status">
            {emptyMessage}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              {caption && <caption className="sr-only">{caption}</caption>}
              <thead>
                <tr className="border-b border-neutral-800">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      scope="col"
                      className={cn(
                        "px-4 py-3 text-left text-sm font-medium text-neutral-400",
                        col.className
                      )}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => {
                  const rowData = row as Record<string, unknown>
                  return (
                    <tr key={getRowId(row)} className="border-t border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn("px-4 py-3", col.className)}
                        >
                          {col.render
                            ? col.render(row)
                            : String(rowData[col.key] ?? '')}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}