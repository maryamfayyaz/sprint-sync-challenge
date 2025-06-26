// @ts-nocheck
"use client"

import type React from "react"

import { useState } from "react"
import type { Task } from "@/types/task"
import { TaskCard } from "./task-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KanbanBoardProps {
  tasks: Task[]
  onStatusChange: (id: number, status: string) => void
  onEdit: (task: Task) => void
  onDelete: (id: number) => void
  canDelete?: boolean
}

export function KanbanBoard({ tasks, onStatusChange, onEdit, onDelete, canDelete = false }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const todoTasks = tasks.filter((task) => task.status === "TODO")
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS")
  const doneTasks = tasks.filter((task) => task.status === "DONE")

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault()
    if (draggedTask && draggedTask.status !== newStatus) {
      onStatusChange(draggedTask.id, newStatus)
    }
    setDraggedTask(null)
  }

  const KanbanColumn = ({
    title,
    tasks,
    status,
    color,
  }: {
    title: string
    tasks: Task[]
    status: string
    color: string
  }) => {
    const getColumnStats = () => {
      const totalMinutes = tasks.reduce((sum, task) => sum + (task.totalMinutes || 0), 0)
      const recentlyUpdated = tasks.filter((task) => {
        const relevantDate = task.completedAt || task.inProgressAt || task.updatedAt
        if (!relevantDate) return false
        const daysDiff = (Date.now() - new Date(relevantDate).getTime()) / (1000 * 60 * 60 * 24)
        return daysDiff <= 1
      }).length

      return { totalMinutes, recentlyUpdated }
    }

    const stats = getColumnStats()

    return (
      <Card className="flex-1 min-w-0 h-fit" onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, status)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={color}>
                {tasks.length}
              </Badge>
              {stats.recentlyUpdated > 0 && (
                <Badge variant="outline" className="text-xs">
                  {stats.recentlyUpdated} recent
                </Badge>
              )}
            </div>
          </div>
          {stats.totalMinutes > 0 && (
            <p className="text-xs text-gray-500">{Math.round((stats.totalMinutes / 60) * 10) / 10}h logged</p>
          )}
        </CardHeader>
        <CardContent className="space-y-3 min-h-[400px]">
          {tasks.map((task) => (
            <div key={task.id} draggable onDragStart={(e) => handleDragStart(e, task)} className="cursor-move">
              <TaskCard
                task={task}
                onStatusChange={onStatusChange}
                onEdit={onEdit}
                onDelete={onDelete}
                isDragging={draggedTask?.id === task.id}
                canDelete={canDelete}
                showTimestamps={true}
              />
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-center text-gray-400 py-12 border-2 border-dashed border-gray-200 rounded-lg">
              <p>Drop tasks here</p>
              <p className="text-sm">or create a new one</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Mobile view - stacked columns */}
      <div className="block lg:hidden space-y-6">
        <KanbanColumn title="To Do" tasks={todoTasks} status="TODO" color="bg-gray-100 text-gray-800" />
        <KanbanColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="IN_PROGRESS"
          color="bg-blue-100 text-blue-800"
        />
        <KanbanColumn title="Done" tasks={doneTasks} status="DONE" color="bg-green-100 text-green-800" />
      </div>

      {/* Desktop view - side by side columns */}
      <div className="hidden lg:flex gap-6">
        <KanbanColumn title="To Do" tasks={todoTasks} status="TODO" color="bg-gray-100 text-gray-800" />
        <KanbanColumn
          title="In Progress"
          tasks={inProgressTasks}
          status="IN_PROGRESS"
          color="bg-blue-100 text-blue-800"
        />
        <KanbanColumn title="Done" tasks={doneTasks} status="DONE" color="bg-green-100 text-green-800" />
      </div>
    </div>
  )
}
