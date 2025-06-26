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
import { createTaskSchema, type CreateTaskInput } from "@/lib/validation"

interface User {
  id: number
  email: string
  name?: string
}

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (taskData: CreateTaskInput & { userId?: number }) => void
  isAdmin: boolean
}

export function CreateTaskModal({ open, onOpenChange, onSubmit, isAdmin }: CreateTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [totalMinutes, setTotalMinutes] = useState("0")
  const [userId, setUserId] = useState<string>("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

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
      createTaskSchema.parse({
        title: title.trim(),
        description: description.trim(),
        totalMinutes: Number(totalMinutes),
      })
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

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const taskData: CreateTaskInput & { userId?: number } = {
        title: title.trim(),
        description: description.trim(),
        totalMinutes: Number(totalMinutes),
      }

      if (isAdmin && userId && userId !== "self") {
        taskData.userId = Number.parseInt(userId)
      }

      await onSubmit(taskData)
      handleClose()
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setTitle("")
    setDescription("")
    setTotalMinutes("0")
    setUserId("")
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalMinutes">Total Minutes *</Label>
            <Input
              id="totalMinutes"
              type="number"
              value={totalMinutes}
              onChange={(e) => setTotalMinutes(e.target.value)}
              placeholder="Enter total minutes"
              min="0"
              className={errors.totalMinutes ? "border-red-500" : ""}
            />
            {errors.totalMinutes && <p className="text-sm text-red-500">{errors.totalMinutes}</p>}
          </div>

          {isAdmin && users.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="assignedUser">Assign To</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to user (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="self">Assign to myself</SelectItem>
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
              {loading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
