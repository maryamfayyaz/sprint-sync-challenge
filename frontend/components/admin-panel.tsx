"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreateUserModal } from "@/components/create-user-modal"
import { useToast } from "@/hooks/use-toast"
import { Users, TrendingUp, Plus } from "lucide-react"
import { apiClient } from "@/lib/api-client"
import { logger } from "@/lib/logger"
import type { CreateUserInput } from "@/lib/validation"

interface User {
  id: number
  email: string
  name?: string
  isAdmin: boolean
  createdAt?: string
}

interface TopUserStats {
  userId: number
  email: string
  name?: string
  totalTasks: number
  completedTasks: number
  totalMinutes: number
  avgCompletionTime?: number // in hours
  tasksCompletedThisWeek?: number
}

export function AdminPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [topUsers, setTopUsers] = useState<TopUserStats[]>([])
  const [loading, setLoading] = useState(true)
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)

      // Fetch all users
      logger.apiCall("GET", "/users")
      const usersData = await apiClient.get("/users")
      setUsers(usersData)
      logger.apiSuccess("GET", "/users")

      // Fetch top users stats if endpoint exists
      try {
        logger.apiCall("GET", "/stats/top-users")
        const topUsersData = await apiClient.get("/stats/top-users")
        setTopUsers(topUsersData)
        logger.apiSuccess("GET", "/stats/top-users")
      } catch (error) {
        // Endpoint might not exist, that's okay
        logger.warn("Top users endpoint not available", error)
      }
    } catch (error: any) {
      logger.apiError("GET", "/users", error)
      toast({
        title: "Error",
        description: "Failed to fetch admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData: CreateUserInput) => {
    try {
      logger.apiCall("POST", "/users", userData)
      const startTime = Date.now()

      await apiClient.post("/users", userData)
      const responseTime = Date.now() - startTime

      await fetchAdminData()
      setCreateUserModalOpen(false)

      logger.apiSuccess("POST", "/users", responseTime)
      logger.info("User created", { email: userData.email })

      toast({
        title: "Success",
        description: "User created successfully!",
      })
    } catch (error: any) {
      logger.apiError("POST", "/users", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-lg">Loading admin data...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h2>
          <p className="text-gray-600">Manage users and view system statistics</p>
        </div>
        <Button onClick={() => setCreateUserModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{users.filter((u) => u.isAdmin).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage system users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium text-gray-900">{user.name || user.email}</p>
                      {user.name && <p className="text-sm text-gray-500">{user.email}</p>}
                    </div>
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>{user.isAdmin ? "Admin" : "User"}</Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-500">ID: {user.id}</div>
              </div>
            ))}
            {users.length === 0 && <div className="text-center text-gray-400 py-8">No users found</div>}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      {topUsers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Performers
            </CardTitle>
            <CardDescription>Users with the most activity and completed tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers
                .sort((a, b) => b.completedTasks - a.completedTasks)
                .slice(0, 10)
                .map((user, index) => (
                  <div key={user.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name || user.email}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{user.totalTasks} tasks</span>
                          <span>{user.completedTasks} completed</span>
                          <span>{Math.round((user.totalMinutes / 60) * 10) / 10}h logged</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">
                        {user.completedTasks > 0 ? Math.round((user.completedTasks / user.totalTasks) * 100) : 0}%
                      </div>
                      <div className="text-xs text-gray-500">completion</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <CreateUserModal open={createUserModalOpen} onOpenChange={setCreateUserModalOpen} onSubmit={handleCreateUser} />
    </div>
  )
}
