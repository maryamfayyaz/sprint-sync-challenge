"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { CreateTaskModal } from "@/components/create-task-modal"
import { EditTaskModal } from "@/components/edit-task-modal"
import { AISuggestModal } from "@/components/ai-suggest-modal"
import { KanbanBoard } from "@/components/kanban-board"
import { AnalyticsChart } from "@/components/analytics-chart"
import { AdminPanel } from "@/components/admin-panel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Bot, LogOut, BarChart3, Users, Kanban } from "lucide-react"
import type { Task } from "@/types/task"
import { apiClient } from "@/lib/api-client"
import { logger } from "@/lib/logger"
import { createTaskSchema, updateTaskSchema, type CreateTaskInput, type UpdateTaskInput } from "@/lib/validation"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [totaltime, setTotalTime] = useState(0)
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [aiModalOpen, setAiModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const { user, logout, isAuthenticated, loading: authLoading } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated, authLoading, router])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      logger.apiCall("GET", "/tasks")
      const startTime = Date.now()

      // Fetch tasks based on user role
      const endpoint ="/tasks"
      const data = await apiClient.get(endpoint)
      const responseTime = Date.now() - startTime

      setTasks(data.tasks)
      setTotalTime(data.totalMinutes || 0)
      logger.apiSuccess("GET", endpoint, responseTime)
    } catch (error: any) {
      logger.apiError("GET", "/tasks", error)
      toast({
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (taskData: CreateTaskInput & { userId?: number }) => {
    try {
      // Validate the task data
      const validatedData = createTaskSchema.parse({
        title: taskData.title,
        description: taskData.description,
        totalMinutes: taskData.totalMinutes,
      })

      const payload = {
        ...validatedData,
        ...(taskData.userId && { userId: taskData.userId }),
      }

      logger.apiCall("POST", "/tasks", payload)
      const startTime = Date.now()

      await apiClient.post("/tasks", payload)
      const responseTime = Date.now() - startTime

      await fetchTasks()
      setCreateModalOpen(false)

      logger.apiSuccess("POST", "/tasks", responseTime)
      logger.info("Task created", { title: validatedData.title })

      toast({
        title: "Success",
        description: "Task created successfully!",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid task data",
          variant: "destructive",
        })
      } else {
        logger.apiError("POST", "/tasks", error)
        toast({
          title: "Error",
          description: error.message || "Failed to create task",
          variant: "destructive",
        })
      }
    }
  }

  const handleEditTask = async (id: number, taskData: UpdateTaskInput & { userId?: number }) => {
    try {
      // Validate the task data
      const validatedData = updateTaskSchema.parse({
        ...(taskData.title && { title: taskData.title }),
        ...(taskData.description && { description: taskData.description }),
        ...(taskData.totalMinutes !== undefined && { totalMinutes: taskData.totalMinutes }),
      })

      const payload = {
        ...validatedData,
        ...(taskData.userId !== undefined && { userId: taskData.userId }),
      }

      logger.apiCall("PUT", `/tasks/${id}`, payload)
      const startTime = Date.now()

      await apiClient.put(`/tasks/${id}`, payload)
      const responseTime = Date.now() - startTime

      await fetchTasks()
      setEditModalOpen(false)
      setEditingTask(null)

      logger.apiSuccess("PUT", `/tasks/${id}`, responseTime)
      logger.info("Task updated", { taskId: id, title: validatedData.title })

      toast({
        title: "Success",
        description: "Task updated successfully!",
      })
    } catch (error: any) {
      if (error.name === "ZodError") {
        toast({
          title: "Validation Error",
          description: error.errors[0]?.message || "Invalid task data",
          variant: "destructive",
        })
      } else {
        logger.apiError("PUT", `/tasks/${id}`, error)
        toast({
          title: "Error",
          description: error.message || "Failed to update task",
          variant: "destructive",
        })
      }
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      logger.apiCall("PATCH", `/tasks/${id}/status`, { status })
      const startTime = Date.now()

      // Optimistic update
      setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, status: status as Task["status"] } : task)))

      await apiClient.patch(`/tasks/${id}/status`, { status })
      const responseTime = Date.now() - startTime

      logger.apiSuccess("PATCH", `/tasks/${id}/status`, responseTime)
      logger.info("Task status updated", { taskId: id, newStatus: status })

      toast({
        title: "Success",
        description: `Task moved to ${status.replace("_", " ").toLowerCase()}!`,
      })
    } catch (error: any) {
      // Revert optimistic update on error
      await fetchTasks()
      logger.apiError("PATCH", `/tasks/${id}/status`, error)
      toast({
        title: "Error",
        description: error.message || "Failed to update task status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async (id: number) => {
    // Only admins can delete tasks
    if (!user?.isAdmin) {
      toast({
        title: "Access Denied",
        description: "Only administrators can delete tasks",
        variant: "destructive",
      })
      return
    }

    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      logger.apiCall("DELETE", `/tasks/${id}`)
      const startTime = Date.now()

      await apiClient.delete(`/tasks/${id}`)
      const responseTime = Date.now() - startTime

      await fetchTasks()

      logger.apiSuccess("DELETE", `/tasks/${id}`, responseTime)
      logger.info("Task deleted", { taskId: id })

      toast({
        title: "Success",
        description: "Task deleted successfully!",
      })
    } catch (error: any) {
      logger.apiError("DELETE", `/tasks/${id}`, error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete task",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (task: Task) => {
    // Check if user can edit this task
    const canEdit = user?.isAdmin || task.userId === user?.id

    if (!canEdit) {
      toast({
        title: "Access Denied",
        description: "You can only edit tasks assigned to you",
        variant: "destructive",
      })
      return
    }

    setEditingTask(task)
    setEditModalOpen(true)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SprintSync</h1>
              <p className="text-sm text-gray-500">
                {user?.isAdmin ? "Admin Dashboard - All Tasks" : "My Tasks Dashboard"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setAiModalOpen(true)}
                variant="outline"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <Bot className="w-4 h-4 mr-2" />
                AI Suggest
              </Button>
              <Button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Task
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="board" className="w-full">
          <TabsList className={`grid w-full ${user?.isAdmin ? "grid-cols-3" : "grid-cols-2"}`}>
            <TabsTrigger value="board" className="flex items-center gap-2">
              <Kanban className="w-4 h-4" />
              Board
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            {user?.isAdmin && (
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="board" className="mt-6">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Task Board</h2>
                <p className="text-gray-600">
                  {user?.isAdmin ? "Manage all tasks in the system" : "View and manage your assigned tasks"}
                </p>
              </div>
              <KanbanBoard
                tasks={tasks}
                onStatusChange={handleStatusChange}
                onEdit={handleEditClick}
                onDelete={handleDeleteTask}
                canDelete={user?.isAdmin || false}
              />
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsChart tasks={tasks} totalMinutes={totaltime} />
          </TabsContent>

          {user?.isAdmin && (
            <TabsContent value="users" className="mt-6">
              <AdminPanel />
            </TabsContent>
          )}
        </Tabs>
      </main>

      <CreateTaskModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateTask}
        isAdmin={user?.isAdmin || false}
      />

      <EditTaskModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        task={editingTask}
        onSubmit={handleEditTask}
        isAdmin={user?.isAdmin || false}
      />

      <AISuggestModal open={aiModalOpen} onOpenChange={setAiModalOpen} onTaskCreated={fetchTasks} />
    </div>
  )
}
