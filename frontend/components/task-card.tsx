"use client"

import type { Task } from "@/types/task"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Trash2, Clock, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface TaskCardProps {
  task: Task
  onStatusChange: (id: number, status: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  isDragging?: boolean
  canDelete?: boolean
}

export function TaskCard({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  isDragging = false,
  canDelete = false,
}: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "TODO":
        return "bg-gray-100 text-gray-800"
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800"
      case "DONE":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "TODO":
        return "To Do"
      case "IN_PROGRESS":
        return "In Progress"
      case "DONE":
        return "Done"
      default:
        return status
    }
  }

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case "TODO":
        return "IN_PROGRESS"
      case "IN_PROGRESS":
        return "DONE"
      case "DONE":
        return "TODO"
      default:
        return "TODO"
    }
  }

  const getNextStatusLabel = (currentStatus: string) => {
    switch (currentStatus) {
      case "TODO":
        return "Start Progress"
      case "IN_PROGRESS":
        return "Mark Done"
      case "DONE":
        return "Reopen"
      default:
        return "Update Status"
    }
  }

  const getStatusTimestamp = (task: Task) => {
    switch (task.status) {
      case "IN_PROGRESS":
        return task.inProgressAt
          ? `Started ${formatDistanceToNow(new Date(task.inProgressAt), { addSuffix: true })}`
          : null
      case "DONE":
        return task.completedAt
          ? `Completed ${formatDistanceToNow(new Date(task.completedAt), { addSuffix: true })}`
          : null
      default:
        return null
    }
  }

  return (
    <div
      className={cn(
        "bg-white border rounded-lg p-4 hover:shadow-md transition-all duration-200 group",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-lg",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate mb-1">{task.title}</h4>
          <Badge className={`${getStatusColor(task.status)} text-xs`}>{getStatusLabel(task.status)}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-red-600">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-3">{task.description}</p>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center gap-3">
          {task.totalMinutes && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {task.totalMinutes}m logged
            </div>
          )}
          {task.assignedUser && (
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {task.assignedUser.name || task.assignedUser.email}
            </div>
          )}
        </div>
      </div>

      {getStatusTimestamp(task) && <div className="text-xs text-gray-500 mb-3 italic">{getStatusTimestamp(task)}</div>}

      <Button
        size="sm"
        variant="outline"
        onClick={() => onStatusChange(task.id, getNextStatus(task.status))}
        className="w-full bg-white text-gray-700 border-gray-300 hover:bg-gray-50 text-xs"
      >
        {getNextStatusLabel(task.status)}
      </Button>
    </div>
  )
}
