"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import type { Task } from "@/types/task"
import { updateTaskSchema, type UpdateTaskInput } from "@/lib/validation"

interface User {
  id: number
  email: string
  name?: string
}

interface EditTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task | null
  onSubmit: (id: number, taskData: UpdateTaskInput & { userId?: number }) => void
  isAdmin: boolean
}

export function EditTaskModal({ open, onOpenChange, task, onSubmit, isAdmin }: EditTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [totalMinutes, setTotalMinutes] = useState("")
  const [userId, setUserId] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setTotalMinutes(task.totalMinutes?.toString() || "")
      setUserId(task.userId?.toString() || "")
    }
  }, [task])

  useEffect(() => {
    if (open && isAdmin) {
      fetchUsers()
    }
  }, [open, isAdmin])

  const fetchUsers = async () => {
    try {
      const data = await apiClient.get("/users")
      setUsers(data)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      toast({
        title: "Warning",
        description: "Could not load users for assignment",
        variant: "destructive",
      })
    }
  }

  const validateForm = () => {
    try {
      const dataToValidate: any = {}

      if (title.trim()) dataToValidate.title = title.trim()
      if (description.trim()) dataToValidate.description = description.trim()
      if (totalMinutes) dataToValidate.totalMinutes = Number(totalMinutes)

      updateTaskSchema.parse(dataToValidate)
      setErrors({})
      return true
    } catch (error: any) {
      const newErrors: Record<string, string> = {}
      if (error.errors) {
        error.errors.forEach((err: any) => {
          newErrors[err.path[0]] = err.message
        })
      }
      setErrors(newErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task) return

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const taskData: UpdateTaskInput & { userId?: number } = {}

      if (title.trim()) taskData.title = title.trim()
      if (description.trim()) taskData.description = description.trim()
      if (totalMinutes) taskData.totalMinutes = Number(totalMinutes)

      if (userId && userId !== "unassigned") {
        taskData.userId = Number.parseInt(userId)
      } else if (userId === "unassigned") {
        taskData.userId = undefined
      }

      await onSubmit(task.id, taskData)
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    setTotalMinutes("")
    setUserId("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-minutes">Time Logged (minutes)</Label>
            <Input
              id="edit-minutes"
              type="number"
              value={totalMinutes}
              onChange={(e) => setTotalMinutes(e.target.value)}
              placeholder="Enter minutes worked"
              min="0"
              className={errors.totalMinutes ? "border-red-500" : ""}
            />
            {errors.totalMinutes && <p className="text-sm text-red-500">{errors.totalMinutes}</p>}
          </div>

          {isAdmin && users.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="edit-assignedUser">Assigned To</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select user (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id.toString()}>
                      {user.name || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? "Updating..." : "Update Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
